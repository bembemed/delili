"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

export default function Navbar() {
  const { data: session, status } = useSession();
  const t = useTranslations("nav");
  const locale = useLocale();
  const siteName = locale === "ar" ? "دليلي" : "Delili";
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/concours", label: t("concours") },
    { href: "/quiz", label: t("quiz") },
    { href: "/guide", label: t("guide") },
    { href: "/tableau-de-bord", label: t("dashboard") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
          <span
            className="text-lg font-semibold text-forest-900"
            style={locale === "ar" ? { fontFamily: "var(--font-amiri), var(--font-cairo), serif" } : undefined}
          >
            {siteName}
          </span>
        </Link>

        <button
          className="rounded p-2 text-forest-800 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={t("menu")}
        >
          ☰
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {status === "authenticated" ? (
            <>
              <span className="text-sm text-ink-soft">{session.user?.name}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary !px-3.5 !py-1.5">
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/connexion" className="nav-link">
                {t("login")}
              </Link>
              <Link href="/inscription" className="btn-primary !px-4 !py-1.5">
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </nav>

      {open && (
        <div className="animate-fade-in-up flex flex-col gap-3 border-t border-line px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink-soft"
            >
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher className="w-fit" />
          {status === "authenticated" ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-start text-sm font-medium text-forest-800">
              {t("logout")}
            </button>
          ) : (
            <>
              <Link href="/connexion" onClick={() => setOpen(false)} className="text-sm font-medium text-ink-soft">
                {t("login")}
              </Link>
              <Link href="/inscription" onClick={() => setOpen(false)} className="text-sm font-medium text-forest-800">
                {t("register")}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
