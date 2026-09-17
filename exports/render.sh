#!/bin/bash
# One Chrome invocation per file, each with its own profile and a hard timeout,
# so a single hang cannot stall the whole batch.
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd "$(dirname "$0")"
run () {
  slug="$1"; w="$2"; h="$3"
  P=$(mktemp -d)
  "$CHROME" --headless=new --disable-gpu --no-sandbox --disable-dev-shm-usage \
    --user-data-dir="$P" --virtual-time-budget=8000 --no-pdf-header-footer \
    --print-to-pdf="$slug.pdf" "file://$PWD/_build/$slug.html" >/dev/null 2>&1
  "$CHROME" --headless=new --disable-gpu --no-sandbox --disable-dev-shm-usage \
    --user-data-dir="$P" --virtual-time-budget=8000 \
    --window-size="$w,$h" --force-device-scale-factor=2 \
    --screenshot="$slug.png" "file://$PWD/_build/$slug.html" >/dev/null 2>&1
  rm -rf "$P"
  echo "$slug  pdf=$([ -f "$slug.pdf" ] && echo ok || echo FAIL)  png=$([ -f "$slug.png" ] && echo ok || echo FAIL)"
}
run rattle-a4-direct-response 794 1123
run rattle-a4-restrained      794 1123
run rattle-a4-apple-language  794 1123
run rattle-a5-leaflet         559 794
run rattle-social-ad          1080 1080
echo "BATCH COMPLETE"
