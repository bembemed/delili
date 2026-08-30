import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sampleRandom } from "@/lib/shuffle";
import { getSubscriptionStatus } from "@/lib/subscription";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import QuizRunner from "./QuizRunner";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (session?.user.examSlug && session.user.examSlug !== slug) {
    redirect({ href: `/quiz/${session.user.examSlug}`, locale });
  }
  if (session?.user?.id) {
    const status = await getSubscriptionStatus(session.user.id);
    if (status !== "APPROVED") {
      redirect({ href: "/paiement", locale });
    }
  }

  const quiz = await prisma.quiz.findUnique({
    where: { slug },
    include: { questions: true },
  });

  if (!quiz) notFound();

  // Draw a random subset (the quiz's configured size) from the full pool,
  // so a growing question bank doesn't force every candidate through every
  // question — mirrors how the real exam draws from a larger bank.
  const picked = sampleRandom(quiz.questions, quiz.questionsPerAttempt);

  const questions = picked.map((q) => ({
    id: q.id,
    text: locale === "ar" ? q.textAr : q.textFr,
    choices: JSON.parse(locale === "ar" ? q.choicesAr : q.choicesFr) as string[],
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-1 text-sm font-medium text-forest-700">
        {locale === "ar" ? quiz.ministereAr : quiz.ministereFr}
      </p>
      <h1 className="font-display mb-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
        {locale === "ar" ? quiz.titleAr : quiz.titleFr}
      </h1>
      <p className="mb-8 text-ink-soft">{locale === "ar" ? quiz.descriptionAr : quiz.descriptionFr}</p>

      <QuizRunner slug={quiz.slug} questions={questions} />
    </div>
  );
}
