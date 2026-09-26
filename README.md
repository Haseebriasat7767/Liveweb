# LUXURY LEAD MACHINE

**A premium digital showroom + lead-generation machine for luxury real-estate agencies.**

Not a template, not an MLS clone, not a SaaS dashboard. A single-property cinematic
presentation engineered around one commercial objective:

> Turn a high-intent visitor into a **private showing request**, a **property inquiry**,
> or a **buyer/seller consultation** — without ever letting friction into the experience.

> **Everything on this site is fictional.** Villa Marisol is a demonstration property.
> It is not for sale, and no content here is an offer for, or solicitation of, real property.

---

## 1. Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (static + API routes)
npm start
npm run typecheck  # strict TS, no emit
npm run qa         # structural QA against a running dev server (43 checks)
```

Fonts are self-hosted variable files in `app/fonts` — no third-party font requests, no
build-time network access needed.

---

## 2. What is on the page

The site is one continuous cinematic story, in this order:

| # | Section | Purpose | Anchor |
|---|---------|---------|--------|
| 01 | Cinematic hero (film or image, 4-stage reveal) | Attention | `#hero` |
| 02 | Property introduction | Desire | `#residence` |
| 03 | Statistics (animated editorial numerals) | Substance | `#statistics` |
| 04 | Architectural story (3 chapters, parallax drift) | Story | `#architecture` |
| 05 | Signature spaces (hover index on desktop, swipe deck on mobile) | Discovery | `#spaces` |
| 06 | Interactive gallery + fullscreen viewer | Immersion | `#gallery` |
| — | Amenities | Substance | `#amenities` |
| 07 | Interactive floor plan (4 levels, clickable rooms) | Understanding | `#floor-plan` |
| 08 | Location (drawn schematic, travel rings, editorial columns) | Context | `#location` |
| 09 | Property film (real video **or** still sequence, custom controls) | Immersion | `#film` |
| 10 | Advisor credibility | Trust | `#advisor` |
| 11 | Private showing CTA | Action | `#private-showing` |
| 12 | Lead qualification (inside the form, never in front of it) | Qualification | — |
| 13 | Contact / booking (every channel config-driven) | Action | `#contact` |
| — | Footer (compliance furniture, disclaimers) | Trust | `#footer` |

Plus: a quiet floating navigation that adapts on scroll, a chapter rail on large
screens, a floating *Private Showing* badge on desktop, a **Call · Inquire · Showing**
sticky bar on mobile, and — in demo mode — a client-closing demo dock.

---

## 3. Architecture

```
app/
  layout.tsx                 fonts, metadata, nav, rail, sticky conversion, footer, JSON-LD
  page.tsx                   section composition (the story order)
  globals.css                design tokens, editorial type scales, motion safety rails
  fonts/                     self-hosted variable fonts (Inter, Cormorant Garamond)
  api/leads/route.ts         POST a lead · GET the advisor inbox
  api/analytics/route.ts     optional server-side event sink (PII-filtered)
  api/health/route.ts        integration sanity check
  privacy/ terms/ fair-housing/   compliance pages (templates, flagged in demo mode)
  sitemap.ts robots.ts manifest.ts not-found.tsx icon.svg
components/
  navigation/  FloatingNav · ChapterRail · StickyConversion · DemoDock
  hero/        Hero
  property/    Introduction · Statistics · ArchitectureStory · SignatureSpaces · Amenities
  gallery/     Gallery · Lightbox
  floor-plan/  FloorPlanExplorer · PlanDrawing
  location/    LocationSection
  film/        PropertyFilm
  agent/       AgentSection
  lead-form/   LeadConversion · LeadForm · ContactPanel
  footer/      Footer
  seo/         StructuredData
  ui/          Reveal · SplitLines · CountUp · Button · Media · SectionHeading
data/
  site.ts property.ts rooms.ts gallery.ts floorPlans.ts location.ts
  agent.ts contact.ts leadSettings.ts index.ts
lib/
  leads.ts (validation + scoring) · leadStore.ts (persistence) · analytics.ts
  conversion.ts (CTA ↔ form intent, draft protection) · planEvents.ts
  structuredData.ts · hooks.ts · utils.ts
public/images · public/videos · public/floorplans
```

---

## 4. White-labelling — a new client in minutes

Every word, number, image path and contact channel comes from `data/`. **No component
contains property content.** Replace the files below and the showroom re-brands:

| File | Controls |
|------|----------|
| `data/site.ts` | Brand name, canonical URL, analytics provider, legal routes, demo mode |
| `data/property.ts` | Name, listing title, price, address, hero (film/image), intro, stats, architectural story, film, amenities, conversion copy, SEO |
| `data/rooms.ts` | Signature spaces: names, descriptions, dimensions, features, photography, plan links |
| `data/gallery.ts` | Photo essay frames, crops (`focal`), captions, grid weights |
| `data/floorPlans.ts` | Levels, room geometry, areas, dimensions, linked photography |
| `data/location.ts` | Destinations, travel times, groups, schematic plot positions, quick facts |
| `data/agent.ts` | Advisor, brokerage, bio, expertise, credentials (placeholder-flagged), portrait |
| `data/contact.ts` | Phone, SMS, email, WhatsApp, booking URL, hours, office. **Blank = hidden everywhere** |
| `data/leadSettings.ts` | Intents, qualification options, required fields, consent copy, delivery, spam rules |

**Swap artwork:** drop new files into `public/images` using the same filenames, or point
each `imageSrc` at a new path. Crop control lives in one prop (`objectPosition`, exposed
as `focal`/`objectPosition` in config) so new photography never breaks a composition.

**Add the film:** place the client film at `public/videos/property-film.mp4` and set
`property.film.videoSrc`. Same for `property.hero.videoSrc` if they want a video hero.
Until then both players run a designed fallback (poster + still sequence) — never an
empty frame.

**Advisor portrait:** `agent.photoSrc` ships set to `/images/agent.jpg` (demonstration
artwork). Replace the file with a real portrait, or set the value to `null` and the section
renders a composed monogram panel instead of a broken image.

**Imagery set:** 19 files in `public/images` — hero, aerial estate, three architectural-story
frames, ten room frames and the advisor portrait. Every file is referenced and every reference
resolves; the gallery, the spaces index and the floor-plan dossier all read from `data/`.

---

## 5. Lead pipeline

```
visitor submits
   → client validation (all errors at once, values never cleared, draft saved locally)
   → POST /api/leads  (JSON)
       → rate limit (6/min/IP) → honeypot field → validation → normalisation
       → qualification score (0–100, advisor-side only)
       → persist to .data/leads.ndjson (nothing is ever lost)
       → optional webhook / CRM forward
   → success state with a reference number (e.g. VM-TXDQ73TG), next steps, and direct lines
```

**Lead record:** `firstName, lastName, email, phone, preferredDate, preferredTime,
intent, buyingTimeline, visitorIntent, preferredContact, message, property,
propertyReference, source, landingPath, referrer, utm, submittedAt, reference, consent,
marketingConsent, ownershipConfirmed, score, meta`.

**Validation:** required first/last name, valid email, phone with 7–15 digits, a valid
intent, no past dates, consent where legally required. Server re-validates everything and
returns per-field errors (HTTP 422) that the form maps back onto the inputs.

**Spam protection:** honeypot field, minimum completion time, and in-memory rate limiting.
Honeypot hits are answered politely and stored nowhere.

**Advisor inbox:** `GET /api/leads?limit=20`. Open in demo mode; in production set
`LEAD_ADMIN_TOKEN` and pass `?token=…`.

---

## 6. Analytics

Provider-swappable via `NEXT_PUBLIC_ANALYTICS_PROVIDER` = `none | console | gtm |
plausible | segment`. Events are typed in `lib/analytics.ts` and never carry personal
data — only shapes and categories:

```
page_view · hero_cta_click · hero_secondary_click · nav_cta_click · section_view
scroll_depth · gallery_open · gallery_navigate · floorplan_open · floorplan_room_select
room_space_select · video_play · video_pause · video_progress · agent_contact_click
phone_click · email_click · whatsapp_click · sms_click · booking_click
showing_form_open · showing_form_submit · lead_form_error · demo_dock_open
```

In demo mode the dock's **Events** tab streams them live while the client watches.

---

## 7. SEO

* Semantic landmarks, single `H1`, ordered `H2/H3`.
* `RealEstateListing` (wrapping `SingleFamilyResidence`), `RealEstateAgent` and `WebSite`
  JSON-LD built from configuration.
* Open Graph + Twitter/X cards, canonical URLs, `sitemap.xml`, `robots.txt`, web manifest.
* Descriptive alt text on every photograph; `aria-hidden` on decorative crops.
* No keyword stuffing anywhere.

---

## 8. Performance & accessibility

* Self-hosted variable fonts (two files, preloaded, no external requests).
* `next/image` with responsive `sizes`, AVIF/WebP, lazy loading everywhere except the
  hero (priority + `fetchpriority="high"`).
* Video only loads when the visitor presses play; posters stand in until then.
* Motion is scroll-triggered and one-directional, with `prefers-reduced-motion`
  honoured globally in `globals.css` and inside every animated component.
* Keyboard: skip link, focus-visible rings, focusable floor-plan rooms and map pins,
  arrow/Escape handling in the gallery viewer, Escape handling in the mobile menu.
* No-JS fallback: a `<noscript>` layer restores content that scroll reveals would
  otherwise keep hidden.

---

## 9. Demo mode (client-closing)

`NEXT_PUBLIC_DEMO_MODE=true` (default) turns on:

* a **Demo** chip bottom-left that opens a dock with the live **lead inbox**
  (with qualification scores), the **event stream**, and the **white-label map**;
* placeholder markers on any figure or credential that must be replaced before publishing;
* a template notice on the compliance pages.

Set `NEXT_PUBLIC_DEMO_MODE=false` for a live client listing: the dock, the placeholder
markers and the notices disappear.

---

## 10. Honesty rules baked into the build

* The property is explicitly fictional — stated in `data/property.ts`, in the footer, and
  in these docs.
* Credentials and advisor figures ship as placeholders with visible markers, never as
  claimed facts.
* Floor plans and travel times are labelled indicative/not to scale; no measurements are
  invented as surveyed data.
* No testimonials, no awards, no fake statistics, no fake reviews anywhere in the build.
* **All photography is synthetic demonstration artwork**, generated for this build — it is not
  photography of a real property and must be replaced with the client's own commissioned
  imagery before a live listing. The same applies to the advisor portrait. This is stated in
  the README, in the demo-mode note beside the introduction, and flagged in `data/agent.ts`.

---

## 11. QA status

Verified in this environment:

- `npm run build` — clean, 13 routes, ~193 kB first-load JS on `/`.
- `npm run typecheck` — clean, strict mode.
- Routes: `/`, `/privacy`, `/terms`, `/fair-housing`, `/sitemap.xml`, `/robots.txt`,
  `/manifest.webmanifest`, `/icon.svg` → 200; unknown route → 404.
- Lead API: valid submission → 201 + reference + stored; invalid → 422 with all field
  errors; honeypot → filtered and not stored; rate limit → 429.
- Image optimiser: 200 for every referenced asset; no missing files, no broken `src`.

Because this container has no browser, the pixel-level checks in the brief (horizontal
overflow at 360/375/390/768/1024/1280/1440, console cleanliness, keyboard walkthrough)
are enforced in code rather than screenshot-tested: `overflow-x: clip` on `html, body`,
fluid `clamp()` type, no fixed-width blocks, `min-width` only inside intentionally
scrollable plan containers, `env(safe-area-inset-bottom)` on the mobile bar, and a
`100svh` hero that degrades gracefully on short screens. Run the checklist below in a
real browser before hand-off:

```
LAND → EXPLORE → VIEW PROPERTY → OPEN GALLERY → VIEW FLOOR PLAN →
LEARN ABOUT AGENT → REQUEST SHOWING → SUBMIT LEAD → SUCCESS
```

---

## 12. Deploying

Any Node host works (Vercel, Netlify, Fly, a container). Copy `.env.example` →
`.env.local` (or set the variables in the host dashboard) and set:

```
NEXT_PUBLIC_SITE_URL            canonical URL (optional — see below)
NEXT_PUBLIC_DEMO_MODE           false for a live listing
NEXT_PUBLIC_ANALYTICS_PROVIDER  none | console | gtm | plausible | segment
LEAD_EMAIL_RECIPIENT            where leads are addressed
LEAD_WEBHOOK_URL                optional CRM/automation webhook
LEAD_CRM_PROVIDER               label for the record
LEAD_ADMIN_TOKEN                enables GET /api/leads in production
NEXT_PUBLIC_PHONE / SMS / EMAIL / WHATSAPP_NUMBER / BOOKING_URL   contact channels
```

> **Canonical URL is automatic on Vercel.** `lib/siteUrl.ts` resolves the origin in this
> order: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → the configured
> fallback. A fresh Vercel deployment therefore emits correct canonical, Open Graph,
> Twitter, JSON-LD and sitemap URLs with no environment variables set. Set
> `NEXT_PUBLIC_SITE_URL` once the property has its own domain.
>
> `GET /api/health` reports `deployment.canonicalUrl` so you can confirm what a
> deployment believes its origin is.

For a client hand-off, also swap `.data/leads.ndjson` for their CRM (the persistence call
is isolated in `lib/leadStore.ts`) and put the property behind a password if the listing
is confidential.

---

---

## 12b. Vercel — the three settings that break a fresh deploy

A new Vercel project on this repository usually goes live on the first try, but three
project settings cause the exact symptoms people report as *“the build worked and the URL
404s”*. Check them in this order.

### 1. The URL you are opening must belong to the project

Every Vercel project gets its own domains. `liveweb.vercel.app` is **already owned by an
unrelated account** (it serves a Vercel example app), so a project named `liveweb` never
receives that hostname — it gets a scoped domain instead, of the form:

```
<project>-<team-slug>.vercel.app          # production alias
<project>-<deployment-id>-<team-slug>.vercel.app   # immutable per-deployment URL
```

A hostname with **no deployment behind it** answers with Vercel's platform page —
`This page doesn’t exist / 404 NOT_FOUND` — for every path, including `/api/health`.
If the API route also 404s, the host is not your project; take the URL from
**Project → Domains** (or the deployment's *Visit* button) rather than typing one.

Quick check from any terminal:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<your-deployment-url>/api/health
# 200 → this is your deployment.   404 → this host is not serving your project.
```

### 2. Deployment Protection must be off for the link to be shareable

New projects can ship with **Vercel Authentication** enabled, which makes every URL —
preview *and* production — redirect to `vercel.com/login` for anyone who is not signed in
to your team. The build is fine; the link simply is not public.

> Settings → **Deployment Protection** → *Vercel Authentication* → **Disabled**
> (or set protection to *Standard* so only previews are protected).

Do this before sending the link to a client or a seller.

### 3. Production Branch must exist

Vercel deploys the **Production Branch** (defaults to `main`). This repository's app lives
on `arena/01a0d47d-liveweb`, and there is no `main` branch — so if the project's
production branch is still `main`, there is nothing to build for production and the
production domain stays empty.

> Settings → **Git** → *Production Branch* → select the branch that actually contains the
> application, then **Redeploy**.

Already-deployed URLs remain valid: the per-deployment hostname above always points at the
build it was created for.

### 4. Leads do not survive on a serverless filesystem

`lib/leadStore.ts` writes to `.data/leads.ndjson`, which works on a long-running Node
server (`next start`, a container, a VPS) but **not on Vercel**, where the filesystem is
read-only or ephemeral. On serverless hosts the webhook is the system of record:

```
LEAD_WEBHOOK_URL=https://hooks.zapier.com/...   # or your CRM / database endpoint
```

The API now says so out loud: `GET /api/health` reports
`deployment.persistentLeadStore`, and a submission that could be stored nowhere is logged
as a warning in the deployment logs and returned as `deliveryWarning` — the visitor still
gets their confirmation, and the operator gets told. A webhook is a two-minute change in
`lib/leadStore.ts` if you'd rather write straight to Supabase, KV or Airtable.

---

## 13. The next version

The frontend is deliberately CMS-shaped: every string and asset lives in a typed config
object (`propertyConfig`), which is exactly the shape a dashboard would edit. Adding a
headless CMS means loading that object at request time instead of import time — no
component changes.
