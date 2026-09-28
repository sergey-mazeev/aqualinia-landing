import { products as allProducts, type Product } from "@/data/products";

export const QUIZ_OPTIONS = {
  format: ["pitcher", "flow", "unsure"],
  problem: ["hardness", "rust", "chlorine", "kids", "unsure"],
  people: ["1-2", "3-4", "5+"],
  budget: ["low", "mid", "high", "any"],
} as const;

export type QuizStep = keyof typeof QUIZ_OPTIONS;
export const QUIZ_STEPS = Object.keys(QUIZ_OPTIONS) as QuizStep[];

export type QuizAnswers = { [K in QuizStep]: (typeof QUIZ_OPTIONS)[K][number] };

const PEOPLE_NEEDED: Record<QuizAnswers["people"], number> = { "1-2": 2, "3-4": 4, "5+": 5 };
const BUDGET_RANGE: Record<QuizAnswers["budget"], [number, number]> = {
  low: [0, 2000],
  mid: [2000, 8000],
  high: [8000, Infinity],
  any: [0, Infinity],
};

export function scoreProduct(product: Product, answers: QuizAnswers): number {
  let score = 0;

  if (answers.format !== "unsure") {
    if (product.category !== answers.format) return -Infinity;
    score += 5;
  }

  switch (answers.problem) {
    case "kids":
      score += product.forKids ? 6 : -2;
      break;
    case "chlorine":
      score += product.problems.includes("chlorine") ? 3 : -3;
      break;
    case "hardness":
    case "rust":
      score += product.problems.includes(answers.problem) ? 5 : -4;
      break;
    case "unsure":
      score += product.problems.length * 0.5;
      break;
  }

  const needed = PEOPLE_NEEDED[answers.people];
  if (product.people.max >= needed) score += 2;
  else score -= 2 + (needed - product.people.max);

  const [min, max] = BUDGET_RANGE[answers.budget];
  if (product.price > max) score -= 4 + Math.min(4, (product.price - max) / 2000);
  else if (product.price >= min) score += 3;
  else score += 1;

  return score;
}

/** Returns the SKUs of the best-matching products (highest score, then rating, then lower price). */
export function recommend(
  answers: QuizAnswers,
  limit = 2,
  products: Product[] = allProducts,
): string[] {
  return products
    .map((product) => ({ product, score: scoreProduct(product, answers) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.product.rating - a.product.rating ||
        a.product.price - b.product.price,
    )
    .slice(0, limit)
    .map(({ product }) => product.sku);
}
