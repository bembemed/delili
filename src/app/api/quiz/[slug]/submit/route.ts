import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const submitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      given: z.array(z.number().int().min(0).max(3)),
    })
  ),
  locale: z.enum(["ar", "fr"]).optional(),
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
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  // The session cookie can outlive the underlying account (e.g. an admin
  // deleted the user). Guard against a stale id instead of failing on the
  // Attempt insert's foreign key constraint below.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, subscriptionStatus: true },
  });
  if (!dbUser) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }
  if (dbUser.subscriptionStatus !== "APPROVED") {
    return NextResponse.json({ error: "SUBSCRIPTION_NOT_APPROVED" }, { status: 403 });
  }

  const { slug } = await params;
  if (session.user.examSlug && session.user.examSlug !== slug) {
    return NextResponse.json({ error: "WRONG_EXAM" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({ where: { slug } });
  if (!quiz) {
    return NextResponse.json({ error: "QUIZ_NOT_FOUND" }, { status: 404 });
  }

  const { answers, locale = "ar" } = parsed.data;

  // Fetch exactly the questions the candidate was actually shown (by id),
  // scoped to this quiz so a crafted questionId from another quiz can't be used.
  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds }, quizId: quiz.id },
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

  const attempt = await prisma.attempt.create({
    data: {
      userId: session.user.id,
      quizId: quiz.id,
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
