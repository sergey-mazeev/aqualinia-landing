"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { contactSchema, type ErrorCode } from "@/lib/leads/schema";
import type { QuizAnswers } from "@/lib/leads/quiz";
import type { LeadSource } from "@/lib/leads/sources";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/button";
import { markSubmitted, readAttribution, uuid } from "./client-utils";

type FormValues = {
  name: string;
  phone: string;
  contactMethod: (typeof site.contactMethods)[number];
  comment: string;
  consent: boolean;
};

const FIELDS = ["name", "phone", "contactMethod", "comment", "consent"] as const;

export function LeadForm({
  source,
  productSku,
  quizAnswers,
  showQuantity = false,
  showComment = false,
  tone = "light",
  onClose,
  autoFocus = false,
}: {
  source: LeadSource;
  productSku?: string;
  quizAnswers?: QuizAnswers;
  showQuantity?: boolean;
  showComment?: boolean;
  tone?: "light" | "dark";
  onClose?: () => void;
  autoFocus?: boolean;
}) {
  const t = useTranslations("form");
  const locale = useLocale();
  const uid = useId();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const submissionId = useRef("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    submissionId.current = uuid();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<FormValues>,
    defaultValues: { name: "", phone: "", contactMethod: "call", comment: "", consent: false },
    mode: "onTouched",
  });

  useEffect(() => {
    if (autoFocus) setFocus("name");
  }, [autoFocus, setFocus]);

  const contactMethod = useWatch({ control, name: "contactMethod" });
  const dark = tone === "dark";

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          comment: values.comment.trim() || undefined,
          source,
          locale,
          productSku,
          quantity: showQuantity ? quantity : undefined,
          quizAnswers,
          attribution: readAttribution(),
          website: honeypotRef.current?.value ?? "",
          startedAt: startedAt.current,
          clientSubmissionId: submissionId.current,
        }),
      });

      if (response.ok) {
        setStatus("success");
        markSubmitted();
        return;
      }
      setStatus("idle");
      if (response.status === 429) {
        setServerError(t("errorRate"));
        return;
      }
      const data = (await response.json().catch(() => null)) as { fields?: Record<string, ErrorCode> } | null;
      const fieldErrors = Object.entries(data?.fields ?? {}).filter(([field]) =>
        (FIELDS as readonly string[]).includes(field),
      );
      if (fieldErrors.length) {
        fieldErrors.forEach(([field, code]) =>
          setError(field as (typeof FIELDS)[number], { type: "server", message: code }),
        );
      } else {
        setServerError(t("errorGeneric"));
      }
    } catch {
      setStatus("idle");
      setServerError(t("errorGeneric"));
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center" role="status">
        <span className="grid size-16 place-items-center rounded-full bg-mint text-sea">
          <Icon name="check" size={32} strokeWidth={2.4} />
        </span>
        <p className={`text-xl font-bold ${dark ? "text-white" : ""}`}>{t("successTitle")}</p>
        <p className={`max-w-sm ${dark ? "text-white/80" : "text-muted"}`}>{t("successText")}</p>
        {onClose && (
          <button type="button" className={buttonClass("primary", "md", "mt-2 min-w-40")} onClick={onClose}>
            {t("successClose")}
          </button>
        )}
      </div>
    );
  }

  const errorText = (code?: string) => (code ? t(`errors.${code as ErrorCode}`) : undefined);
  const labelClass = `mb-1.5 block text-sm font-semibold ${dark ? "text-white/90" : "text-deep"}`;
  const inputClass = (invalid: boolean) =>
    `h-12 w-full rounded-2xl border bg-white px-4 text-base text-deep outline-none transition placeholder:text-slate-400 focus:border-blue focus:ring-4 focus:ring-sky/30 ${
      invalid ? "border-sale" : "border-line"
    }`;
  const errorClass = `mt-1.5 text-sm font-medium ${dark ? "text-[#ffc9c4]" : "text-sale"}`;

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate className="flex flex-col gap-4">
      {/* Honeypot: hidden from people and assistive tech. */}
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div>
        <label htmlFor={`${uid}-name`} className={labelClass}>
          {t("name")}
        </label>
        <input
          id={`${uid}-name`}
          type="text"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${uid}-name-error` : undefined}
          className={inputClass(!!errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <p id={`${uid}-name-error`} className={errorClass}>
            {errorText(errors.name.message)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className={labelClass}>
          {t("phone")}
        </label>
        <input
          id={`${uid}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t("phonePlaceholder")}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
          className={inputClass(!!errors.phone)}
          {...register("phone")}
        />
        {errors.phone && (
          <p id={`${uid}-phone-error`} className={errorClass}>
            {errorText(errors.phone.message)}
          </p>
        )}
      </div>

      <fieldset>
        <legend className={labelClass}>{t("contactMethod")}</legend>
        <div className="grid grid-cols-3 gap-2">
          {site.contactMethods.map((method) => {
            const checked = contactMethod === method;
            return (
              <label
                key={method}
                className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition has-focus-visible:ring-4 has-focus-visible:ring-sky/40 ${
                  checked
                    ? dark
                      ? "border-white bg-white text-deep"
                      : "border-blue bg-blue text-white"
                    : dark
                      ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
                      : "border-line bg-white text-deep hover:border-sky"
                }`}
              >
                <input type="radio" value={method} className="sr-only" {...register("contactMethod")} />
                {t(`methods.${method}`)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {showQuantity && (
        <div className="flex items-center justify-between gap-4">
          <span className={labelClass + " mb-0"} id={`${uid}-qty`}>
            {t("quantity")}
          </span>
          <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1" role="group" aria-labelledby={`${uid}-qty`}>
            <button
              type="button"
              aria-label={t("decrease")}
              className="grid size-9 place-items-center rounded-full text-deep transition hover:bg-pale disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Icon name="minus" size={18} />
            </button>
            <output className="w-8 text-center font-bold" aria-live="polite">
              {quantity}
            </output>
            <button
              type="button"
              aria-label={t("increase")}
              className="grid size-9 place-items-center rounded-full text-deep transition hover:bg-pale disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              disabled={quantity >= 20}
            >
              <Icon name="plus" size={18} />
            </button>
          </div>
        </div>
      )}

      {showComment && (
        <div>
          <label htmlFor={`${uid}-comment`} className={labelClass}>
            {t("comment")}{" "}
            <span className={`font-normal ${dark ? "text-white/60" : "text-muted"}`}>({t("commentOptional")})</span>
          </label>
          <textarea
            id={`${uid}-comment`}
            rows={2}
            placeholder={t("commentPlaceholder")}
            className={`${inputClass(!!errors.comment)} h-auto resize-none py-3`}
            {...register("comment")}
          />
          {errors.comment && <p className={errorClass}>{errorText(errors.comment.message)}</p>}
        </div>
      )}

      <div>
        <label className={`flex cursor-pointer items-start gap-3 text-sm leading-snug ${dark ? "text-white/80" : "text-muted"}`}>
          <input
            type="checkbox"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${uid}-consent-error` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-blue"
            {...register("consent")}
          />
          <span>
            {t.rich("consent", {
              consent: (chunks) => (
                <Link href="/consent" target="_blank" className={`underline underline-offset-2 ${dark ? "text-white" : "text-blue"}`}>
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/privacy" target="_blank" className={`underline underline-offset-2 ${dark ? "text-white" : "text-blue"}`}>
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {errors.consent && (
          <p id={`${uid}-consent-error`} className={errorClass}>
            {errorText(errors.consent.message)}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className={`rounded-2xl px-4 py-3 text-sm font-medium ${dark ? "bg-white/10 text-white" : "bg-[#fdecea] text-sale"}`}>
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={buttonClass(dark ? "light" : "primary", "lg", "mt-1 w-full")}
      >
        {status === "sending" ? t("sending") : t("submit")}
        {status !== "sending" && <Icon name="arrow" size={20} />}
      </button>
    </form>
  );
}
