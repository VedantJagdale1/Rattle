#!/bin/bash
# Flip the site from "temporary, hidden from Google" to "live on your real domain".
#
#   ./go-live.sh https://yourdomain.in
#
# It sets every page to index/follow, restores the canonical and og:url tags, and
# rewrites sitemap.xml and robots.txt to your domain. Re-runnable and idempotent.
set -e
cd "$(dirname "$0")"

DOMAIN="${1%/}"
if [ -z "$DOMAIN" ]; then
  echo "Usage: ./go-live.sh https://yourdomain.in"; exit 1
fi
case "$DOMAIN" in
  https://*) ;;
  *) echo "Domain must start with https:// — got '$DOMAIN'"; exit 1 ;;
esac

DOMAIN="$DOMAIN" python3 - <<'PY'
import os, pathlib, re

DOMAIN = os.environ["DOMAIN"]
NOINDEX_OK = {"404.html", "thanks.html"}   # these two stay out of search on purpose

pages = sorted(pathlib.Path('.').glob('*.html'))
for f in pages:
    s = f.read_text()
    url = DOMAIN + "/" + ("" if f.name == "index.html" else f.name)

    if f.name in NOINDEX_OK:
        s = re.sub(r'<meta name="robots" content="[^"]*">',
                   '<meta name="robots" content="noindex, follow">', s)
    else:
        s = re.sub(r'<meta name="robots" content="[^"]*">',
                   '<meta name="robots" content="index, follow">', s)

    s = re.sub(r'<link rel="canonical" href="[^"]*">\n', '', s)
    s = re.sub(r'<meta property="og:url" content="[^"]*">\n', '', s)

    anchor = re.search(r'<meta name="robots" content="[^"]*">\n', s)
    s = s[:anchor.end()] + f'<link rel="canonical" href="{url}">\n' + s[anchor.end():]

    og = re.search(r'<meta property="og:title" content="[^"]*">\n', s)
    if og:
        s = s[:og.end()] + f'<meta property="og:url" content="{url}">\n' + s[og.end():]

    s = re.sub(r'https://rattle\.in', DOMAIN, s)   # og:image, JSON-LD, logo
    f.write_text(s)

sm = pathlib.Path('sitemap.xml')
sm.write_text(re.sub(r'https://[^/<]+', DOMAIN, sm.read_text()))

pathlib.Path('robots.txt').write_text(
    "User-agent: *\nAllow: /\n\nSitemap: " + DOMAIN + "/sitemap.xml\n")

print(f"{len(pages)} pages now canonical to {DOMAIN}")
print("404.html and thanks.html deliberately left noindex.")

# Safety net: nothing should still mention the old placeholder domain
stray = [str(f) for f in list(pages) + [sm, pathlib.Path('robots.txt')]
         if 'rattle.in' in f.read_text()]
if stray:
    print("\n!! Still mentions rattle.in — fix by hand: " + ", ".join(stray))
else:
    print("No stray references to the old domain.")
PY

echo
echo "Next:"
echo "  1. Redeploy the site."
echo "  2. Verify the domain in Google Search Console and submit $DOMAIN/sitemap.xml"
echo "  3. Claim your Google Business Profile with the same phone number."
