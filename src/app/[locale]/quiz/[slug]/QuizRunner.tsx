"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

type Question = {
  id: string;
  text: string;
  choices: string[];
};

type ResultDetail = {
  questionId: string;
  text: string;
  choices: string[];
  correctIndices: number[];
  given: number[];
  correct: boolean;
  explanation: string;
};

type SubmitResponse = {
  score: number;
  total: number;
  detail: ResultDetail[];
};

export default function QuizRunner({
  slug,
  questions,
}: {
  slug: string;
  questions: Question[];
}) {
  const locale = useLocale();
  const t = useTranslations("quiz");
  const tErrors = useTranslations("quiz.errors");
  const [answers, setAnswers] = useState<number[][]>(() =>
    questions.map(() => [])
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SubmitResponse | null>(null);

  function toggleChoice(qIndex: number, choiceIndex: number) {
    setAnswers((prev) => {
      const next = prev.map((selected, i) => (i === qIndex ? [...selected] : selected));
      const selected = next[qIndex];
      const pos = selected.indexOf(choiceIndex);
      if (pos === -1) {
        selected.push(choiceIndex);
      } else {
        selected.splice(pos, 1);
      }
      return next;
    });
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    const payload = questions.map((q, i) => ({ questionId: q.id, given: answers[i] }));

    const res = await fetch(`/api/quiz/${slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload, locale }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(tErrors(data.error) || tErrors("GENERIC"));
      return;
    }

    const data: SubmitResponse = await res.json();
    setResult(data);
  }

  if (result) {
    const percent = Math.round((result.score / result.total) * 100);
    return (
      <div>
        <div className="card animate-seal-pop mb-8 border-t-2 border-t-gold-500 p-6 text-center">
          <p className="text-sm text-forest-700">{t("yourScore")}</p>
          <p className="font-display text-4xl font-semibold text-forest-900" dir="ltr">
            {result.score} / {result.total}
          </p>
          <p className="mt-1 text-sm text-forest-700">{percent}%</p>
        </div>

        <div className="space-y-4">
          {result.detail.map((d, i) => (
            <div
              key={d.questionId}
              style={{ animationDelay: `${Math.min(i, 8) * 0.06}s` }}
              className={`animate-fade-in-up rounded-xl border p-4 ${
                d.correct ? "border-forest-500/30 bg-forest-50" : "border-red-300 bg-red-50/60"
              }`}
            >
              <p className="mb-2 font-medium text-ink">
                {i + 1}. {d.text}
              </p>
              {d.correctIndices.length === 0 && (
                <p className="mb-1 text-xs italic text-ink-faint">{t("noneCorrect")}</p>
              )}
              <ul className="mb-2 space-y-1 text-sm">
                {d.choices.map((c, ci) => {
                  const isCorrect = d.correctIndices.includes(ci);
                  const wasGiven = d.given.includes(ci);
                  const wronglySelected = wasGiven && !isCorrect;
                  return (
                    <li
                      key={ci}
                      className={
                        isCorrect
                          ? "font-semibold text-forest-700"
                          : wronglySelected
                          ? "text-red-700 line-through"
                          : "text-ink-soft"
                      }
                    >
                      {isCorrect ? "✓ " : wronglySelected ? "✗ " : "• "}
                      {c}
                    </li>
                  );
                })}
              </ul>
              {d.explanation && <p className="text-xs italic text-ink-faint">{d.explanation}</p>}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/quiz" className="btn-primary">
            {t("backToQuizzes")}
          </Link>
          <Link href="/tableau-de-bord" className="btn-secondary">
            {t("viewDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="animate-fade-in-up mb-4 text-sm text-ink-faint">{t("multiSelectHint")}</p>
      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div
            key={q.id}
            style={{ animationDelay: `${(qi % 6) * 0.07}s` }}
            className="card card-hover animate-fade-in-up p-5"
          >
            <p className="mb-3 font-medium text-ink">
              {qi + 1}. {q.text}
            </p>
            <div className="space-y-2">
              {q.choices.map((choice, ci) => {
                const checked = answers[qi].includes(ci);
                return (
                  <label
                    key={ci}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all duration-150 ${
                      checked ? "border-forest-600 bg-forest-50 scale-[1.01]" : "border-line hover:bg-sand"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleChoice(qi, ci)}
                      className="accent-forest-700"
                    />
                    {choice}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary mt-8 w-full">
        {submitting ? t("submitting") : t("submit")}
      </button>
    </div>
  );
}
