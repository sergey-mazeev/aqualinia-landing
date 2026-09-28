# АкваЛиния — лендинг фильтров для воды

Двуязычный (RU/EN) лендинг для продажи кувшинов и проточных фильтров частным покупателям, с приёмом заявок и простой админкой.

- `/` — русская версия, `/en` — английская (для иностранцев в России; цены в ₽).
- Формы заявок: звонок из шапки, квиз «Подбор за 1 минуту», заказ из карточки товара, блок «3 шага», финальная форма, мобильная панель, попап при уходе.
- Заявки сохраняются в SQLite и доступны только в админке `/admin`.

## Стек

Next.js 16 (App Router), next-intl 4, Tailwind CSS 4, react-hook-form + zod, Drizzle ORM + libSQL (локально — файл SQLite, на Vercel — Turso), jose, Vitest. Node 24, pnpm 12.

## Быстрый старт

```bash
pnpm install
cp .env.example .env.local   # заполните ADMIN_PASSWORD, SESSION_SECRET, IP_HASH_SALT; COOKIE_SECURE=false для http://localhost
pnpm dev                     # http://localhost:3000, админка: /admin
```

База `./data/leads.db` создаётся и мигрируется автоматически при первом обращении.

## Команды

| Команда | Что делает |
|---|---|
| `pnpm dev` | Dev-сервер |
| `pnpm build` / `pnpm start` | Продакшен-сборка и запуск |
| `pnpm test` | Юнит- и интеграционные тесты (Vitest) |
| `pnpm typecheck` | Проверка типов |
| `pnpm lint` | ESLint |
| `pnpm smoke` | Смоук-тест API заявок против запущенного сервера (`BASE_URL=…`) |
| `pnpm db:generate` | Новая миграция после изменения `src/lib/db/schema.ts` |
| `pnpm db:migrate` | Применить миграции вручную |
| `node scripts/backup.cjs` | Резервная копия локальной базы (безопасно при WAL) |

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `SITE_URL` | Публичный адрес сайта. Нужен **при сборке** (canonical, hreflang, sitemap) |
| `ADMIN_PASSWORD` | Пароль админки, в продакшене не короче 12 символов |
| `SESSION_SECRET` | Секрет подписи сессий, не короче 32 символов (`openssl rand -hex 32`) |
| `IP_HASH_SALT` | Соль для хеширования IP (сами IP не хранятся) |
| `COOKIE_SECURE` | `true` за HTTPS; `false` только для локального http |
| `DATABASE_PATH` | Путь к файлу SQLite (локально и в Docker), по умолчанию `./data/leads.db` |
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Облачная база Turso (Vercel). Если заданы — используются вместо файла |
| `LEAD_RATE_LIMIT` | Заявок с одного IP за 10 минут, по умолчанию 5 |

## Где что лежит

- `src/data/site.ts` — бренд, телефон, мессенджеры, акция, реквизиты, цифры доверия.
- `src/data/products.ts` — 11 товаров (названия RU/EN, цены, ступени, ресурс).
- `messages/ru.json`, `messages/en.json` — все тексты лендинга.
- `src/content/legal/*` — тексты политики и согласия на обработку ПДн.
- `src/components/sections/*` — секции лендинга; `src/components/lead/*` — модалка, формы, квиз.
- `src/app/api/leads/route.ts` → `src/lib/leads/create-lead.ts` — приём заявок (honeypot, проверка времени заполнения, rate-limit, валидация, нормализация телефона).
- `src/app/(admin)/admin/*` — админка; `src/proxy.ts` — локализация и защита `/admin`.

## Деплой на Vercel

Проект `aqualinia-landing` (регион функций `fra1`). База — Turso из маркетплейса Vercel: интеграция сама задаёт `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN`, миграции применяются при сборке (`vercel.json` → `pnpm db:migrate && pnpm build`).

```bash
vercel link                        # привязать папку к проекту
vercel env ls                      # переменные: ADMIN_PASSWORD, SESSION_SECRET, IP_HASH_SALT, COOKIE_SECURE=true, SITE_URL
vercel deploy --prod               # выложить
```

Сервера Vercel и Turso находятся вне РФ — для реальных персональных данных российских покупателей (152-ФЗ) используйте деплой на VPS в России (ниже).

## Деплой (Docker, VPS в РФ)

```bash
cp .env.example .env         # заполните значения, COOKIE_SECURE=true
SITE_URL=https://example.ru docker compose up -d --build
```

Контейнер слушает `127.0.0.1:3000`, база лежит в томе `leads-data`. Перед ним нужен nginx с TLS:

```nginx
server {
    listen 443 ssl http2;
    server_name example.ru;
    # ssl_certificate …; ssl_certificate_key …;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        # Перезаписываем, а не дописываем — иначе клиент подделает IP и обойдёт rate-limit.
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ограничения: rate-limit хранится в памяти процесса — рассчитан на один контейнер.

### Резервная копия базы

Локальная база работает в режиме WAL, поэтому копируйте её скриптом (`VACUUM INTO`), а не простым `cp`. У Turso есть встроенное восстановление на момент времени.

```bash
docker compose exec web node scripts/backup.cjs /app/data/backup.db
docker compose cp web:/app/data/backup.db ./leads-backup-$(date +%F).db
```

## Перед запуском — заменить заглушки

- [ ] Бренд, логотип, телефон, e-mail, мессенджеры, часы работы — `src/data/site.ts`.
- [ ] Реквизиты продавца (ООО, ИНН, ОГРН, адрес) — `src/data/site.ts`.
- [ ] Товары, цены, старые цены, рейтинги и отзывы — `src/data/products.ts`, `messages/*.json` (`reviews`). Выдуманные цифры и «старые» цены — юридический риск.
- [ ] Статистика в hero и отзывах (`site.stats`), бейджи «−99%», «до 50 000 ₽».
- [ ] Условия акции и дата в `site.promo`; гарантии и сроки доставки в `messages/*.json`.
- [ ] Сертификаты/декларации ЕАЭС, свидетельства госрегистрации — реальные документы.
- [ ] Тексты политики и согласия (`src/content/legal`) — проверить юристом, обновить `site.consentVersion`.
- [ ] 152-ФЗ: уведомление Роскомнадзора об обработке ПДн, хостинг в РФ.
- [ ] Рассрочка (`site.showInstallments`) — включать только с реальными условиями партнёра (38-ФЗ).
- [ ] Если подключите Яндекс Метрику или другую аналитику — нужен cookie-баннер и правка политики.
