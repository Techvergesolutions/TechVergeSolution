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

Deploy hosted studio: `npm run deploy` from this folder.
