# Google Search Console & Bing Webmaster Tools — short checklist

Use this after deploying the site (including `/llms.txt`, `/ai-facts`, IndexNow key file, and sitemap).

## Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console) → **Add property**.
2. Prefer a **Domain** property for `techvergesolution.com` (covers www + apex), or a **URL-prefix** property for `https://www.techvergesolution.com/`.
3. **Verify ownership**
   - Domain: add the DNS TXT record Google shows, wait for DNS, then Verify.
   - URL-prefix alternatives: HTML file upload to `public/` (then redeploy), HTML meta tag, or Google Analytics (if the same GA4 property is already on the site with consent).
4. Confirm the **canonical host** is `https://www.techvergesolution.com` (apex should 301 to www — already configured).
5. **Sitemaps** → submit `https://www.techvergesolution.com/sitemap.xml`.
6. After it processes: check **Pages** / Coverage for indexed vs excluded; fix any Soft 404 / redirect issues.
7. Spot-check **URL Inspection** on `/`, a service URL, and a new `/blog/<slug>` after publish + deploy.
8. Optional: set up **email** notifications for critical issues.

## Bing Webmaster Tools (+ IndexNow)

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters) → **Add a site** → `https://www.techvergesolution.com`.
2. **Verify** via DNS TXT, XML file, or **Import from Google Search Console** (fastest if GSC is already verified).
3. Submit the sitemap: `https://www.techvergesolution.com/sitemap.xml`.
4. Confirm the IndexNow key file is live:
   - `https://www.techvergesolution.com/d52e645fe0119e9f67683e0c748a48c2.txt`
   - Body must be exactly the key string.
5. In Bing → **IndexNow** (or URL submission): ensure the key is recognized (Bing auto-discovers many IndexNow pings).
6. Publish a test blog post in Sanity → confirm Vercel rebuild runs → after deploy, either:
   - rely on `/api/sanity-rebuild` IndexNow ping, or
   - run `npm run indexnow:ping -- --slug your-test-slug`.
7. Use **URL Inspection** / crawl data for the new post within a day or two.

## GA4 events smoke test (after consent Accept)

In GA4 → **Admin** → **DebugView** (or Realtime), with cookie consent accepted:

| Action | Event name |
| --- | --- |
| Submit contact form | `contact_form_submit` |
| Click phone / email / WhatsApp | `phone_click` / `email_click` / `whatsapp_click` |
| Primary / secondary CTAs | `cta_click` (+ `booking_cta_click` / `audit_cta_click` / hero variants) |
| Scroll a blog post past 25/50/75/100% | `scroll_depth` (`percent_scrolled`) |

Open a campaign URL once (`?utm_source=test&utm_medium=checklist`) and confirm events still carry those params while SPA navigations use a clean `page_path`.

## Done when

- [ ] GSC property verified  
- [ ] Bing property verified  
- [ ] Sitemap submitted in both  
- [ ] IndexNow key URL returns 200 with the key  
- [ ] New post appears in sitemap after deploy and is submitted/pinged  
- [ ] GA4 Realtime shows the events above  
