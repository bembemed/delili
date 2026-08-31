"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ScreenshotDropzone from "./ScreenshotDropzone";

export default function PaymentUploadForm() {
  const router = useRouter();
  const t = useTranslations("payment");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) {
      setError(t("errors.INVALID_FILE"));
      return;
    }
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/payment-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screenshot: preview }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(t(`errors.${data.error}`) || t("errors.GENERIC"));
      return;
    }

    router.push("/paiement");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="field-label">{t("screenshotLabel")}</label>
        <p className="mb-2 text-xs text-ink-faint">{t("screenshotHint")}</p>
        <ScreenshotDropzone
          value={preview}
          fileName={fileName}
          onSelect={(dataUrl, name) => {
            setError("");
            setPreview(dataUrl);
            setFileName(name);
          }}
          onError={(code) => setError(t(`errors.${code}`))}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting || !preview} className="btn-primary w-full">
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
