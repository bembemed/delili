"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("auth.errors");
  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}/tableau-de-bord`;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(tErrors("INVALID_CREDENTIALS"));
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Logo className="animate-seal-pop mx-auto mb-6 h-14 w-14" />
      <h1 className="font-display animate-fade-in-up stagger-1 mb-6 text-center text-2xl font-semibold text-forest-950">
        {t("title")}
      </h1>
      <form onSubmit={handleSubmit} className="card animate-fade-in-up stagger-2 space-y-4 p-6 sm:p-7">
        <div>
          <label className="field-label">{t("phoneLabel")}</label>
          <input
            type="tel"
            required
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">{t("passwordLabel")}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-soft">
        {t("noAccount")}{" "}
        <Link href="/inscription" className="font-medium text-forest-800">
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}
