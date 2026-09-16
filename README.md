# Rattle — Company Website

A static marketing website for **Rattle**, a digital marketing & technology agency in Mumbai.
Plain HTML, CSS and JavaScript — no build step, no dependencies. Open `index.html` in a browser and it works.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, lead form, services, stats, process, industries, testimonials, blog, FAQ, areas served |
| `services.html` | Service **hub** — six summary cards linking to the pages below, plus capabilities, engagement models, case study |
| `seo-services.html` | SEO — targets "SEO services India" |
| `google-ads-management.html` | Google Ads / PPC |
| `social-media-marketing.html` | Social media marketing |
| `website-development.html` | Website design & development |
| `mobile-app-development.html` | Mobile app development |
| `graphic-design-branding.html` | Graphic design & branding |
| `about.html` | Story, mission/vision/values, team, process |
| `blog.html` | Blog listing (placeholder articles) |
| `contact.html` | Contact details, enquiry form, map slot, areas served |
| `404.html` | Not-found page |
| `privacy.html` | Privacy policy — required for Google Ads |
| `blog-how-long-does-seo-take.html` | First real article |
| `check-site.sh` | Consistency check across all pages |
| `thanks.html` | Post-submission page for the no-JavaScript path |
| `assets/css/style.css` | All styling (design tokens at the top under `:root`) |
| `assets/js/main.js` | Mobile menu, sticky header, FAQ accordion, counters, scroll reveal, form validation |
| `robots.txt`, `sitemap.xml` | SEO basics |

---

## Positioning: national, with a Mumbai base

The site targets **India-wide** keywords ("digital marketing agency in India"), not city-only ones.
Mumbai now appears in exactly four places, all factual: the footer address, the structured data,
one FAQ answer about where the team is based, and the first chip in the cities list.

**A trade-off worth understanding.** National keywords are far more competitive than local ones —
ranking for "digital marketing agency in Mumbai" is realistically months faster than for
"digital marketing agency in India", where you compete with agencies that have a decade of
backlinks. The usual way to have both:

1. Keep this national positioning on the main pages.
2. Claim your **Google Business Profile** with the Mumbai address — local search is a separate
   index, and it is the fastest source of early enquiries by a wide margin.
3. Later, add one city landing page per target market (`/digital-marketing-agency-pune.html`,
   etc.) with genuinely city-specific content. Thin, find-and-replace city pages get filtered by
   Google and can hurt you — only build one where you have something real to say.

---

## Contact details (already set)

| | |
|---|---|
| Phone | **+91 80102 18846** — `tel:+918010218846` |
| WhatsApp | `https://wa.me/918010218846` |
| Email | **rattledeveloper@gmail.com** |
| Address | Mumbai, Maharashtra, India — footer only; no office card or map on the contact page |

These are live across all six pages, the footer, the floating call/WhatsApp buttons and the
structured data in `index.html`.

---

## ⚠️ Still to replace before you go live

| Find | Replace with |
|---|---|
| `https://rattle.in` | Your real domain — in canonical tags, `og:url`, `sitemap.xml`, `robots.txt` |
| `href="#"` in topbar & footer socials | Your LinkedIn / Instagram / Facebook / YouTube URLs |
| `"sameAs"` array in `index.html` JSON-LD | The same real social URLs (or delete the array) |
| `Client Name` / testimonial text | **Real** client quotes only — never publish invented reviews |
| Homepage logo strip | Currently shows platforms you build on (true from day one). Swap for client logos only with written permission — markup is commented in `index.html` |
| Team cards in `about.html` | Real names, roles and photos |
| Placeholder blog posts | Your own articles, one HTML page each |

Check for leftovers:

```bash
grep -rn "TODO\|Client Logo\|Client Name\|rattle.in" --include="*.html" .
```

**Note on the domain:** every page's canonical tag and `og:url` still points at `https://rattle.in`.
Once you register your actual domain, do a find-and-replace across `*.html`, `sitemap.xml` and
`robots.txt` — wrong canonical URLs will hurt your search rankings.

---

## Building a real portfolio from zero

The site deliberately contains **no client work, no client logos and no invented statistics**.
Putting someone else's app or website up as Rattle's own is false advertising and copyright
infringement, and one prospect recognising the product costs you the deal and the reputation.

What works instead, roughly in order of speed:

1. **Build one polished demo product of your own.** A working booking system or storefront you
   can screen-share beats a logo wall for any technical buyer. Label it "in-house project" and
   be open that it's a demo — nobody minds, and it proves you can ship.
2. **Do two or three projects at a reduced rate** in exchange for a written case study and
   permission to publish the client's name. Explicitly agree this in writing before you start.
3. **Contribute to open source** and link the commits. Verifiable, free, and it shows real code.
4. **Publish your process.** The `services.html` capabilities section and the "What we don't
   promise" section already do a lot of this work — specificity reads as experience.

A fill-in case-study card is commented into `services.html`, ready for your first real project.
Use measured numbers only — figures you can evidence from GA4, Search Console or the ad account.

---

## The contact form — how it sends, and the one step you must do

Both forms (homepage and contact page) POST to **FormSubmit**, which forwards submissions to
**rattledeveloper@gmail.com**. No account, no API key, no backend.

### ⚠️ Step you must do once: activate the address

FormSubmit will not deliver anything until the receiving address is confirmed.

1. Put the site online (or just open `contact.html` from a served URL — `file://` will not work).
2. Submit the form once yourself, with real details.
3. FormSubmit emails **rattledeveloper@gmail.com** an activation link. **Click it.**
4. Submit once more to confirm a real email arrives. Check spam on the first one.

Until you do this, submissions are accepted but nothing reaches your inbox.

### Recommended follow-up: hide your email from the page source

Right now the address sits in the form's `action`, visible to anyone viewing source — which is
how scrapers build spam lists. After activating, FormSubmit gives you a random alias like
`https://formsubmit.co/a1b2c3d4e5f6`. Swap it in:

```bash
sed -i '' 's|formsubmit.co/rattledeveloper@gmail.com|formsubmit.co/YOUR_ALIAS|g' index.html contact.html
```

The JavaScript converts whatever is in `action` to the AJAX endpoint automatically, so nothing
else needs changing.

### Also update

`_next` in both forms currently points at `https://rattle.in/thanks.html`. Change it to your real
domain — it is where visitors land if JavaScript is disabled.

### How it behaves

- **Validates first** — nothing is sent until every required field is valid.
- **Never fakes success.** The success message appears only when FormSubmit confirms receipt.
- **On failure it says so**, keeps everything the visitor typed, and shows a tappable phone
  number so the lead still reaches you.
- **Honeypot field** (`_honey`) silently drops bot submissions.
- **`source_page`** tells you whether a lead came from the homepage or the contact page.
- **Works without JavaScript** — a plain POST redirects to `thanks.html`.

### Swapping to another provider

| Provider | Change needed | Notes |
|---|---|---|
| **Netlify Forms** | Add `data-netlify="true"` and a hidden `form-name` input; remove `action` | Best if you host on Netlify — submissions in the dashboard, 100/month free |
| **Web3Forms** | Set `action` to `https://api.web3forms.com/submit`, add hidden `access_key` | 250/month free, email never exposed |
| **Formspree** | Set `action` to your `https://formspree.io/f/xxxx` endpoint | 50/month free |

For Netlify and Web3Forms the AJAX URL rewrite in `main.js` (the `.replace('formsubmit.co/', …)`
line) becomes a no-op, so those work unchanged.

**Whichever you use, test it monthly.** A silently broken contact form is the most expensive bug
a service business can have — you never find out about the enquiries you never received.

---

## Putting it online

See **[DEPLOY.md](DEPLOY.md)** — one command with npm, plus what to do immediately after.

The site is currently **noindex on purpose** while it lives on a temporary subdomain. When your
real domain is ready, `./go-live.sh https://yourdomain.in` flips everything over in one step.

---


## After launch — the SEO checklist

1. Verify the site in **Google Search Console** and submit `sitemap.xml`.
2. Create/claim your **Google Business Profile** (this is what gets you into the Mumbai map pack) — same name, address and phone as the footer.
3. Add **Google Analytics 4**: paste the gtag snippet just before `</head>` on every page.
4. Ask your first clients for **Google reviews** — they feed local rankings and the testimonial section.
5. Publish real blog posts. Create one HTML file per post (copy `404.html`'s structure), link them from `blog.html`, and add each URL to `sitemap.xml`.
6. Keep the NAP (name, address, phone) identical everywhere online.

---

## Updating a live site (cache busting)

CSS and JS are linked with a version query string:

```html
<link rel="stylesheet" href="assets/css/style.css?v=1.2">
<script src="assets/js/main.js?v=1.2"></script>
```

**Every time you change `style.css` or `main.js` on a live site, bump that number in all six HTML
files.** Without it, returning visitors keep the old cached stylesheet and your changes appear
broken or simply don't show — this bit us during development, and it will bite you on a client
site where you can't tell people to hard-refresh.

```bash
sed -i '' 's/?v=1\.2/?v=1.3/g' *.html
```

---

## Responsive & accessibility status

Audited at 320px, 375px, 768px, 1280px and 1440px across all six pages:

- No horizontal overflow at any width, on any page
- Layouts collapse 4 → 2 → 1 column; the nav becomes a burger menu below 860px
- Every tap target meets the WCAG 2.5.8 minimum of 24px on mobile
- Body text is 16px; nothing renders below 12px

### Mobile-specific behaviour (see the bottom of `style.css`)

- **Form inputs are forced to 16px below 860px.** iOS Safari zooms the whole page when a focused
  input is smaller than that. This is the single most common mobile bug on Indian business sites.
- **A fixed bottom action bar** (Call / WhatsApp) replaces the floating circles below 640px, with
  `env(safe-area-inset-bottom)` for the iPhone home indicator and matching `body` padding so it
  never covers the footer. Above 640px it reverts to the two floating circles.
- **Body scroll is locked** while the mobile menu is open, and the menu auto-closes if the device
  is rotated past the 860px breakpoint (otherwise the page would stay unscrollable).
- Tighter section, card and grid spacing below 640px, and a narrower gutter below 400px.

Re-run the audit after any layout change — the contact page's phone/WhatsApp/email links were
18px tall before the fix, which are the most valuable taps on the entire site.

---

## Launch blockers — done

| Item | Status |
|---|---|
| Social share image | `assets/img/og-image.png` (1200×630), wired into all 9 pages with Twitter card tags |
| Privacy policy | `privacy.html`, linked from every footer — **required by Google Ads** |
| Dead social links | Removed. Restore markup is commented into the topbar and footer of every page |
| Dead blog links | `blog.html` now shows one real article; upcoming topics are plain text, not links |
| First real article | `blog-how-long-does-seo-take.html`, with `BlogPosting` schema |
| Thank-you page | `thanks.html` (no-JavaScript form path) |

**Still to do before launch:** activate the form (submit once and click the email FormSubmit
sends), replace `https://rattle.in` with your real domain everywhere, and either add real social
profile URLs or leave the icons out.

---

## ⚠️ The header and footer are duplicated in all 9 pages

This is the biggest maintenance trap in the project, and it has already caused one bug: three
pages were built from a stale copy and shipped with the old placeholder phone number and email.

**After any change to the header, footer or contact details, run:**

```bash
./check-site.sh
```

Every column must match across all rows; `dead` and `stale` must be `0`. To propagate a header or
footer change, edit one page, verify it, then copy that block into the rest — do not hand-edit
nine files.

---

## One page per service — why, and the rule that keeps it working

`services.html` used to try to rank for SEO, Google Ads, social media, web development, app
development and design all at once, so it ranked properly for none. Each service now has its own
page targeting its own keyword cluster, with:

- a unique title (all six under 60 characters so Google doesn't truncate them) and description
- ~1,000+ words of genuinely different content — not a find-and-replace of the same text
- `Service` + `BreadcrumbList` + `FAQPage` schema, with five real FAQs each
- a "when this isn't right for you" section, which disqualifies bad-fit leads before they waste
  your time and reads as confidence to the right ones
- cross-links to the other five services

**The rule: never duplicate service copy back onto the hub.** Two pages competing for the same
keyword cannot both win — Google picks one and often picks the weaker. The hub summarises and
links; the detail lives on the service page. If you add a seventh service, give it its own page
and add a summary card to the hub.

**Adding a city page later?** Same rule, and stricter. One page per city only where you have
something genuinely city-specific to say. Thin pages that swap "Mumbai" for "Pune" get filtered
by Google and can drag down the pages that do work.

---

## Logo & brand assets

The logo is **Segments** — three tapering rounded bars, ink → blue → cyan. Full specification,
geometry, colour rules, clear space, minimum sizes and the complete file list are in
[`assets/brand/BRAND.md`](assets/brand/BRAND.md).

Header and footer marks are inline SVG with `.s1` / `.s2` / `.s3` classes coloured from
`style.css`, so the same markup works on white and on ink. **To change a brand colour, change the
token in `:root`** — don't edit the SVG in 15 files.

One thing to do before any print job: the lockup SVGs carry live text, not outlines. Convert the
text to outlines in Figma or Illustrator before sending artwork to a printer or signmaker.

---

## Editing notes

- **Colours** live in `assets/css/style.css` under `:root` — change `--brand` and `--accent` and the whole site follows.
- **Fonts** are Plus Jakarta Sans (headings) + Inter (body), loaded from Google Fonts in each page's `<head>`.
- The header and footer are **duplicated in each HTML file**. Change one, change all — or move to a static-site generator later if that becomes annoying.
- Sections animate in on scroll via the `reveal` class; add it to any new section to match.
