/**
 * Import a QCM exam bank from a source PDF using the Claude API.
 *
 * Usage:
 *   npx tsx scripts/import-quiz-from-pdf.ts \
 *     --pdf source-exams/mon-examen.pdf \
 *     --slug mon-corps \
 *     --ministere MF \
 *     --ministere-fr "Ministère des Finances" \
 *     --ministere-ar "وزارة المالية" \
 *     --corps-fr "Inspecteur des douanes" \
 *     --corps-ar "مفتش الجمارك" \
 *     [--min-questions 20] [--max-tokens 16000] [--out scripts/generated/mon-corps.json] [--commit]
 *
 * Without --commit, the script only extracts, validates, and writes a JSON
 * file for review. Pass --commit to also upsert the quiz + questions
 * directly into the local SQLite database (same shape as prisma/seed.ts).
 *
 * Requires ANTHROPIC_API_KEY in the environment or in .env.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

try {
  // Node 20.6+/22+: loads ANTHROPIC_API_KEY etc. from .env if present.
  (process as unknown as { loadEnvFile?: (path?: string) => void }).loadEnvFile?.();
} catch {
  // .env not present or loadEnvFile unavailable on this Node version — ignore.
}

const QuestionSchema = z.object({
  textFr: z.string().min(1),
  textAr: z.string().min(1),
  choicesFr: z.array(z.string().min(1)).length(4),
  choicesAr: z.array(z.string().min(1)).length(4),
  // Indices (0-3) of every correct choice: can be empty (no correct answer
  // among the choices), a single index, or several.
  correctIndices: z.array(z.number().int().min(0).max(3)).max(4),
  explanationFr: z.string().min(1),
  explanationAr: z.string().min(1),
});

const ExtractionSchema = z.object({
  questions: z.array(QuestionSchema),
});

type Question = z.infer<typeof QuestionSchema>;

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function requireString(args: Record<string, string | boolean>, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing required argument: --${key}`);
  }
  return value;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const pdfPath = resolve(requireString(args, "pdf"));
  const slug = requireString(args, "slug");
  const ministere = requireString(args, "ministere");
  const ministereFr = requireString(args, "ministere-fr");
  const ministereAr = requireString(args, "ministere-ar");
  const corpsFr = requireString(args, "corps-fr");
  const corpsAr = requireString(args, "corps-ar");
  const minQuestions = Number(args["min-questions"] ?? 20);
  const maxTokens = Number(args["max-tokens"] ?? 16000);
  const outPath = resolve(
    typeof args.out === "string" ? args.out : `scripts/generated/${slug}.json`
  );
  const commit = args.commit === true;

  if (!existsSync(pdfPath)) {
    throw new Error(`PDF not found: ${pdfPath}`);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Export it in your shell or add it to .env before running this script."
    );
  }

  console.log(`Reading ${pdfPath}...`);
  const pdfBase64 = readFileSync(pdfPath).toString("base64");

  const client = new Anthropic();

  const instructions = `Tu es un expert en préparation aux concours de la fonction publique mauritanienne.

Le document ci-joint (PDF) contient une banque de questions à choix multiples (QCM), ou un contenu à partir duquel des questions QCM peuvent être formulées, destinée au corps/spécialité : "${corpsFr}" / "${corpsAr}".

Tâche : extrais ou compose une liste de questions QCM à partir de ce document, en respectant strictement ces règles :

1. Chaque question doit avoir EXACTEMENT 4 choix de réponse. Le nombre de réponses correctes (correctIndices) peut être ZÉRO (aucun des 4 choix n'est correct), UNE SEULE, ou PLUSIEURS — reflète fidèlement ce qui est indiqué dans le document source, sans forcer artificiellement une seule bonne réponse. Ne devine jamais : si le document indique explicitement plusieurs bonnes réponses, inclus tous leurs indices dans correctIndices.
2. Si une question est trop ambiguë pour déterminer avec certitude quelles réponses sont correctes (même en autorisant zéro ou plusieurs réponses), IGNORE cette question entièrement plutôt que de deviner.
3. Fournis le texte de la question, les 4 choix, et une explication courte (une phrase) de la ou des bonne(s) réponse(s) — ou de l'absence de bonne réponse le cas échéant — à la fois en français (textFr, choicesFr, explanationFr) ET en arabe (textAr, choicesAr, explanationAr). Si le document source est dans une seule langue, traduis fidèlement vers l'autre langue avec un registre professionnel adapté à un site de préparation aux concours administratifs. Si le document cite un article ou une référence légale précise, mentionne-la dans l'explication.
4. Ne fabrique aucun fait qui ne soit pas présent ou clairement déductible du document. En cas de doute sur une traduction, reste fidèle et concis plutôt que créatif.
5. N'invente pas de questions hors-sujet par rapport au contenu du document.
6. Retourne uniquement les questions extraites, sans commentaire additionnel.`;

  console.log("Calling the Claude API to extract questions (this may take a minute)...");

  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: maxTokens,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: pdfBase64,
            },
          },
          { type: "text", text: instructions },
        ],
      },
    ],
    output_config: {
      format: zodOutputFormat(ExtractionSchema),
    },
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error(
      `Claude did not return a structured result (stop_reason: ${response.stop_reason}). Try increasing --max-tokens or splitting the PDF.`
    );
  }

  const questions: Question[] = parsed.questions;

  console.log(`Extracted ${questions.length} question(s).`);
  if (questions.length < minQuestions) {
    console.warn(
      `⚠️  Only ${questions.length} question(s) extracted, below the requested minimum of ${minQuestions}. Review the source PDF or supplement manually.`
    );
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify({ slug, ministere, ministereFr, ministereAr, corpsFr, corpsAr, questions }, null, 2), "utf8");
  console.log(`Wrote extracted questions to ${outPath}`);

  if (!commit) {
    console.log("\nDry run only (no --commit passed). Review the JSON above, then re-run with --commit to write to the database, or merge it into prisma/seed.ts by hand.");
    return;
  }

  console.log("\n--commit passed: writing to the local database...");
  const { prisma } = await import("../src/lib/prisma");

  const titleFr = `Examen blanc — ${corpsFr}`;
  const titleAr = `اختبار تجريبي — ${corpsAr}`;
  const descriptionFr = `${questions.length} questions pour vous préparer au poste de ${corpsFr}.`;
  const descriptionAr = `${questions.length} سؤالاً للاستعداد لمنصب ${corpsAr}.`;

  const quiz = await prisma.quiz.upsert({
    where: { slug },
    update: { ministere, ministereFr, ministereAr, corpsFr, corpsAr, titleFr, titleAr, descriptionFr, descriptionAr },
    create: { slug, ministere, ministereFr, ministereAr, corpsFr, corpsAr, titleFr, titleAr, descriptionFr, descriptionAr },
  });

  await prisma.question.deleteMany({ where: { quizId: quiz.id } });

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await prisma.question.create({
      data: {
        quizId: quiz.id,
        textFr: q.textFr,
        textAr: q.textAr,
        choicesFr: JSON.stringify(q.choicesFr),
        choicesAr: JSON.stringify(q.choicesAr),
        correctIndices: JSON.stringify(q.correctIndices),
        explanationFr: q.explanationFr,
        explanationAr: q.explanationAr,
        order: i,
      },
    });
  }

  console.log(`Committed quiz "${slug}" with ${questions.length} question(s) to the database.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
