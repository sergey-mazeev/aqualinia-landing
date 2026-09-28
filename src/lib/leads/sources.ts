export const LEAD_SOURCES = [
  "header_callback",
  "hero_quiz",
  "quiz",
  "product",
  "steps_cta",
  "final",
  "exit_popup",
  "sticky_bar",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const CONTACT_METHODS = ["call", "telegram", "whatsapp"] as const;

export const LEAD_STATUSES = ["new", "in_progress", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Russian labels for the admin UI. */
export const SOURCE_LABELS: Record<LeadSource, string> = {
  header_callback: "Звонок (шапка)",
  hero_quiz: "Квиз (первый экран)",
  quiz: "Квиз (блок)",
  product: "Заказ товара",
  steps_cta: "Блок «3 шага»",
  final: "Финальная форма",
  exit_popup: "Попап при уходе",
  sticky_bar: "Мобильная панель",
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  won: "Продажа",
  lost: "Отказ",
  spam: "Спам",
};

export const CONTACT_LABELS: Record<(typeof CONTACT_METHODS)[number], string> = {
  call: "Звонок",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
};
