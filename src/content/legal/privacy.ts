// PLACEHOLDER: template text. Have a lawyer review it and replace the seller details before launch.
import { site } from "@/data/site";
import type { AppLocale } from "@/i18n/routing";
import type { LegalSection } from "./types";

export function privacyContent(locale: AppLocale): LegalSection[] {
  const company = site.legal.company[locale];
  const address = site.legal.address[locale];
  const email = site.legal.privacyEmail;

  if (locale === "en") {
    return [
      {
        heading: "1. Who processes your data",
        paragraphs: [
          `${company} (INN ${site.legal.inn}, OGRN ${site.legal.ogrn}, ${address}) is the operator of personal data collected on this website, acting under Federal Law No. 152-FZ “On Personal Data”.`,
        ],
      },
      {
        heading: "2. What data we collect",
        paragraphs: [
          "Only what you enter in a request form: your name, phone number, preferred contact method and, optionally, a comment, the selected product and your quiz answers.",
          "Together with a request we store technical data: the date and time, the page and campaign tags (UTM) you came from, your browser's user agent and a one-way hash of your IP address. We do not store the IP address itself.",
        ],
      },
      {
        heading: "3. Why we process it",
        paragraphs: [
          "To contact you about your request, advise you on filters, and place and deliver your order. We do not send advertising without separate consent.",
        ],
      },
      {
        heading: "4. Cookies and analytics",
        paragraphs: [
          "The public pages of this website do not use cookies or third-party analytics. Your browser's session storage keeps campaign tags only until you close the tab.",
        ],
      },
      {
        heading: "5. Storage and transfer",
        paragraphs: [
          "Data is stored on servers located in the Russian Federation for as long as needed to handle your request, and no longer than 3 years. We do not sell or transfer your data to third parties, except to delivery services to fulfil your order.",
        ],
      },
      {
        heading: "6. Your rights",
        paragraphs: [
          `You may request access to, correction or deletion of your data, or withdraw your consent, by writing to ${email}. We will respond within 10 working days.`,
        ],
      },
    ];
  }

  return [
    {
      heading: "1. Кто обрабатывает данные",
      paragraphs: [
        `${company} (ИНН ${site.legal.inn}, ОГРН ${site.legal.ogrn}, ${address}) — оператор персональных данных, собираемых на этом сайте, в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».`,
      ],
    },
    {
      heading: "2. Какие данные мы собираем",
      paragraphs: [
        "Только то, что вы указываете в форме заявки: имя, номер телефона, удобный способ связи и, по желанию, комментарий, выбранную модель и ответы на вопросы подбора.",
        "Вместе с заявкой сохраняются технические данные: дата и время, страница и рекламные метки (UTM), с которых вы пришли, информация о браузере и необратимый хеш IP-адреса. Сам IP-адрес не хранится.",
      ],
    },
    {
      heading: "3. Зачем мы их обрабатываем",
      paragraphs: [
        "Чтобы связаться с вами по заявке, проконсультировать по фильтрам, оформить и доставить заказ. Рекламные рассылки без отдельного согласия не отправляем.",
      ],
    },
    {
      heading: "4. Cookies и аналитика",
      paragraphs: [
        "Публичные страницы сайта не используют cookies и сторонние системы аналитики. В хранилище сессии браузера рекламные метки сохраняются только до закрытия вкладки.",
      ],
    },
    {
      heading: "5. Хранение и передача",
      paragraphs: [
        "Данные хранятся на серверах в Российской Федерации столько, сколько нужно для обработки заявки, но не дольше 3 лет. Мы не продаём и не передаём данные третьим лицам, кроме служб доставки для исполнения заказа.",
      ],
    },
    {
      heading: "6. Ваши права",
      paragraphs: [
        `Вы можете запросить сведения о своих данных, их уточнение или удаление, а также отозвать согласие, написав на ${email}. Ответим в течение 10 рабочих дней.`,
      ],
    },
  ];
}
