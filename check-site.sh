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
echo "Internal links pointing at files that don't exist:"
grep -ho 'href="[^"#:]*\.html[^"]*"' *.html | sed 's/href="//;s/"//;s/#.*//' | sort -u \
  | while read -r p; do [ -f "$p" ] || echo "  MISSING: $p"; done
echo "  (clean if nothing listed)"
