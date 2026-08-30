import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CONCOURS } from "@/data/concours";
import Countdown from "@/components/Countdown";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const siteName = locale === "ar" ? "دليلي" : "Delili";
  return { title: `${t("history")} — ${siteName}` };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const tQuiz = await getTranslations("quiz");

  const session = await auth();
  const userId = session!.user.id;

  const [attempts, user] = await Promise.all([
    prisma.attempt.findMany({
      where: { userId },
      include: { quiz: true, quizVersion: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.user.findUnique({ where: { id: userId }, include: { exam: true } }),
  ]);

  if (!user) {
    // Session cookie refers to a user that no longer exists in the database
    // (e.g. the account was deleted). Send them back to log in / register.
    redirect({ href: "/connexion", locale });
    return;
  }
  if (user.subscriptionStatus !== "APPROVED") {
    redirect({ href: "/paiement", locale });
    return;
  }
  const exam = user.exam;

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          (attempts.reduce((sum, a) => sum + a.score / a.total, 0) / totalAttempts) * 100
        )
      : null;

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display animate-fade-in-up mb-1 text-2xl font-semibold text-forest-950 sm:text-3xl">
        {t("greeting", { name: session!.user.name?.split(" ")[0] ?? "" })}
      </h1>
      <p className="animate-fade-in-up stagger-1 mb-8 text-ink-soft">{t("subtitle")}</p>

      <div className="card animate-fade-in-up stagger-2 mb-8 flex flex-wrap items-center justify-between gap-4 border-s-4 border-s-gold-500 p-5">
        <div>
          <p className="badge-forest mb-2 w-fit">{locale === "ar" ? exam.ministereAr : exam.ministereFr}</p>
          <p className="font-display text-lg font-semibold text-forest-950">
            {locale === "ar" ? exam.corpsAr : exam.corpsFr}
          </p>
        </div>
        <Link href={`/quiz/${exam.slug}`} className="btn-primary">
          {t("newTest")}
        </Link>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="card card-hover animate-fade-in-up stagger-3 p-5">
          <p className="text-sm text-ink-soft">{t("testsCompleted")}</p>
          <p className="font-display text-3xl font-semibold text-ink">{totalAttempts}</p>
        </div>
        <div className="card card-hover animate-fade-in-up stagger-4 p-5">
          <p className="text-sm text-ink-soft">{t("averageScore")}</p>
          <p className="font-display text-3xl font-semibold text-ink">
            {avgScore !== null ? `${avgScore}%` : "—"}
          </p>
        </div>
      </div>
      <div className="card card-hover animate-fade-in-up stagger-5 mb-10 p-5">
        <p className="mb-2 text-sm text-ink-soft">{t("beforeExam")}</p>
        <Countdown target={CONCOURS.dateDebut} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-forest-950">{t("history")}</h2>
      </div>

      {attempts.length === 0 ? (
        <div className="animate-fade-in-up rounded-xl border border-dashed border-line p-8 text-center text-ink-soft">
          {t("noAttempts")}{" "}
          <Link href={`/quiz/${exam.slug}`} className="font-medium text-forest-800">
            {t("startNow")}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((a, ai) => {
            const percent = Math.round((a.score / a.total) * 100);
            const scoreColor =
              percent >= 70 ? "text-forest-700" : percent >= 40 ? "text-gold-700" : "text-red-600";
            return (
              <div
                key={a.id}
                style={{ animationDelay: `${(ai % 6) * 0.06}s` }}
                className="card card-hover animate-fade-in-up flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium text-ink">
                    {locale === "ar" ? a.quiz.corpsAr : a.quiz.corpsFr}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {locale === "ar" ? a.quiz.ministereAr : a.quiz.ministereFr} ·{" "}
                    {tQuiz("versionLabel", { number: a.quizVersion.versionNumber })} ·{" "}
                    {dateFormatter.format(a.createdAt)}
                  </p>
                </div>
                <div className={`text-lg font-bold ${scoreColor}`} dir="ltr">
                  {a.score}/{a.total}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
