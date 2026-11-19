# Changelog — Lino Weekend

All changes are logged below with enough detail to revert any individual item.

---

## Latest (parallax + cleanup pass)

### Fixed: `.hero .hero-paper` transform conflict (CSS)
**File:** `styles.css`, section "5b. Hero parallax"  
**What:** The `stamp` keyframe animation and the parallax both set the `transform`
property on `.hero .hero-paper`. The parallax `translate()` was overriding the
animation's final `rotate(3deg)` state, so the paper never actually parallaxed.  
**Fix:** Removed the parallax `transform` from `.hero .hero-paper` and replaced it
with an explanatory comment (lines 303–306). Also removed `.hero .hero-paper`
from the `prefers-reduced-motion` block since it no longer has parallax styles.  
**To undo:** Re-add:
```css
.hero .hero-paper {
	transform: translate(calc(var(--parallax-x) * 0.18), calc(var(--parallax-y) * 0.18));
	transition: transform 0.1s ease-out;
	will-change: transform;
}
```
and add `.hero .hero-paper` back into the reduced-motion selector list.

### Fixed: Duplicate `:root` block (CSS)
**File:** `styles.css`  
**What:** Section 5b had a second `:root { --parallax-x: 0; --parallax-y: 0; }`.  
**Fix:** Moved those two variables into the main `:root` block (lines 22–23) and
deleted the duplicate `:root` from section 5b.  
**To undo:** Re-add the `:root` block above `.hero .parallax__text` in section 5b
and remove the two lines from the main `:root`.

### Fixed: Date typo (HTML)
**File:** `linoWeekendWorkshop.html`, line 58  
**What:** Hero facts listed "13–14 March 2026" (in the past).  
**Fix:** Changed to "13–14 March 2027".  
**To undo:** Change `2027` back to `2026` on line 58.

### Added: Parallax effect (HTML + CSS + JS)
**Files:** `linoWeekendWorkshop.html`, `styles.css`  
**What:** Mouse-driven parallax across four hero layers:
- `.parallax__text` inside `.headline__layer--offset` (0.12×, moves with mouse)
- `.parallax__text` inside `.headline__layer--front` (−0.06×, counter-parallax)
- `.hero-art` SVG (0.04×, moves slightly with mouse)
- `.hero .hero-paper` — excluded (see conflict fix above)

**HTML changes:**
- Wrapped the inner text of both headline layers in `<span class="parallax__text">`
- Added an IIFE at end of `<script>` that reads mouse position over `.hero` and
  sets CSS custom properties `--parallax-x` / `--parallax-y` on `:root`
- Resets to `0` on `mouseleave`; disabled under `prefers-reduced-motion`

**CSS changes:**
- Added section "5b. Hero parallax" with `translate(calc(...))` transforms on each
  layer using different multipliers
- Added `--parallax-x` / `--parallax-y` defaults to `:root`
- Added reduced-motion override for parallax layers

**To undo:** Remove section "5b" from CSS, remove the two `--parallax-*` lines
from `:root`, unwrap `<span class="parallax__text">` from both headline layers,
and delete the parallax IIFE from the HTML `<script>`.

---

## Earlier (rename + restructure pass)

### Renamed all classes (HTML + CSS + JS)
| Old | New |
|---|---|
| `.w` | `.container` |
| `.top` / `header.top` | `.site-header` |
| `.logo` | `.brand` |
| `.btn` / `.btn.s` | `.button` / `.button--small` |
| `.hl`, `.l`, `.l.b`, `.l.f` | `.headline`, `.headline__layer`, `.headline__layer--offset`, `.headline__layer--front` |
| `.lede` | `.lead` |
| `.facts` | `.hero-facts` |
| `.cta` | `.hero-cta` |
| `.seats`, `.tube`, `.tube i.e` | `.seat-status`, `.seat-indicators`, `.seat`, `.seat--empty` |
| `.art`, `.paper` | `.hero-art`, `.hero-paper` |
| `#plan`, `.days`, `.day`, `.note` | `#schedule`, `.schedule-grid`, `.schedule-day`, `.schedule-note` |
| `.teach` | `.teacher` |
| `#seat`, `.ticket`, `.main`, `.stub` | `#seat`, `.ticket-card`, `.booking-form`, `.ticket-stub` |
| `.row`, `.err`, `.ok` | `.form-row`, `.form-error`, `.booking-success` |
| `.bar`, `.bar.on` | `.bottom-bar`, `.is-visible` |
| JS state classes `e`, `in`, `torn`, `done`, `on` | `seat--empty`, `is-revealed`, `is-torn`, `is-submitted`, `is-visible` |

### CSS restructuring
- Organized into 12 sections: tokens/theme → reset/general → header → buttons → hero → schedule → teacher → booking/ticket → FAQ → footer → bottom bar → reduced motion
- Converted from CSS nesting to standard descendant selectors (works in all browsers, no build step)
- Added CSS variables (`--color-*`, `--radius-*`, `--max-width`) with dark-mode overrides
- Added `color-mix()` for ticket borders and stub dashed lines
- Added `clamp()`, `env(safe-area-*)`, `inset-inline`, `scroll-behavior: smooth`
- All SVG illustration colors switched to `var(--color-*)` for dark-mode adaptation

**To undo:** This was a full rewrite; restore from the pre-rename backup if available.

---

**Files in this project:**
- `linoWeekendWorkshop.html` — markup + inline JS
- `styles.css` — all styles
- `CHANGELOG.md` — this file