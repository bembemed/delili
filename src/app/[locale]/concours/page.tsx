import { getTranslations, setRequestLocale } from "next-intl/server";
import Countdown from "@/components/Countdown";
import { CONCOURS, POSTES } from "@/data/concours";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "concours" });
  const siteName = locale === "ar" ? "دليلي" : "Delili";
  return { title: `${t("postsByMinistry")} — ${siteName}` };
}

export default async function ConcoursPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("concours");

  const grouped = POSTES.reduce<Record<string, typeof POSTES>>((acc, p) => {
    const key = p.ministereFull[locale];
    acc[key] = acc[key] ? [...acc[key], p] : [p];
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="card animate-fade-in-up mb-10 border-t-2 border-t-gold-500 p-6 sm:p-8">
        <p className="badge-gold mb-3 w-fit">{t("officialNotice", { org: CONCOURS.organisateur[locale] })}</p>
        <h1 className="font-display text-2xl font-semibold text-forest-950 sm:text-3xl">
          {CONCOURS.titre[locale]}
        </h1>
        <div className="mt-6">
          <Countdown target={CONCOURS.dateDebut} />
        </div>
      </div>

      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        <div className="card card-hover animate-fade-in-up stagger-1 p-5">
          <h2 className="font-display mb-3 font-semibold text-forest-950">📅 {t("datesAndPlace")}</h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>
              <strong className="text-ink">{t("examDatesLabel")}</strong> {t("examDatesValue")}
            </li>
            <li>
              <strong className="text-ink">{t("placeLabel")}</strong> {CONCOURS.lieu[locale]}
            </li>
            <li>
              <strong className="text-ink">{t("totalPlacesLabel")}</strong> {CONCOURS.totalPlaces}
            </li>
          </ul>
        </div>
        <div className="card card-hover animate-fade-in-up stagger-2 p-5">
          <h2 className="font-display mb-3 font-semibold text-forest-950">✅ {t("eligibility")}</h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>{CONCOURS.conditionNationalite[locale]}</li>
            <li>{CONCOURS.conditionAge[locale]}</li>
            <li>{t("diplomaCondition")}</li>
          </ul>
        </div>
      </section>

      <section className="animate-fade-in-up stagger-3 mb-10 rounded-2xl border border-gold-500/40 bg-gold-50 p-5 sm:p-6">
        <h2 className="font-display mb-2 font-semibold text-forest-950">📱 {t("examFormatTitle")}</h2>
        <p className="mb-3 text-sm text-ink-soft">{t("examFormatIntro")}</p>
        <ul className="list-disc space-y-2 ps-5 text-sm text-ink-soft">
          <li>{t("examFormatTablet")}</li>
          <li>{t("examFormatAI")}</li>
          <li>{t("examFormatCorrection")}</li>
          <li>{t("examFormatApps")}</li>
          <li>{t("examFormatOral")}</li>
        </ul>
        <p className="mt-3 text-xs italic text-ink-faint">{t("examFormatSource")}</p>
      </section>

      <section className="mb-10">
        <h2 className="font-display mb-4 text-xl font-semibold text-forest-950">🏫 {t("schools")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CONCOURS.ecoles.map((e) => (
            <li
              key={e.fr}
              className="rounded-lg bg-sand px-4 py-3 text-sm text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {e[locale]}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display mb-4 text-xl font-semibold text-forest-950">👔 {t("postsByMinistry")}</h2>
        <div className="space-y-8">
          {Object.entries(grouped).map(([ministere, postes]) => (
            <div key={ministere}>
              <h3 className="mb-3 font-semibold text-forest-800">{ministere}</h3>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-sand">
                    <tr>
                      <th className="px-4 py-3 text-start font-semibold text-ink">{t("corps")}</th>
                      <th className="px-4 py-3 text-start font-semibold text-ink">{t("places")}</th>
                      <th className="px-4 py-3 text-start font-semibold text-ink">{t("diploma")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postes.map((p) => (
                      <tr key={p.corps.fr} className="border-t border-line">
                        <td className="px-4 py-3 font-medium text-ink">{p.corps[locale]}</td>
                        <td className="px-4 py-3 text-ink">{p.places}</td>
                        <td className="px-4 py-3 text-ink-soft">{p.diplome[locale]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 rounded-lg border border-gold-500/40 bg-gold-50 p-4 text-sm text-forest-950">
        ⚠️ {t("disclaimer")}
      </p>
    </div>
  );
}
