import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  const siteName = locale === "ar" ? "دليلي" : "Delili";
  return {
    title: `${siteName} — ${t("title")}`,
    description: t("subtitle"),
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");

  const steps = [1, 2, 3, 4, 5, 6].map((n) => ({
    title: t(`step${n}Title`),
    desc: t(`step${n}Desc`),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="font-display animate-fade-in-up mb-3 text-center text-3xl font-semibold text-forest-950 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="animate-fade-in-up stagger-1 mb-12 text-center text-ink-soft">{t("subtitle")}</p>

      <ol className="space-y-5">
        {steps.map((step, i) => (
          <li
            key={i}
            className={`card card-hover animate-fade-in-up stagger-${i + 1} flex gap-4 border-s-4 border-s-gold-500 p-5`}
          >
            <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-900 text-lg font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display mb-1 text-lg font-semibold text-forest-950">{step.title}</h2>
              <p className="text-sm text-ink-soft">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="animate-fade-in-up stagger-6 mt-12 text-center">
        <Link href="/inscription" className="btn-primary">
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
