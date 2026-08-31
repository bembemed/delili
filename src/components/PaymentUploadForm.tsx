"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function acceptFile(file: File) {
    setError("");
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t("errors.INVALID_FILE"));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(t("errors.FILE_TOO_LARGE"));
      return;
    }
    setPreview(await readAsDataUrl(file));
    setFileName(file.name);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void acceptFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void acceptFile(file);
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
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-sand/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="max-h-64 w-full object-contain" />
            <div className="flex items-center justify-between gap-3 border-t border-line bg-paper-raised px-4 py-2.5">
              <span className="truncate text-xs text-ink-faint">{fileName}</span>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="shrink-0 text-sm font-medium text-forest-700 hover:underline"
              >
                {t("changeFile")}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
              dragOver ? "border-forest-600 bg-forest-50" : "border-line bg-sand/40 hover:border-forest-500 hover:bg-forest-50"
            }`}
          >
            <svg
              className="h-8 w-8 text-forest-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 8.25 12 3.75m0 0L7.5 8.25M12 3.75v13.5"
              />
            </svg>
            <span className="text-sm font-semibold text-forest-800">{t("dropzoneCta")}</span>
            <span className="text-xs text-ink-faint">{t("dropzoneHint")}</span>
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting || !preview} className="btn-primary w-full">
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
