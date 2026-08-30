"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(nextLocale: "ar" | "fr") {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className={`flex items-center gap-1 rounded-lg border border-line p-0.5 text-sm ${className}`}>
      <button
        onClick={() => switchTo("ar")}
        className={`rounded-md px-2 py-1 font-medium transition ${
          locale === "ar" ? "bg-forest-800 text-white" : "text-ink-soft hover:bg-forest-50"
        }`}
      >
        عربية
      </button>
      <button
        onClick={() => switchTo("fr")}
        className={`rounded-md px-2 py-1 font-medium transition ${
          locale === "fr" ? "bg-forest-800 text-white" : "text-ink-soft hover:bg-forest-50"
        }`}
      >
        FR
      </button>
    </div>
  );
}
