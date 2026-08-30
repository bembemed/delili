import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const siteName = locale === "ar" ? "دليلي" : "Delili";
  const year = new Date().getFullYear();

  const linkClass = "transition-colors duration-150 hover:text-forest-800";

  return (
    <footer className="mt-16 border-t border-line bg-sand/40">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:pb-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="mb-3 flex items-center gap-2 w-fit">
              <Logo className="h-8 w-8 shrink-0" />
              <span
                className="font-display text-lg font-semibold text-forest-900"
                style={locale === "ar" ? { fontFamily: "var(--font-amiri), var(--font-cairo), serif" } : undefined}
              >
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-ink-soft">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-forest-900">{t("quickLinksTitle")}</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className={linkClass}>
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href="/concours" className={linkClass}>
                  {tNav("concours")}
                </Link>
              </li>
              <li>
                <Link href="/quiz" className={linkClass}>
                  {tNav("quiz")}
                </Link>
              </li>
              <li>
                <Link href="/guide" className={linkClass}>
                  {tNav("guide")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-forest-900">{t("accountTitle")}</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/connexion" className={linkClass}>
                  {tNav("login")}
                </Link>
              </li>
              <li>
                <Link href="/inscription" className={linkClass}>
                  {tNav("register")}
                </Link>
              </li>
              <li>
                <Link href="/tableau-de-bord" className={linkClass}>
                  {tNav("dashboard")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-center text-xs text-ink-faint">
          <p>{t("disclaimer")}</p>
          <p className="mt-3">
            {t("copyright", { year })} · {t("poweredBy")}
          </p>
        </div>
      </div>
    </footer>
  );
}
