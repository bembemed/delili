import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TRIAL_QUESTION_COUNT } from "@/lib/trial";

const submitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      given: z.array(z.number().int().min(0).max(3)),
    })
  ),
  locale: z.enum(["ar", "fr"]).optional(),
  versionId: z.string().min(1),
});

function sameSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();

  // Full access (saved attempt, no size cap) requires an approved
  // subscription to this exact exam. Everyone else — anonymous visitors,
  // or a logged-in candidate still awaiting approval — gets scored as a
  // free trial instead: capped to TRIAL_QUESTION_COUNT answers and never
  // saved to their history.
  let isFullAccess = false;
  if (session?.user?.id && session.user.examSlug === slug) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionStatus: true },
    });
    isFullAccess = dbUser?.subscriptionStatus === "APPROVED";
  }

  const body = await req.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const { answers, locale = "ar", versionId } = parsed.data;

  if (!isFullAccess && answers.length > TRIAL_QUESTION_COUNT) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({ where: { slug } });
  if (!quiz) {
    return NextResponse.json({ error: "QUIZ_NOT_FOUND" }, { status: 404 });
  }

  const quizVersion = await prisma.quizVersion.findUnique({ where: { id: versionId } });
  if (!quizVersion || quizVersion.quizId !== quiz.id) {
    return NextResponse.json({ error: "VERSION_NOT_FOUND" }, { status: 404 });
  }

  // Fetch exactly the questions the candidate was actually shown (by id),
  // scoped to this specific version so a crafted questionId from another
  // version or quiz can't be used.
  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds }, quizVersionId: quizVersion.id },
  });

  if (questions.length !== answers.length) {
    return NextResponse.json({ error: "ANSWER_COUNT_MISMATCH" }, { status: 400 });
  }

  const questionById = new Map(questions.map((q) => [q.id, q]));

  let score = 0;
  const detail = answers.map(({ questionId, given }) => {
    const q = questionById.get(questionId)!;
    const correctIndices = JSON.parse(q.correctIndices) as number[];
    const correct = sameSet(given, correctIndices);
    if (correct) score++;
    return {
      questionId: q.id,
      text: locale === "ar" ? q.textAr : q.textFr,
      choices: JSON.parse(locale === "ar" ? q.choicesAr : q.choicesFr) as string[],
      correctIndices,
      given,
      correct,
      explanation: locale === "ar" ? q.explanationAr : q.explanationFr,
    };
  });

  if (!isFullAccess) {
    return NextResponse.json({ score, total: answers.length, detail });
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId: session!.user.id,
      quizId: quiz.id,
      quizVersionId: quizVersion.id,
      score,
      total: answers.length,
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json({
    attemptId: attempt.id,
    score,
    total: answers.length,
    detail,
  });
}
