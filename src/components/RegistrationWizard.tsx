"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import PaymentChannelsList, { type PaymentChannelDisplay } from "./PaymentChannelsList";
import ScreenshotDropzone from "./ScreenshotDropzone";
import PricingCard from "./PricingCard";

type ExamOption = {
  id: string;
  slug: string;
  ministereFr: string;
  ministereAr: string;
  corpsFr: string;
  corpsAr: string;
};

const STEPS = [1, 2, 3] as const;

export default function RegistrationWizard({
  exams,
  channels,
}: {
  exams: ExamOption[];
  channels: PaymentChannelDisplay[];
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth.register");
  const tPayment = useTranslations("payment");
  const tErrors = useTranslations("auth.errors");

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [examId, setExamId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const grouped = exams.reduce<Record<string, ExamOption[]>>((acc, exam) => {
    const key = locale === "ar" ? exam.ministereAr : exam.ministereFr;
    acc[key] = acc[key] ? [...acc[key], exam] : [exam];
    return acc;
  }, {});

  const stepLabels = [t("stepInfo"), t("stepExam"), t("stepPayment")];

  function handleStep1Next(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    setStep(2);
  }

  function handleStep2Next(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!examId) {
      setError(tErrors("INVALID_EXAM"));
      return;
    }

    setStep(3);
  }

  async function handleStep3Submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!screenshot) {
      setError(tPayment("errors.INVALID_FILE"));
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password, examId, screenshot }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error === "INVALID_FILE" ? tPayment("errors.INVALID_FILE") : tErrors(data.error) || tErrors("GENERIC"));
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

    router.push(`/${locale}/paiement`);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  step >= s ? "bg-forest-800 text-white" : "bg-sand text-ink-faint"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              <span className={`mt-1.5 text-xs ${step >= s ? "text-forest-800" : "text-ink-faint"}`}>
                {stepLabels[i]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 mb-5 h-0.5 w-8 sm:w-14 ${step > s ? "bg-forest-800" : "bg-line"}`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1Next} className="space-y-5">
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
            <label className="field-label">{t("confirmPasswordLabel")}</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="field-input"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full">
            {t("next")}
          </button>

          <p className="text-center text-sm text-ink-soft">
            {t("haveAccount")}{" "}
            <Link href="/connexion" className="font-medium text-forest-800">
              {t("login")}
            </Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-5">
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

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
              {t("back")}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {t("next")}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-6">
          <div className="text-center">
            <h2 className="font-display mb-1 text-lg font-semibold text-forest-950">{t("step3Title")}</h2>
            <p className="text-sm text-ink-soft">{t("step3Intro")}</p>
          </div>

          <PricingCard />

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">{tPayment("channelsTitle")}</h3>
            <PaymentChannelsList channels={channels} noChannelsLabel={tPayment("noChannels")} />
          </div>

          <div>
            <label className="field-label">{tPayment("screenshotLabel")}</label>
            <p className="mb-2 text-xs text-ink-faint">{tPayment("screenshotHint")}</p>
            <ScreenshotDropzone
              value={screenshot}
              fileName={screenshotName}
              onSelect={(dataUrl, name) => {
                setError("");
                setScreenshot(dataUrl);
                setScreenshotName(name);
              }}
              onError={(code) => setError(tPayment(`errors.${code}`))}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">
              {t("back")}
            </button>
            <button type="submit" disabled={loading || !screenshot} className="btn-primary flex-1">
              {loading ? t("submitting") : t("submit")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
