import { getProduct } from "@/data/products";
import ru from "../../../../../messages/ru.json";

const dateTime = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatMoscow(date: Date): string {
  return dateTime.format(date);
}

export function productName(sku: string | null | undefined): string | null {
  return getProduct(sku)?.name.ru ?? sku ?? null;
}

type QuizQuestions = typeof ru.quiz.questions;

/** Quiz answers with Russian question and option labels. */
export function quizLabels(answers: Record<string, string> | null): { question: string; answer: string }[] {
  if (!answers) return [];
  const questions = ru.quiz.questions as QuizQuestions;
  return Object.entries(answers).map(([step, value]) => {
    const q = questions[step as keyof QuizQuestions];
    const options = (q?.options ?? {}) as Record<string, string>;
    return { question: q?.title ?? step, answer: options[value] ?? value };
  });
}
