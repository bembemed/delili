import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-16 border-t border-line py-8 text-center text-sm text-ink-faint">
      <p>{t("tagline")}</p>
      <p className="mt-1">{t("disclaimer")}</p>
    </footer>
  );
}
