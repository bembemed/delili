import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSubscriptionStatus } from "@/lib/subscription";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quiz" });
  const siteName = locale === "ar" ? "دليلي" : "Delili";
  return { title: `${t("listTitle")} — ${siteName}` };
}

export default async function QuizListPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quiz");

  const session = await auth();
  if (session?.user.examSlug) {
    const status = await getSubscriptionStatus(session.user.id);
    if (status !== "APPROVED") {
      redirect({ href: "/paiement", locale });
    }
    redirect({ href: `/quiz/${session.user.examSlug}`, locale });
  }

  const quizzes = await prisma.quiz.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: [{ ministere: "asc" }, { corpsFr: "asc" }],
  });

  const grouped = quizzes.reduce<Record<string, typeof quizzes>>((acc, quiz) => {
    const key = locale === "ar" ? quiz.ministereAr : quiz.ministereFr;
    acc[key] = acc[key] ? [...acc[key], quiz] : [quiz];
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display animate-fade-in-up mb-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
        {t("listTitle")}
      </h1>
      <p className="animate-fade-in-up stagger-1 mb-10 text-ink-soft">{t("listSubtitle")}</p>

      <div className="space-y-10">
        {Object.entries(grouped).map(([ministere, ministereQuizzes], gi) => (
          <div key={ministere} className={`animate-fade-in-up stagger-${Math.min(gi + 1, 6)}`}>
            <h2 className="font-display mb-4 text-lg font-semibold text-forest-800">{ministere}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ministereQuizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.slug}`}
                  className="card card-hover p-5 hover:border-gold-500"
                >
                  <h3 className="mb-1 font-semibold text-ink">
                    {locale === "ar" ? quiz.corpsAr : quiz.corpsFr}
                  </h3>
                  <p className="mb-3 text-sm text-ink-soft">
                    {locale === "ar" ? quiz.descriptionAr : quiz.descriptionFr}
                  </p>
                  <span className="text-xs text-ink-faint">
                    {t("questionsCount", { count: quiz.questionsPerAttempt })}
                    {quiz._count.questions > quiz.questionsPerAttempt && (
                      <> · {t("pooledFrom", { total: quiz._count.questions })}</>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
