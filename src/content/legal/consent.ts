// PLACEHOLDER: template text. Have a lawyer review it and replace the seller details before launch.
import { site } from "@/data/site";
import type { AppLocale } from "@/i18n/routing";
import type { LegalSection } from "./types";

export function consentContent(locale: AppLocale): LegalSection[] {
  const company = site.legal.company[locale];
  const address = site.legal.address[locale];
  const email = site.legal.privacyEmail;

  if (locale === "en") {
    return [
      {
        heading: "Consent",
        paragraphs: [
          `By ticking the box in a request form, I freely, specifically, knowingly and unambiguously consent to ${company} (INN ${site.legal.inn}, ${address}) processing my personal data under Federal Law No. 152-FZ “On Personal Data”.`,
        ],
      },
      {
        heading: "Data",
        paragraphs: ["Name, phone number, preferred contact method, comment, selected product and quiz answers."],
      },
      {
        heading: "Purpose",
        paragraphs: ["Contacting me about my request, giving advice, and placing and delivering an order."],
      },
      {
        heading: "Actions",
        paragraphs: [
          "Collection, recording, organisation, storage, clarification, use, transfer to delivery services to fulfil an order, blocking, deletion and destruction, with or without automation.",
        ],
      },
      {
        heading: "Term and withdrawal",
        paragraphs: [
          `This consent is valid for 3 years or until I withdraw it. I can withdraw it at any time by writing to ${email}.`,
        ],
      },
    ];
  }

  return [
    {
      heading: "Согласие",
      paragraphs: [
        `Отмечая флажок в форме заявки, я свободно, своей волей и в своём интересе даю конкретное, информированное и сознательное согласие ${company} (ИНН ${site.legal.inn}, ${address}) на обработку моих персональных данных в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».`,
      ],
    },
    {
      heading: "Перечень данных",
      paragraphs: ["Имя, номер телефона, способ связи, комментарий, выбранная модель и ответы на вопросы подбора."],
    },
    {
      heading: "Цель обработки",
      paragraphs: ["Связь со мной по заявке, консультация, оформление и доставка заказа."],
    },
    {
      heading: "Действия с данными",
      paragraphs: [
        "Сбор, запись, систематизация, хранение, уточнение, использование, передача службам доставки для исполнения заказа, блокирование, удаление и уничтожение — с использованием средств автоматизации и без них.",
      ],
    },
    {
      heading: "Срок и отзыв",
      paragraphs: [
        `Согласие действует 3 года или до его отзыва. Отозвать согласие можно в любой момент, написав на ${email}.`,
      ],
    },
  ];
}
