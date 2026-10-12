# TechVerge Sanity Studio

Minimal Sanity Studio for blog posts (`post` documents). Not part of the Vite build.

## Setup

```bash
cd sanity
npm install
npm run dev
```

Studio runs separately (default port 3333). Sign in with a Sanity account that has access to project `xo7s2xmj`.

## Document type: `post`

| Field | Type | Required |
| --- | --- | --- |
| `title` | string | yes |
| `slug` | slug | yes |
| `excerpt` | text | yes |
| `description` | text | SEO meta |
| `publishedAt` | datetime | yes |
| `mainImage` | image + `alt` | recommended |
| `readingTimeMinutes` | number | optional |
| `tags` | string[] | optional |
| `body` | block content + inline images | yes for CMS articles |
| `faqs` | `{ question, answer }[]` | optional |

## Hosted Studio (write posts from phone / any device)

After a **one-time** CLI login and deploy, you use the Studio in the browser — no laptop or `npm run dev` needed for day-to-day editing.

**Expected URL (after deploy):** [https://techverge-blog.sanity.studio](https://techverge-blog.sanity.studio)

### One-time setup (on your computer)

```bash
cd sanity
npm install
npx sanity login
npm run deploy
```

1. **`sanity login`** — browser opens; sign in with the same Sanity account that can access project `xo7s2xmj`. This stores credentials on your machine for **deploy only**. You do not run this every time you write a post.
2. **`npm run deploy`** — builds and uploads Studio to Sanity hosting. The CLI prints the final URL (should match `techverge-blog.sanity.studio`).

### Writing posts after deploy

1. Open **https://techverge-blog.sanity.studio** on phone or desktop.
2. Sign in with your **Sanity account** in the browser (normal website login).
3. Create/edit **Post** documents and **Publish**.
4. The live site (Vercel) reads the same `production` dataset — new posts appear after publish (may take a short moment).

Local dev Studio (`npm run dev`, port 3333) is optional and only for testing schema/UI changes.
