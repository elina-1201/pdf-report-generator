# PDF Report Generator

A NestJS service that generates a PDF report from a scraped dataset, stores reports in SQLite, and serves them over an HTTP API.

## What this is

- **NestJS + TypeORM (better-sqlite3)** backend with a `book` table and a `report` table in a local SQLite file (`report.db`).
- **Aggregation in the database**: the report is computed with SQL (top-5 most expensive books, average price, number of books per rating) — the service layer never computes aggregates in JS.
- **PDF rendering** via Handlebars HTML template + Playwright, written to disk by `ReportStorageService` and streamed back through the API.

## Dataset

`src/database/seeding/books.json` — books scraped from [https://books.toscrape.com/](https://books.toscrape.com/). Each row has a title, price, rating (1–5), and url. The seed script clears the `book` table and inserts this data.

## How to run it

```bash
pnpm install
pnpm seed       # clears the book table and inserts books.json
pnpm start:dev  # starts the API (default port 3000)
```

| Endpoint | Description |
| --- | --- |
| `POST /reports` | Generates today's report; returns `201` with the report id (or `200` if today's report already exists). Pass `{ "force": true }` to regenerate anyway. |
| `GET /reports/:id` | Report metadata. |
| `GET /reports/:id/file` | The rendered PDF. |

## Aggregation SQL

Equivalent SQL behind the read model in `src/reports/report-data.service.ts`:

```sql
-- Top 5 most expensive books
SELECT title, price, rating, url
FROM book
ORDER BY price DESC
LIMIT 5;

-- Average price of all books
SELECT AVG(price) FROM book;

-- Number of books per rating
SELECT rating, COUNT(*) AS count
FROM book
GROUP BY rating
ORDER BY rating DESC;
```

# Additional notes
## When the request becomes backgroun job
I would move PDF generation out of the request once rendering takes long enough (several seconds) or happens often enough, foe example, big reports or many concurrent users:  that holding the HTTP connection open makes requests fragile, times out, and blocks users, at which point the POST should enqueue a background job and return immediately with a status the client can poll.

## Idempotency
The project is designed so that a new report is generated only if there is no report for today yet, or if the request explicitly says to generate one anyway (even if today's report already exists). This protection saves resources by preventing unnecessary or accidental report generation, and it can be useful when sending emails, so they are not sent multiple times.