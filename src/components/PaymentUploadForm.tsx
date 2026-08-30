"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function PaymentUploadForm() {
  const router = useRouter();
  const t = useTranslations("payment");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError(t("errors.INVALID_FILE"));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(t("errors.FILE_TOO_LARGE"));
      e.target.value = "";
      return;
    }

    const dataUrl = await readAsDataUrl(file);
    setPreview(dataUrl);
  }

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
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="field-input"
        />
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="max-h-64 rounded-lg border border-line object-contain" />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting || !preview} className="btn-primary w-full">
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
