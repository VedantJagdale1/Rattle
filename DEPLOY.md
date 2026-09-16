# Deploying the Rattle site

The site is a plain static folder — no build step. Everything is prepared; the only thing left is
signing in to a host, which only you can do.

**Current state: live-ready but deliberately hidden from Google.** All 15 pages carry
`noindex` while the site sits on a temporary subdomain. See "Going live properly" below.

---

## Option A — Netlify CLI (recommended)

You already have `npm`, so no install is needed.

```bash
npx netlify-cli deploy --dir . --prod
```

It opens a browser to sign in (GitHub or email), asks you to create a site, then uploads. You get
a URL like `https://rattle-abc123.netlify.app` in under a minute.

Rename it to something presentable in **Site settings → Change site name** — e.g.
`rattle-digital.netlify.app`.

## Option B — Netlify Drop (no terminal)

Go to **app.netlify.com/drop** and drag this folder onto the page. Same result, no CLI. You'll be
asked to create a free account to keep the site.

## Option C — Vercel

```bash
npx vercel --prod
```

`vercel.json` and `.vercelignore` are already configured.

---

## What gets published

Roughly **800 KB**. Excluded automatically:

- `.design/` — the logo canvas working files (2.6 MB), excluded as a dot-folder
- `*.md`, `*.sh`, `*.py` — returned as 404 by `netlify.toml`, so nobody can read your README,
  your project notes or `check-site.sh`

Already configured in `netlify.toml`: HTTPS strict transport, `nosniff`, clickjacking protection,
a referrer policy, one-year immutable caching on `/assets/*`, and revalidation on HTML so your
updates actually reach returning visitors.

---

## Immediately after the first deploy

1. **Activate the contact form.** Submit it once with real details on the live URL. FormSubmit
   emails rattledeveloper@gmail.com an activation link — click it, then submit once more to
   confirm a real email arrives. Until you do this, no enquiry reaches you.
2. **Open it on your phone.** Tap the footer links, the bottom Call and WhatsApp bar, and the
   contact form. Emulated testing is not the same as real thumbs.
3. **Send the link to two people** who have never seen it and watch where they hesitate.

---

## Going live properly (when you have a real domain)

Buy the domain, point its DNS at your host, then run one command:

```bash
./go-live.sh https://yourdomain.in
```

That flips all 15 pages to `index, follow`, restores every canonical tag and `og:url`, rewrites
`sitemap.xml`, `robots.txt`, the share image URL and the structured data — and tells you if it
finds anything it could not rewrite. `404.html` and `thanks.html` stay `noindex` on purpose.
It is safe to run more than once.

Then redeploy, and:

1. Verify the domain in **Google Search Console** and submit `https://yourdomain.in/sitemap.xml`
2. Claim your **Google Business Profile** with the same phone number as the footer
3. Add **Google Analytics 4** — you promise transparent reporting, so measure your own site
4. Set up an email address on the domain and replace the Gmail

`./check-site.sh` prints a loud banner the whole time the site is in noindex mode, so this cannot
be quietly forgotten.
