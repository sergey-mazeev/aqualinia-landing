/** Water problems a filter can solve. Shared by the Problems section, catalog chips and the quiz. */
export const PROBLEMS = ["chlorine", "rust", "hardness", "metals", "microplastics", "bacteria"] as const;
export type Problem = (typeof PROBLEMS)[number];

/** Catalog filter chips: problems plus a "for kids" flag. */
export const CATALOG_CHIPS = ["all", "hardness", "rust", "chlorine", "bacteria", "kids"] as const;
export type CatalogChip = (typeof CATALOG_CHIPS)[number];

export const CATEGORIES = ["pitcher", "flow"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Localized<T = string> = { ru: T; en: T };
