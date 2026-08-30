import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Countdown from "@/components/Countdown";
import Logo from "@/components/Logo";
import TypewriterText from "@/components/TypewriterText";
import { CONCOURS } from "@/data/concours";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tAbout = await getTranslations("about");

  const features = [
    { icon: "📋", title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: "📝", title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: "📈", title: t("feature3Title"), desc: t("feature3Desc") },
  ];

  return (
    <div>
      <section className="pattern-lattice relative overflow-hidden bg-forest-50 [background-size:72px_72px]">
        <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/85 to-paper" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <Logo className="animate-seal-pop mx-auto mb-6 h-20 w-20" />
          <h1 className="font-display animate-fade-in-up stagger-2 mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-forest-950 sm:text-6xl">
            {t("title")}
          </h1>
          <p className="animate-fade-in-up stagger-3 mx-auto mt-5 max-w-2xl text-ink-soft">
            {t("subtitle", { titre: CONCOURS.titre[locale] })}
          </p>

          <div className="animate-fade-in-up stagger-4 mt-9 flex justify-center">
            <Countdown target={CONCOURS.dateDebut} />
          </div>
          <p className="animate-fade-in-up stagger-4 mt-3 text-sm text-ink-faint">{t("examDates")}</p>

          <div className="animate-fade-in-up stagger-5 mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/concours" className="btn-primary">
              {t("ctaDetails")}
            </Link>
            <Link href="/quiz" className="btn-secondary">
              {t("ctaQuiz")}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-sand/60">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <TypewriterText
            text={tAbout("eyebrow")}
            className="font-display mx-auto mb-6 block max-w-3xl text-2xl font-semibold text-forest-950 sm:text-4xl"
          />
          <h2 className="font-display animate-fade-in-up stagger-1 mb-5 text-2xl font-semibold text-forest-950 sm:text-3xl">
            {tAbout("title")}
          </h2>
          <p className="font-display animate-fade-in-up stagger-3 mt-5 text-lg font-semibold text-forest-800">
            {tAbout("tagline")}
          </p>

          <p className="animate-fade-in-up stagger-4 mt-10 mb-6 font-medium text-ink">{tAbout("redefine")}</p>
          <div className="grid gap-6 text-start sm:grid-cols-2">
            <div className="card card-hover animate-fade-in-up stagger-4 border-t-2 border-t-gold-500 p-6">
              <h3 className="font-display mb-2 text-lg font-semibold text-forest-950">{tAbout("feature1Title")}</h3>
              <p className="text-sm text-ink-soft">{tAbout("feature1Desc")}</p>
            </div>
            <div className="card card-hover animate-fade-in-up stagger-5 border-t-2 border-t-gold-500 p-6">
              <h3 className="font-display mb-2 text-lg font-semibold text-forest-950">{tAbout("feature2Title")}</h3>
              <p className="text-sm text-ink-soft">{tAbout("feature2Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="font-display mb-10 text-center text-2xl font-semibold text-forest-950 sm:text-3xl">
          {t("whyTitle")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card card-hover animate-fade-in-up stagger-${i + 1} border-t-2 border-t-gold-500 p-6`}
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="font-display mb-2 text-lg font-semibold text-forest-950">{f.title}</h3>
              <p className="text-sm text-ink-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="font-display mb-3 text-2xl font-semibold sm:text-3xl">{t("ctaFinalTitle")}</h2>
          <p className="mb-7 text-forest-100">{t("ctaFinalDesc")}</p>
          <Link href="/inscription" className="btn-gold">
            {t("ctaFinalButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
