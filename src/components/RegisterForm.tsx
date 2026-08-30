"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

type ExamOption = {
  id: string;
  slug: string;
  ministereFr: string;
  ministereAr: string;
  corpsFr: string;
  corpsAr: string;
};

export default function RegisterForm({ exams }: { exams: ExamOption[] }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth.register");
  const tErrors = useTranslations("auth.errors");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [examId, setExamId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const grouped = exams.reduce<Record<string, ExamOption[]>>((acc, exam) => {
    const key = locale === "ar" ? exam.ministereAr : exam.ministereFr;
    acc[key] = acc[key] ? [...acc[key], exam] : [exam];
    return acc;
  }, {});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!examId) {
      setError(tErrors("INVALID_EXAM"));
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password, examId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(tErrors(data.error) || tErrors("GENERIC"));
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      router.push(`/${locale}/connexion`);
      return;
    }

    router.push(`/${locale}/tableau-de-bord`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="field-label">{t("nameLabel")}</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label">{t("phoneLabel")}</label>
        <p className="mb-2 text-xs text-ink-faint">{t("phoneHint")}</p>
        <input
          type="tel"
          required
          dir="ltr"
          placeholder={t("phonePlaceholder")}
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label">{t("examLabel")}</label>
        <p className="mb-2 text-xs text-ink-faint">{t("examHint")}</p>
        <select required value={examId} onChange={(e) => setExamId(e.target.value)} className="field-input">
          <option value="" disabled>
            {t("examPlaceholder")}
          </option>
          {Object.entries(grouped).map(([ministere, ministereExams]) => (
            <optgroup key={ministere} label={ministere}>
              {ministereExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {locale === "ar" ? exam.corpsAr : exam.corpsFr}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? t("submitting") : t("submit")}
      </button>

      <p className="text-center text-sm text-ink-soft">
        {t("haveAccount")}{" "}
        <Link href="/connexion" className="font-medium text-forest-800">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
