# Sanity publish → Vercel rebuild

When a blog post is published, updated, or unpublished in Sanity, the static HTML, sitemap, and prerendered routes must rebuild. This project uses a **deploy hook** triggered by a **secured API route**.

This does **not** guarantee Google rankings or AI citations — it only keeps the static site in sync with published Sanity content.

## 1. Create a Vercel Deploy Hook

1. Open the project on [Vercel](https://vercel.com) → **Settings** → **Git** → **Deploy Hooks**.
2. Create a hook (e.g. name `sanity-blog-rebuild`, branch `main`).
3. Copy the hook URL (looks like `https://api.vercel.com/v1/integrations/deploy/...`).
4. Add project env var (Production + Preview if desired):
   - `VERCEL_DEPLOY_HOOK_URL` = that URL  
   **Never** prefix with `VITE_`.

## 2. Create a webhook secret

Generate a long random string (password manager or `openssl rand -hex 32`).

Add to Vercel env:

- `SANITY_WEBHOOK_SECRET` = that string  

Again: **not** `VITE_*`.

## 3. Point Sanity at the API

1. Sanity manage → project → **API** → **Webhooks** (or use [GROQ-powered webhooks](https://www.sanity.io/docs/webhooks)).
2. URL: `https://www.techvergesolution.com/api/sanity-rebuild`
3. Dataset: `production`
4. Trigger on: create / update / delete for `post` (include unpublish/delete so URLs leave the sitemap on next build).
5. Authentication / secret header: send the same secret as:
   - Header `sanity-webhook-secret: <SANITY_WEBHOOK_SECRET>`, or
   - Header `Authorization: Bearer <SANITY_WEBHOOK_SECRET>`

Optional filter (published docs only is fine; unpublish still sends update/delete):

```
_type == "post"
```

## 4. Sanity CORS (required for browser + local prerender)

In [sanity.io/manage](https://www.sanity.io/manage) → project → **API** → **CORS origins**, allow:

- `https://www.techvergesolution.com`
- `https://techvergesolution.com` (if used)
- `http://localhost:8080` (Vite dev)
- `http://127.0.0.1:8080`

Production builds prerender Sanity posts by proxying CDN requests inside Playwright (so ephemeral `127.0.0.1:<random-port>` origins do not need to be listed). Live browsers still need the production origin(s) above.

## 5. Client vs build-time Sanity access

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SANITY_PROJECT_ID` | Client + build | Public project id |
| `VITE_SANITY_DATASET` | Client + build | Usually `production` |
| `VITE_SANITY_API_VERSION` | Client + build | API version date |
| `SANITY_API_READ_TOKEN` | Build/CI only (optional) | Private dataset reads |
| `SANITY_WEBHOOK_SECRET` | Server only | Webhook auth |
| `VERCEL_DEPLOY_HOOK_URL` | Server only | Triggers rebuild |

**Do not use `VITE_SANITY_TOKEN`.** Any previously committed or shared token must be **rotated in the Sanity project** (API tokens → revoke old Viewer/Editor tokens).

Public datasets: the site reads **published** documents via the CDN with no token.

## 6. IndexNow (Bing URL notify on publish)

`/api/sanity-rebuild` also pings [IndexNow](https://www.indexnow.org/) when the webhook body includes a post `slug` (string or `{ current }`).

1. Key file (committed): `public/d52e645fe0119e9f67683e0c748a48c2.txt` → live at  
   `https://www.techvergesolution.com/d52e645fe0119e9f67683e0c748a48c2.txt`
2. Optional Vercel env: `INDEXNOW_KEY` (must match the filename / file body), `SITE_URL`, `INDEXNOW_HOST`.
3. In the Sanity webhook, include a projection that sends the slug, e.g.  
   `{ "slug": slug.current }`  
   so IndexNow receives `/blog/<slug>` immediately on publish.
4. After each **Vercel production build**, `seo-build` also pings IndexNow for all blog URLs when `VERCEL=1` (so Bing sees URLs after they are actually live).
5. Manual: `npm run indexnow:ping -- --slug your-slug` or `npm run indexnow:ping:all`.

Standalone endpoint (same secret): `POST /api/indexnow` with `{ "slug": "…" }` or `{ "urls": ["https://…"] }`.

## 7. Verify

1. Publish a test post in Studio.
2. Confirm Vercel starts a deployment within a minute.
3. After deploy: `/blog/<slug>` returns **200** with HTML body; slug appears in `/sitemap.xml`.
4. Unpublish/delete the post and wait for rebuild: URL should return **HTTP 404** (not the homepage).
5. Confirm IndexNow key URL returns 200 and Bing Webmaster shows the submission (see `docs/SEARCH-CONSOLE-BING-CHECKLIST.md`).

## 8. Local / CI notes

- Production build runs Playwright Chromium prerender and **fails** if `#root` is empty.
- After `npm run build`, run `npm run test:seo` for dist validation + local filesystem→404 routing checks.
