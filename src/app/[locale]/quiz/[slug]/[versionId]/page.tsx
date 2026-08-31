import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sampleRandom } from "@/lib/shuffle";
import { getSubscriptionStatus } from "@/lib/subscription";
import { TRIAL_QUESTION_COUNT } from "@/lib/trial";
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

  const session = await auth();
  const isOwnExam = session?.user?.examSlug === slug;
  const status = isOwnExam && session?.user?.id ? await getSubscriptionStatus(session.user.id) : undefined;
  const isFullAccess = status === "APPROVED";

  // Full access draws a random subset (this version's configured size) from
  // its own pool, so a growing question bank doesn't force every candidate
  // through every question — mirrors how the real exam draws from a larger
  // bank. Anyone without an approved subscription only gets a small free
  // trial sample instead, capped both here and (defensively) server-side on
  // submit.
  const sampleSize = isFullAccess ? quizVersion.questionsPerAttempt : TRIAL_QUESTION_COUNT;
  const picked = sampleRandom(quizVersion.questions, sampleSize);

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
      <p className="mb-4 text-ink-soft">{locale === "ar" ? quiz.descriptionAr : quiz.descriptionFr}</p>

      {!isFullAccess && (
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-gold-300 bg-gold-50 p-4 text-sm text-forest-900">
          {t("trialNotice", { count: questions.length, total: quizVersion.questions.length })}
        </div>
      )}

      <QuizRunner
        slug={quiz.slug}
        versionId={quizVersion.id}
        questions={questions}
        isTrial={!isFullAccess}
        totalCount={quizVersion.questions.length}
      />
    </div>
  );
}
