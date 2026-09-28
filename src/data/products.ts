// PLACEHOLDER: names, prices, ratings and specs are stand-ins for the real assortment.
import type { Category, Localized, Problem } from "./taxonomy";

export type Product = {
  sku: string;
  category: Category;
  name: Localized;
  tagline: Localized;
  bullets: Localized<string[]>;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  problems: Problem[];
  forKids: boolean;
  /** Household size the product is sized for. */
  people: { min: number; max: number };
  stages: number;
  /** Pitcher jug volume, litres. */
  volumeL?: number;
  /** Cartridge (or cartridge set) resource, litres. */
  resourceL: number;
  /** Price of one replacement cartridge (or full set), ₽. */
  cartridgePrice: number;
  /** Self-installation time; null for pitchers. */
  installMinutes: number | null;
  badge?: "hit" | "new" | "best";
  /** Accent colour of the product illustration. */
  accent: "blue" | "sea" | "sky" | "deep";
};

export const products: Product[] = [
  {
    sku: "P-KAPLYA",
    category: "pitcher",
    name: { ru: "Кувшин «Капля»", en: "Kaplya pitcher" },
    tagline: {
      ru: "Компактный кувшин на каждый день",
      en: "A compact everyday pitcher",
    },
    bullets: {
      ru: ["Объём 2,5 л — помещается на дверцу холодильника", "Убирает хлор и привкус", "Картридж на 200 л"],
      en: ["2.5 L — fits a fridge door", "Removes chlorine and off-taste", "Cartridge lasts 200 L"],
    },
    price: 690,
    oldPrice: 890,
    rating: 4.7,
    reviews: 412,
    problems: ["chlorine", "metals"],
    forKids: false,
    people: { min: 1, max: 2 },
    stages: 3,
    volumeL: 2.5,
    resourceL: 200,
    cartridgePrice: 290,
    installMinutes: null,
    accent: "sky",
  },
  {
    sku: "P-RODNIK",
    category: "pitcher",
    name: { ru: "Кувшин «Родник»", en: "Rodnik pitcher" },
    tagline: {
      ru: "Смягчает жёсткую воду — меньше накипи в чайнике",
      en: "Softens hard water — less scale in your kettle",
    },
    bullets: {
      ru: ["Объём 3,2 л", "Картридж со смягчающей смолой", "Убирает хлор и тяжёлые металлы"],
      en: ["3.2 L capacity", "Softening resin cartridge", "Removes chlorine and heavy metals"],
    },
    price: 990,
    oldPrice: 1290,
    rating: 4.8,
    reviews: 538,
    problems: ["chlorine", "hardness", "metals"],
    forKids: false,
    people: { min: 1, max: 3 },
    stages: 4,
    volumeL: 3.2,
    resourceL: 250,
    cartridgePrice: 390,
    installMinutes: null,
    badge: "hit",
    accent: "blue",
  },
  {
    sku: "P-LAGUNA",
    category: "pitcher",
    name: { ru: "Кувшин «Лагуна»", en: "Laguna pitcher" },
    tagline: {
      ru: "Большой кувшин с индикатором замены картриджа",
      en: "A large pitcher with a cartridge-change indicator",
    },
    bullets: {
      ru: ["Объём 3,8 л — на всю семью", "Индикатор ресурса на крышке", "Защита от жёсткости и металлов"],
      en: ["3.8 L — enough for a family", "Resource indicator on the lid", "Tackles hardness and metals"],
    },
    price: 1490,
    oldPrice: 1790,
    rating: 4.9,
    reviews: 689,
    problems: ["chlorine", "hardness", "metals"],
    forKids: false,
    people: { min: 2, max: 4 },
    stages: 4,
    volumeL: 3.8,
    resourceL: 350,
    cartridgePrice: 450,
    installMinutes: null,
    accent: "sea",
  },
  {
    sku: "P-SMART",
    category: "pitcher",
    name: { ru: "Кувшин «Аква Смарт»", en: "Aqua Smart pitcher" },
    tagline: {
      ru: "Электронный таймер и обогащение магнием",
      en: "Electronic timer and magnesium enrichment",
    },
    bullets: {
      ru: ["Объём 4 л", "Электронный таймер замены", "Задерживает микропластик, добавляет магний"],
      en: ["4 L capacity", "Electronic replacement timer", "Traps microplastics, adds magnesium"],
    },
    price: 2290,
    rating: 4.8,
    reviews: 205,
    problems: ["chlorine", "hardness", "metals", "microplastics"],
    forKids: false,
    people: { min: 2, max: 4 },
    stages: 5,
    volumeL: 4,
    resourceL: 400,
    cartridgePrice: 590,
    installMinutes: null,
    badge: "new",
    accent: "deep",
  },
  {
    sku: "F-TRIO-STD",
    category: "flow",
    name: { ru: "Проточный фильтр «Трио Стандарт»", en: "Trio Standard under-sink filter" },
    tagline: {
      ru: "Базовая трёхступенчатая очистка под мойку",
      en: "Essential three-stage under-sink filtration",
    },
    bullets: {
      ru: ["3 ступени очистки", "Отдельный кран в комплекте", "Ресурс 7 000 л"],
      en: ["3 filtration stages", "Separate faucet included", "7,000 L resource"],
    },
    price: 4990,
    oldPrice: 5990,
    rating: 4.8,
    reviews: 874,
    problems: ["chlorine", "rust", "metals"],
    forKids: false,
    people: { min: 1, max: 4 },
    stages: 3,
    resourceL: 7000,
    cartridgePrice: 1690,
    installMinutes: 20,
    accent: "sky",
  },
  {
    sku: "F-TRIO-SOFT",
    category: "flow",
    name: { ru: "Проточный фильтр «Трио Жёсткость»", en: "Trio Soft under-sink filter" },
    tagline: {
      ru: "Для жёсткой воды — защищает чайник и кофемашину",
      en: "For hard water — protects your kettle and coffee machine",
    },
    bullets: {
      ru: ["Умягчающая ступень", "Убирает хлор и металлы", "Ресурс 6 000 л"],
      en: ["Softening stage", "Removes chlorine and metals", "6,000 L resource"],
    },
    price: 5990,
    rating: 4.8,
    reviews: 631,
    problems: ["chlorine", "hardness", "metals"],
    forKids: false,
    people: { min: 1, max: 4 },
    stages: 3,
    resourceL: 6000,
    cartridgePrice: 1990,
    installMinutes: 20,
    badge: "hit",
    accent: "blue",
  },
  {
    sku: "F-TRIO-FE",
    category: "flow",
    name: { ru: "Проточный фильтр «Трио Железо»", en: "Trio Iron under-sink filter" },
    tagline: {
      ru: "Против ржавчины и рыжего налёта",
      en: "Against rust and orange stains",
    },
    bullets: {
      ru: ["Ступень обезжелезивания", "Убирает мутность и запах", "Ресурс 6 000 л"],
      en: ["Iron-removal stage", "Clears turbidity and odour", "6,000 L resource"],
    },
    price: 6490,
    oldPrice: 7290,
    rating: 4.7,
    reviews: 358,
    problems: ["chlorine", "rust", "metals"],
    forKids: false,
    people: { min: 1, max: 4 },
    stages: 3,
    resourceL: 6000,
    cartridgePrice: 2190,
    installMinutes: 20,
    accent: "sea",
  },
  {
    sku: "F-TRIO-BABY",
    category: "flow",
    name: { ru: "Проточный фильтр «Трио Бэби»", en: "Trio Baby under-sink filter" },
    tagline: {
      ru: "Вода для детской смеси прямо из крана",
      en: "Water for baby formula straight from the tap",
    },
    bullets: {
      ru: ["Половолоконная мембрана 0,1 мкм", "Задерживает бактерии", "Сохраняет полезные минералы"],
      en: ["0.1 µm hollow-fibre membrane", "Retains bacteria", "Keeps healthy minerals"],
    },
    price: 7490,
    rating: 4.9,
    reviews: 447,
    problems: ["chlorine", "metals", "bacteria"],
    forKids: true,
    people: { min: 2, max: 5 },
    stages: 3,
    resourceL: 5000,
    cartridgePrice: 2490,
    installMinutes: 25,
    accent: "sky",
  },
  {
    sku: "F-QUARTET",
    category: "flow",
    name: { ru: "Проточный фильтр «Квартет Комфорт»", en: "Quartet Comfort under-sink filter" },
    tagline: {
      ru: "Четыре ступени и дизайнерский кран",
      en: "Four stages and a designer faucet",
    },
    bullets: {
      ru: ["4 ступени: железо, жёсткость, хлор", "Кран из нержавеющей стали", "Ресурс 8 000 л"],
      en: ["4 stages: iron, hardness, chlorine", "Stainless-steel faucet", "8,000 L resource"],
    },
    price: 8990,
    oldPrice: 10490,
    rating: 4.9,
    reviews: 512,
    problems: ["chlorine", "rust", "hardness", "metals"],
    forKids: false,
    people: { min: 2, max: 6 },
    stages: 4,
    resourceL: 8000,
    cartridgePrice: 2790,
    installMinutes: 25,
    badge: "best",
    accent: "blue",
  },
  {
    sku: "F-QUARTET-UF",
    category: "flow",
    name: { ru: "Проточный фильтр «Квартет Ультра»", en: "Quartet Ultra under-sink filter" },
    tagline: {
      ru: "Ультрафильтрация: бактерии и микропластик",
      en: "Ultrafiltration: bacteria and microplastics",
    },
    bullets: {
      ru: ["Мембрана 0,01 мкм", "Задерживает бактерии и микропластик", "Подходит для детей"],
      en: ["0.01 µm membrane", "Retains bacteria and microplastics", "Safe for kids"],
    },
    price: 11990,
    rating: 4.9,
    reviews: 296,
    problems: ["chlorine", "rust", "metals", "microplastics", "bacteria"],
    forKids: true,
    people: { min: 2, max: 6 },
    stages: 4,
    resourceL: 8000,
    cartridgePrice: 3290,
    installMinutes: 30,
    accent: "sea",
  },
  {
    sku: "F-PRO5",
    category: "flow",
    name: { ru: "Проточный комплекс «Про 5 Минерал»", en: "Pro 5 Mineral under-sink system" },
    tagline: {
      ru: "Максимальная очистка с минерализацией",
      en: "Maximum purification with remineralisation",
    },
    bullets: {
      ru: ["5 ступеней + минерализатор", "Решает все 6 проблем воды", "Ресурс 10 000 л"],
      en: ["5 stages + mineraliser", "Solves all 6 water problems", "10,000 L resource"],
    },
    price: 14990,
    oldPrice: 17490,
    rating: 5.0,
    reviews: 183,
    problems: ["chlorine", "rust", "hardness", "metals", "microplastics", "bacteria"],
    forKids: true,
    people: { min: 3, max: 8 },
    stages: 5,
    resourceL: 10000,
    cartridgePrice: 4490,
    installMinutes: 30,
    badge: "new",
    accent: "deep",
  },
];

export const productsBySku = new Map(products.map((p) => [p.sku, p]));

export function getProduct(sku: string | null | undefined): Product | undefined {
  return sku ? productsBySku.get(sku) : undefined;
}
