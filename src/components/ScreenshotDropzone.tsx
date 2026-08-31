"use client";

import { useRef, useState } from "react";
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

export default function ScreenshotDropzone({
  value,
  fileName,
  onSelect,
  onError,
}: {
  value: string | null;
  fileName: string;
  onSelect: (dataUrl: string, fileName: string) => void;
  onError: (code: "INVALID_FILE" | "FILE_TOO_LARGE") => void;
}) {
  const t = useTranslations("payment");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  async function acceptFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError("INVALID_FILE");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      onError("FILE_TOO_LARGE");
      return;
    }
    onSelect(await readAsDataUrl(file), file.name);
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

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-sand/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="max-h-64 w-full object-contain" />
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
          <svg className="h-8 w-8 text-forest-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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
  );
}
