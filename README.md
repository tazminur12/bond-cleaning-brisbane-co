# Bond Cleaning Brisbane Co. — Website

Astro static marketing site for **Bond Cleaning Brisbane Co.**: bond / end-of-lease cleaning for Brisbane’s **Northside and inner north**.

Built from the `bond-cleaning-brisbane-co-website-kit` plus the build brief. Content, SEO, forms, schema, and design tokens are wired so the owner can fill real facts in one place and go live without a redesign.

| | |
|---|---|
| **Preview (noindex)** | [bond-cleaning-brisbane-co.netlify.app](https://bond-cleaning-brisbane-co.netlify.app) |
| **Production domain** | [bondcleaningco.com](https://bondcleaningco.com) *(not live yet)* |
| **Stack** | Astro 7 · static HTML · Netlify Forms · Netlify hosting |
| **Node** | 22 |
| **Pages built** | **62** |

---

## What this site is

- Local bond cleaner for **tenants moving out** (and property managers on the Northside).
- Positioning: **fixed price**, **photo-proof**, **inspection ready**, with a free re-clean if the agent flags anything cleaned.
- SEO-led site: homepage, hubs, 22 service pages, 20 suburb pages, checklist magnet, FAQ, blog, legal, quote funnel.
- **No backend app** — Netlify Forms for quotes; analytics via GA4/GTM when IDs are set.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → dist/
npm run preview    # preview the production build
npm run audit      # self-audit vs playbook (python3 + beautifulsoup4)
```

Trailing slashes are required (`trailingSlash: 'always'`). In local dev, open URLs **with** a final `/` (e.g. `/uiuh/`) to see the custom 404; `/uiuh` without a slash shows Astro’s trailing-slash helper.

Photo crops for the before/after slider were generated with `node scripts/crop-photos.mjs`. Re-run only if source photos change.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) 7.3 (static / `output: "static"`) |
| Sitemap | `@astrojs/sitemap` |
| Images | Astro `<Image>` + Sharp |
| Hosting | Netlify (`netlify.toml`: Node 22, security headers, CSP) |
| Forms | Netlify Forms (`quote`, `partner`) → `/thank-you/` |
| Design | Custom design system in `src/styles/global.css` |
| Fonts | **Cabinet Grotesk** (display) + **General Sans** (UI/body) — self-hosted |
| Brand colour | Navy + Mint (mint used sparingly as accent) |

---

## Design system (UI)

Premium, calm, inspection-ready UI across the public site.

- **Tokens:** navy / mint / sand / ink / muted, fluid type scale, shared radius & shadows — `:root` in `global.css`
- **Patterns:** `PageHero`, section washes (`section--sand`, `section--bg`, named `section--*`), cards, walk steps, FAQ, CTA band, quote form
- **Responsive:** ~320px → desktop; sticky mobile contact bar
- **Checklist page:** interactive room checklist with sticky inspection progress, localStorage ticks, print/PDF

### UI redesign status

| Area | Status |
|---|---|
| Homepage, Pricing, Our Work, Reviews, FAQ, About, Contact | Done |
| Areas hub + 20 suburb pages | Done |
| Services hub + 22 service pages | Done |
| Blog index + posts | Done |
| Thank-you, Privacy, Terms, 404 | Done |
| Bond cleaning checklist (QLD) | Done (Unslop 9-pass polish) |
| Styleguide | Internal reference only |
| About team block / RealJob blocks | Ready when real content exists |

---

## Project structure

```
src/
  config/site.ts          # EVERY fact, flag, price, contact detail
  content/
    services/*.ts         # 22 service page bodies
    areas/*.ts            # 20 suburb page bodies
    blog.ts               # Blog posts
    shared.ts             # Shared phrases / RTA helpers
  data/
    site-data.json        # URLs, titles, H1s, metas, keywords (from kit)
    faqs.ts               # FAQ bank
    photos.ts             # Photo keys, alts, captions
    reviews.json          # Real Google reviews only
    rooms.ts
  components/             # Shared UI (Header, QuoteForm, FaqList, …)
    templates/            # AreaPage, ServicePage, SectionBlock
  pages/                  # Routes (see inventory below)
  layouts/BaseLayout.astro
  lib/schema.ts           # JSON-LD
  lib/tpl.ts              # Copy templating {phone}, {?flag}…{/flag}
  styles/global.css       # Design system
  assets/photos/          # Source images
public/                   # Fonts, brand SVGs, favicons, images
scripts/                  # audit.py, crop-photos.mjs, …
```

Each page file notes its **buyer-intent tier** in a top-of-file comment.

---

## Where to edit what

| What | Where |
|---|---|
| **Every fact, promise, price, flag** | `src/config/site.ts` (search for `[`) |
| Services & suburbs: URLs, titles, H1s, metas, keywords | `src/data/site-data.json` |
| Service copy (22) | `src/content/services/*.ts` |
| Suburb copy (20) | `src/content/areas/*.ts` |
| FAQ bank | `src/data/faqs.ts` |
| Blog posts | `src/content/blog.ts` |
| Photos + alt/captions | `src/data/photos.ts` + `src/assets/photos/` |
| Google reviews | `src/data/reviews.json` |
| Design / CSS | `src/styles/global.css` |
| JSON-LD | `src/lib/schema.ts` |
| Copy tokens (`{phone}`, `{reclean}`, `{?payAfter}…`) | `src/lib/tpl.ts` |

---

## Page inventory (62)

### Core & marketing
| Route | Notes |
|---|---|
| `/` | Homepage |
| `/pricing/` | Prices, packages, calculator, FAQ |
| `/our-work/` | Before/after gallery + photo report |
| `/reviews/` | Google reviews (empty until real ones added) |
| `/faq/` | FAQ hub |
| `/about/` | Company story / standards |
| `/contact/` | Quote form + channels |
| `/services/` | Services hub |
| `/areas/` | Areas hub + map |
| `/bond-cleaning-checklist/` | Interactive QLD checklist (print + localStorage) |
| `/blog/` + 4 posts | Guides |
| `/privacy/`, `/terms/` | Legal |
| `/thank-you/` | Form confirmation (**noindex**) |
| `/404/` | Custom not-found |
| `/styleguide/` | Internal (**noindex**) |

### Services (22) & areas (20)
Routed via `src/pages/[slug].astro` → `ServicePage` / `AreaPage` templates.  
Examples: `/end-of-lease-cleaning-brisbane/`, `/bond-cleaning-chermside/`, …

There is **no** `/bond-cleaning-brisbane/` page; it should 301 to `/`.

Sitemap excludes `/thank-you/`, `/styleguide/`, `/404/`.

---

## Config: flags, prices, content ops

### Promise flags (`src/config/site.ts`)

`flags` switch promises on/off everywhere (chips, copy, FAQs, schema):

`payAfter`, `reCleanWindowHours`, `guaranteeDays`, `freeCarpet`, `sameDay`, `noWeekendSurcharge`, `insuranceAmount`, `policeChecked`, `ownCrews`, `splitPayment`, `freeCancellationHours`, `monthlyInvoicing`, `noUrgentSurcharge`.

When the owner confirms a promise, set `confirmed.x = true` — `[brackets]` disappear from that wording.

### Prices

Set numbers in `prices` (`b1`–`b4`, add-ons, packages). While `b1` / `b2` are `null`, the site shows `[$]` and the quote form uses reply-time placeholder copy. Once set, the form can show a typical range after step 1.

### Real job on a suburb page

In `src/content/areas/*.ts`, replace `realJob: null` with:

```ts
{ street, property, agentList, found, did, outcome, photos }
```

Use a **street name only** (never a number). Never copy another suburb’s job or photos.

### Reviews

Paste real Google reviews into `src/data/reviews.json`:

```json
[{ "name", "suburb", "date", "text", "url" }]
```

Exactly as written on Google. Homepage, service pages, and `/reviews/` pick them up automatically. **Never** add `AggregateRating`.

### Forms & tracking

- **Quote form** → Netlify Form `quote` → `/thank-you/`
- **Partner form** → Netlify Form `partner` → `/thank-you/`
- Photo upload: **3 optional files** (Netlify limit: one file per field; ~8 MB total)
- `dataLayer` events ready: `call_click`, `whatsapp_click`, `quote_step1`, `quote_submit`
- Set `ga4Id` / `gtmId` in `site.ts` at go-live

### Checklist behaviour

`/bond-cleaning-checklist/` saves ticks in **browser `localStorage` only** (`bcbc_checklist`). Print/PDF uses the browser print dialog. Reset clears ticks.

---

## Indexing & environments

| Context | Indexable? |
|---|---|
| `SITE_URL=https://bondcleaningco.com` and `NOINDEX` not set | **Yes** |
| `*.netlify.app`, deploy previews, branch deploys | **Noindex** (`X-Robots-Tag` + robots meta) |

Go-live = set production env `SITE_URL=https://bondcleaningco.com` and redeploy. That fixes canonicals, sitemap, OG, and schema URLs.

---

## Decisions & kit notes

1. **Suburb briefs** in the kit were near-identical; every suburb page was rewritten for uniqueness (max 8-word-shingle overlap ~13%).
2. **Gallery alts** keep kit exact text; service heroes may lead with a truthful keyword; suburb pages don’t claim generic photos were shot there.
3. **CSV titles/H1s** that differ from the primary keyword were kept; the phrase appears in first 100 words, an H2, alt, and inbound anchors.
4. **Urgent page** tied to `sameDay` flag — off = “next available slot” and dropped from schema offers.
5. **Slider photos** = before/after halves of the oven shot, cropped square.
6. **Seal** reads “EST. 2026” (accurate; not a years-in-business claim).
7. **“Most booked”** on the 2-bed price card is a label only; no volume claims.
8. Word counts: homepage ~3k and end-of-lease ~1.8k can exceed targets because shared FAQ/checklist blocks add words; other pages are in range.

More detail: `DEVELOPER-HANDOFF.md`, `content-coverage.md`.

---

## Open items (fill in `src/config/site.ts`)

- [x] Phone: `0485 904 699` + `tel:+61485904699` + schema `+61 485 904 699`
- [ ] `[WHATSAPP]` (wa.me links)
- [x] Email: `info@brisbanebondcleaningco.com.au` + `sales@brisbanebondcleaningco.com.au`
- [ ] Hours `[Mon to Sun, 7am to 7pm]` and `hoursSchema`
- [ ] Reply time `[15 minutes]`, same/next-day cut-off `[2pm]`
- [ ] All prices `[$]`: 1–4 bed, add-ons, packages, furnished, extra bathroom
- [ ] `payAfter`: pay after the clean
- [ ] `reCleanWindowHours` `[24 hours]` and `guaranteeDays` `[7 days]`
- [ ] `freeCarpet`: free with every bond clean, or priced per room
- [ ] `sameDay` / `noUrgentSurcharge`: urgent capacity and pricing
- [ ] `noWeekendSurcharge`
- [ ] `insuranceAmount` `[$20m]` + certificate on About
- [ ] `policeChecked`, `ownCrews` (no subcontractors)
- [ ] `splitPayment` for share houses
- [ ] `freeCancellationHours` `[48 hours]` + later-cancellation policy (terms)
- [ ] `monthlyInvoicing` for partner agencies; turnaround `[24–48 hours]`
- [ ] Carpet / mattress drying times `[3–6 hours]` / `[4–6 hours]`
- [ ] `pestPartner`: licensed pest control partner’s name
- [ ] `gbpReviewLink` and `sameAs` (GBP, Facebook, Instagram)
- [ ] About: founder/team name, hiring/training, team photo (real only)
- [ ] FAQ A8 (bond claim evidence within 14 days): RTA/lawyer check wording
- [ ] Real jobs per suburb (`realJob`) and real Google reviews (`reviews.json`)
- [ ] GA4 or GTM ID (`ga4Id` / `gtmId`)
- [ ] **TODO:** Netlify UI → Forms → notifications → email for `quote` and `partner`

---

## Go-live checklist

1. Buy `bondcleaningco.com` (ideally also `.com.au` → redirect to `.com`).
2. Netlify → Domain management → add domain (HTTPS automatic).
3. Set `SITE_URL=https://bondcleaningco.com` (production) and **redeploy** (removes noindex; fixes canonicals/sitemap/OG/schema).
4. Fill `site.ts` open items; set `confirmed` for each signed-off promise.
5. Add form notification email in Netlify UI.
6. Add GA4/GTM IDs.
7. Submit `https://bondcleaningco.com/sitemap-index.xml` to Google Search Console **and** Bing Webmaster Tools.
8. Build Google Business Profile (name, identity, categories, services, 20 areas). Website:  
   `https://bondcleaningco.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`
9. Rich Results Test on `/`, one service page, `/faq/`; Lighthouse mobile on the live domain.

---

## After launch (playbook)

- Add a real job + photos to each suburb page as jobs happen.
- Publish ~2 blog posts / month; share each as a GBP post. Planned topics:
  1. Can Your Agent Make You Use Their Cleaner? Your Rights in QLD  
  2. Bond Cleaning With Pets: Carpets, Fleas and What the Lease Says  
  3. Moving Out of a Queenslander: The Bond Clean Jobs People Forget  
  4. Apartment Move-Outs in the Brisbane CBD: Lifts, Docks and Balconies  
  5. Failed Your Bond Inspection? What to Do in the Next 48 Hours  
  6. Bond Clean vs Regular Clean: What's Actually Different  
  7. The Exit Condition Report (Form 14a) Explained for Brisbane Renters  
  8. Agent Claiming Your Bond for Cleaning? How to Use Your Photo Report  
  9. Mould in a Rental Bathroom: What You Pay For and What You Don't (QLD)  
  10. 5 Questions to Ask Any Bond Cleaner Before You Book  
- Refresh homepage + service pages every ~3 months.
- Monthly: ask ChatGPT / Gemini / Perplexity / Google AI Mode “best bond cleaner in North Brisbane” and log who is named.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local Astro server |
| `npm run build` | Production static build → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run audit` | Content/SEO self-audit (`scripts/audit.py`) |
| `node scripts/crop-photos.mjs` | Re-crop slider source photos |

---

## Related docs

- `DEVELOPER-HANDOFF.md` — handoff notes for the next developer  
- `content-coverage.md` — keyword / content coverage map  
- Kit playbooks (if present in the parent kit folder): GBP alignment, sitemap keyword map  

---

© Bond Cleaning Brisbane Co. — Brisbane Northside bond cleaning specialists.
