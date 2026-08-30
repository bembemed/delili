import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSubscriptionStatus } from "@/lib/subscription";
import { redirect, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function QuizVersionPickerPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quiz");

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

  const quiz = await prisma.quiz.findUnique({ where: { slug } });
  if (!quiz) notFound();

  const versions = await prisma.quizVersion.findMany({
    where: { quizId: quiz.id, archived: false },
    orderBy: { versionNumber: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-1 text-sm font-medium text-forest-700">
        {locale === "ar" ? quiz.ministereAr : quiz.ministereFr}
      </p>
      <h1 className="font-display mb-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
        {locale === "ar" ? quiz.titleAr : quiz.titleFr}
      </h1>
      <p className="mb-2 text-ink-soft">{locale === "ar" ? quiz.descriptionAr : quiz.descriptionFr}</p>

      <h2 className="font-display mt-8 mb-1 text-lg font-semibold text-forest-950">{t("chooseVersionTitle")}</h2>
      <p className="mb-6 text-sm text-ink-soft">{t("chooseVersionSubtitle")}</p>

      {versions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-ink-soft">
          {t("noVersions")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {versions.map((v) => (
            <Link
              key={v.id}
              href={`/quiz/${slug}/${v.id}`}
              className="card card-hover flex items-center justify-between p-5"
            >
              <div>
                <p className="font-display text-lg font-semibold text-forest-950">
                  {t("versionLabel", { number: v.versionNumber })}
                </p>
                <p className="text-sm text-ink-soft">{t("versionQuestionsCount", { count: v._count.questions })}</p>
              </div>
              <span className="btn-primary !px-4 !py-1.5 text-sm">{t("startVersion")}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
