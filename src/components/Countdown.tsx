"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ target }: { target: string }) {
  const t = useTranslations("countdown");
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | undefined>(
    undefined
  );

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(target));
    const id = setInterval(tick, 1000);
    const initial = setTimeout(tick, 0);
    return () => {
      clearInterval(id);
      clearTimeout(initial);
    };
  }, [target]);

  if (timeLeft === undefined) {
    return <div className="h-[72px] sm:h-[84px]" aria-hidden />;
  }

  if (!timeLeft) {
    return null;
  }

  const units: [string, number][] = [
    [t("days"), timeLeft.jours],
    [t("hours"), timeLeft.heures],
    [t("minutes"), timeLeft.minutes],
    [t("seconds"), timeLeft.secondes],
  ];

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex min-w-[64px] flex-col items-center justify-center overflow-hidden rounded-xl border-t-2 border-gold-500 bg-forest-900 px-3 py-2.5 text-white shadow-lg sm:min-w-[82px] sm:px-4 sm:py-3"
        >
          <span key={value} className="animate-tick font-display text-2xl font-semibold tabular-nums sm:text-3xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-gold-100 sm:text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
