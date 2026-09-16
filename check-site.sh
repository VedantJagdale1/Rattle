#!/bin/bash
# Consistency check for the duplicated header/footer across every page.
# Run this after ANY edit to the header, footer or contact details.
# Every count below must match across all rows; "dead" and "stale" must be 0.
cd "$(dirname "$0")"
printf "%-38s %-6s %-6s %-9s %-10s %-8s %-6s\n" PAGE dead stale fa-label mobile-cta privacy og:img
for f in *.html; do
  printf "%-38s %-6s %-6s %-9s %-10s %-8s %-6s\n" "$f" \
    "$(grep -c 'href="#"' "$f")" \
    "$(grep -Ec 'XXXXX|hello@rattle\.in' "$f")" \
    "$(grep -c 'fa-label' "$f")" \
    "$(grep -c 'nav-mobile-cta' "$f")" \
    "$(grep -c 'href="privacy.html"' "$f")" \
    "$(grep -c 'og:image"' "$f")"
done
echo
NOINDEX=$(grep -l 'content="noindex' *.html 2>/dev/null | wc -l | tr -d ' ')
if [ "$NOINDEX" -gt 2 ]; then
  echo "########################################################################"
  echo "#  $NOINDEX pages are set to NOINDEX — Google cannot see this site."
  echo "#  This is intentional while you are on a temporary subdomain."
  echo "#  When your real domain is ready:   ./go-live.sh https://yourdomain.in"
  echo "########################################################################"
  echo
fi
STRAY=$(grep -l 'rattle\.in' *.html sitemap.xml 2>/dev/null | wc -l | tr -d ' ')
if [ "$STRAY" -gt 0 ]; then
  echo "NOTE: $STRAY file(s) still reference rattle.in (JSON-LD / sitemap)."
  echo "      go-live.sh rewrites these when you set your real domain."
  echo
fi
# HTML comments cannot nest: a "<!--" inside a comment makes the first "-->" close it
# early and everything after it renders on the page. This shipped to production once.
python3 - <<'PYCHECK'
import pathlib
bad = []
for f in sorted(pathlib.Path('.').glob('*.html')):
    html = f.read_text(); i = 0
    while True:
        s = html.find('<!--', i)
        if s == -1: break
        e = html.find('-->', s + 4)
        line = html[:s].count('\n') + 1
        if e == -1:
            bad.append(f"{f.name}:{line} UNCLOSED comment"); break
        if '<!--' in html[s+4:e]:
            bad.append(f"{f.name}:{line} NESTED comment - content after it will render")
        i = e + 3
if bad:
    print("BROKEN HTML COMMENTS:")
    for b in bad: print("  " + b)
    print()
PYCHECK
echo "Internal links pointing at files that don't exist:"
grep -ho 'href="[^"#:]*\.html[^"]*"' *.html | sed 's/href="//;s/"//;s/#.*//' | sort -u \
  | while read -r p; do [ -f "$p" ] || echo "  MISSING: $p"; done
echo "  (clean if nothing listed)"
