# Rattle — logo & brand assets

The mark is **Segments**: three tapering rounded bars, ink → blue → cyan. It draws the name
directly — a rattlesnake's rattle is stacked tapering segments, and a rattle is a warning you
cannot ignore, which is what a brand hires a marketing agency to become.

## The geometry

The logo is three rectangles on a 56×56 grid. These numbers are the logo — rebuild from them,
never trace a PNG:

| Segment | x | y | width | height | radius | colour |
|---|---|---|---|---|---|---|
| 1 (top) | 13 | 9 | 30 | 12 | 6 | `#0B1B3A` ink |
| 2 (middle) | 17 | 24 | 22 | 11 | 5.5 | `#1D4ED8` brand blue |
| 3 (bottom) | 21 | 38 | 14 | 10 | 5 | `#06B6D4` cyan |

Each segment is a full pill: the radius equals half the height, so the ends stay perfectly round
at any size. Every segment is centred on x = 28.

## Colours

| Role | Hex | Use |
|---|---|---|
| Ink | `#0B1B3A` | Segment 1, body text, dark backgrounds |
| Brand blue | `#1D4ED8` | Segment 2, buttons, links |
| Cyan | `#06B6D4` | Segment 3, accents |
| Light blue | `#93C5FD` | Segment 2 **only on dark backgrounds** |

On dark backgrounds segment 1 becomes white and segment 2 becomes light blue — ink on ink would
disappear. `rattle-mark-reversed.svg` is that version.

## Files

**Marks (transparent)**
- `rattle-mark.svg` — primary, for light backgrounds
- `rattle-mark-reversed.svg` — for dark backgrounds
- `rattle-mark-mono-ink.svg` / `rattle-mark-mono-white.svg` — single colour, for stamps,
  embroidery, faxes, anywhere you get one ink
- `rattle-mark-1024.png` / `rattle-mark-reversed-1024.png` — raster, for anything that won't take SVG

**Lockups**
- `rattle-logo-horizontal.svg`, `rattle-logo-horizontal-reversed.svg`, `rattle-logo-stacked.svg`

⚠️ **The lockups contain live text, not outlines.** They render correctly wherever Plus Jakarta
Sans is available (the website loads it from Google Fonts). Before sending artwork to a printer,
a signmaker or anyone outside your team, open the SVG in Figma or Illustrator and convert the text
to outlines — otherwise it will silently substitute a different typeface.

**Icons**
- `rattle-icon-boxed.svg` — the mark on a blue rounded square, used as the site favicon
- `favicon-16.png`, `favicon-32.png`, `favicon-48.png`
- `apple-touch-icon.png` (180px, square, no rounding — iOS masks its own corners)
- `icon-192.png`, `icon-512.png` — for a web app manifest

## Why the favicon is boxed but the header mark is not

Bare on white, three thin bars have no presence in a browser tab full of coloured squares. Boxing
it for favicons and app icons is deliberate and standard practice — the identity is the segments,
the box is just the container they sit in when they need to hold their own.

## Rules

- **Clear space**: keep at least the height of segment 3 (10 units, ~18% of the mark) clear on all
  sides. Nothing crowds it.
- **Minimum size**: 20px tall for the bare mark, 16px for the boxed icon. Below that the bottom
  segment closes up.
- **Don't**: recolour segments outside the palette, add a gradient, outline it, add a drop shadow,
  rotate it, change the spacing between segments, or stretch it non-proportionally.
- **On photos**: use the reversed mark on a dark area, or the mono white version. Never place the
  full-colour mark on a busy image.

## Typography

- Headings and the wordmark: **Plus Jakarta Sans**, 800 weight, letter-spacing −0.03em
- Body: **Inter**, 400/500/600
- Descriptor line ("DIGITAL MARKETING"): Inter 600, letter-spacing 0.2em, uppercase

## In the website

The header and footer marks are inline SVG with segment classes (`.s1`, `.s2`, `.s3`) coloured
from `assets/css/style.css`, so one piece of markup serves both light and dark contexts. To change
a brand colour, change the token in `:root` — don't edit the SVG.
