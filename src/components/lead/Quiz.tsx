"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getProduct } from "@/data/products";
import { formatRub } from "@/lib/format";
import { QUIZ_OPTIONS, QUIZ_STEPS, recommend, type QuizAnswers, type QuizStep } from "@/lib/leads/quiz";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { LeadForm } from "./LeadForm";

export function Quiz({
  source,
  onClose,
  tone = "light",
}: {
  source: "quiz" | "hero_quiz";
  onClose?: () => void;
  tone?: "light" | "dark";
}) {
  const t = useTranslations("quiz");
  const locale = useLocale();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const done = stepIndex >= QUIZ_STEPS.length;
  const total = QUIZ_STEPS.length;

  function choose(step: QuizStep, value: string) {
    setAnswers((prev) => ({ ...prev, [step]: value }));
    setStepIndex((i) => i + 1);
  }

  if (done) {
    const complete = answers as QuizAnswers;
    const skus = recommend(complete);
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-lg font-bold">{t("resultTitle")}</p>
          <p className="mt-1 text-sm text-muted">{t("resultText")}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {skus.map((sku) => {
            const product = getProduct(sku)!;
            return (
              <li key={sku} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
                <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-pale">
                  <ProductArt product={product} uid={`quiz-${source}-${sku}`} className="h-14 w-auto" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-snug font-semibold">{product.name[locale]}</p>
                  <Stars rating={product.rating} size={12} className="mt-1" />
                  <p className="mt-0.5 font-bold">{formatRub(product.price, locale)}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <LeadForm source={source} quizAnswers={complete} onClose={onClose} tone={tone} />
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setStepIndex(0);
          }}
          className="mx-auto inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
        >
          <Icon name="refresh" size={16} />
          {t("restart")}
        </button>
      </div>
    );
  }

  const step = QUIZ_STEPS[stepIndex];
  const titleId = `quiz-${source}-${step}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-muted">
          <span>{t("step", { current: stepIndex + 1, total })}</span>
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i - 1)}
              className="inline-flex items-center gap-1 text-blue hover:underline"
            >
              <Icon name="arrowLeft" size={16} />
              {t("back")}
            </button>
          )}
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-pale"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={stepIndex}
          aria-label={t("step", { current: stepIndex + 1, total })}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-sky to-blue transition-[width] duration-500"
            style={{ width: `${((stepIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <p id={titleId} className="text-xl font-bold">
        {t(`questions.${step}.title`)}
      </p>
      <div role="radiogroup" aria-labelledby={titleId} className="grid gap-2.5">
        {QUIZ_OPTIONS[step].map((option) => {
          const selected = answers[step] === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(step, option)}
              className={`group flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left font-semibold transition hover:-translate-y-0.5 hover:border-blue hover:shadow-card ${
                selected ? "border-blue bg-pale" : "border-line bg-white"
              }`}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <span>{t(`questions.${step}.options.${option}` as any)}</span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-pale text-blue transition group-hover:bg-blue group-hover:text-white">
                <Icon name="arrow" size={16} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
