import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { sampleRandom } from "@/lib/shuffle";
import type { Locale } from "@/i18n/routing";
import QuizRunner from "./QuizRunner";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string; versionId: string }>;
}) {
  const { locale, slug, versionId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quiz");

  const quizVersion = await prisma.quizVersion.findUnique({
    where: { id: versionId },
    include: { quiz: true, questions: true },
  });

  if (!quizVersion || quizVersion.quiz.slug !== slug) notFound();

  const quiz = quizVersion.quiz;

  // Draw a random subset (this version's configured size) from its own pool,
  // so a growing question bank doesn't force every candidate through every
  // question — mirrors how the real exam draws from a larger bank.
  const picked = sampleRandom(quizVersion.questions, quizVersion.questionsPerAttempt);

  const questions = picked.map((q) => ({
    id: q.id,
    text: locale === "ar" ? q.textAr : q.textFr,
    choices: JSON.parse(locale === "ar" ? q.choicesAr : q.choicesFr) as string[],
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-1 text-sm font-medium text-forest-700">
        {locale === "ar" ? quiz.ministereAr : quiz.ministereFr} ·{" "}
        {t("versionLabel", { number: quizVersion.versionNumber })}
      </p>
      <h1 className="font-display mb-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
        {locale === "ar" ? quiz.titleAr : quiz.titleFr}
      </h1>
      <p className="mb-8 text-ink-soft">{locale === "ar" ? quiz.descriptionAr : quiz.descriptionFr}</p>

      <QuizRunner slug={quiz.slug} versionId={quizVersion.id} questions={questions} />
    </div>
  );
}
