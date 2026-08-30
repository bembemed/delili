import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PRICING } from "@/data/pricing";
import type { Locale } from "@/i18n/routing";

export default async function PricingCard({
  locale,
  showCta = false,
  className = "",
}: {
  locale: Locale;
  showCta?: boolean;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const currency = locale === "ar" ? "أوقية" : "MRU";
  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <div className={`card relative overflow-hidden border-t-2 border-t-gold-500 p-6 text-center sm:p-8 ${className}`}>
      <span className="badge-gold absolute top-4 end-4">-{PRICING.discountPercent}%</span>

      <p className="text-sm font-semibold text-forest-700">{t("eyebrow")}</p>

      <div className="mt-3 flex items-end justify-center gap-2" dir="ltr">
        <span className="mb-2 text-xl text-ink-faint line-through">{PRICING.originalPrice}</span>
        <span className="font-display text-5xl font-bold text-forest-950">{PRICING.finalPrice}</span>
        <span className="mb-1.5 text-base font-medium text-ink-soft">{currency}</span>
      </div>
      <p className="mt-1 text-xs text-ink-faint">{t("note")}</p>

      <ul className="mt-6 space-y-2.5 text-start text-sm text-ink">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 font-bold text-forest-600">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {showCta && (
        <Link href="/inscription" className="btn-gold mt-7 block w-full">
          {t("cta")}
        </Link>
      )}
    </div>
  );
}
