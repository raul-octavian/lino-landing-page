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

### Replaced JS parallax with CSS-only hover parallax
**Files:** `linoWeekendWorkshop.html`, `styles.css`  
**What:** The original implementation used JavaScript to track mouse movement across the hero and drive CSS custom properties `--parallax-x` / `--parallax-y`. CSS cannot read cursor coordinates, so a true "follow the cursor" effect is impossible without JS.

**Decision:** Converted to a CSS-only `:hover`-driven parallax. Layers shift when the cursor enters the hero, retaining the layered depth feel in a no-JS approach.

**Changes:**
- CSS section "5b. Hero parallax" — `.hero:hover .parallax__text`, `.hero:hover .headline__layer--offset .parallax__text`, `.hero:hover .headline__layer--front .parallax__text`, `.hero:hover .hero-art` with `transition: transform 0.3s cubic-bezier(...)`
- Removed the parallax IIFE (mousemove/mouseleave + `--parallax-x`/`--parallax-y` setters) from `<script>`
- Removed `:root { --parallax-x: 0; --parallax-y: 0; }` duplication (var now only in main `:root`, but unused by CSS-only version)
- Removed `document.documentElement.classList.add("js")` — no longer needed since no CSS depends on the `js` class

**Trade-off:** You no longer get cursor-proportional movement. The effect triggers on hover, which is a common CSS-only approximation.

**To undo:** Restore the JS IIFE from git history (`git show HEAD^:linoWeekendWorkshop.html` and `git show HEAD^:styles.css` before the changelog commit) and re-add the `--parallax-*` custom properties to section 5b.

---

### Changed: date from 2026 to 2027
**File:** `linoWeekendWorkshop.html`, line 58  
**What:** Hero facts listed "13–14 March 2026" (in the past).  
**Fix:** Changed to "13–14 March 2027".  
**To undo:** Change `2027` back to `2026` on line 58.

---

### Changed: removed `.hero .hero-paper` from parallax
**File:** `styles.css`  
**What:** The `stamp` animation and parallax both set `transform` on `.hero .hero-paper`, so the parallax was silently overridden by the animation.  
**Fix:** Excluded `.hero .hero-paper` from parallax and replaced with an explanatory comment. Also removed it from the `prefers-reduced-motion` block.  
**To undo:** Re-add the parallax transform rule and the reduced-motion selector entry.

---

### Fixed: duplicate `:root` block
**File:** `styles.css`  
**What:** Section 5b had a second `:root` with `--parallax-x`/`--parallax-y`.  
**Fix:** Moved those two variables into the main `:root` block.  
**To undo:** Re-add the `:root` block above `.hero .parallax__text` in section 5b and remove the two lines from the main `:root`.

---

### Fixed: `.hero .hero-paper` transform conflict
**File:** `styles.css`  
**What:** The `stamp` animation and parallax both set `transform` on `.hero .hero-paper`.  
**Fix:** Removed parallax `translate` from that element and added a comment explaining why.  
**To undo:** Re-add the parallax transform rule to `.hero .hero-paper`.

---

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
- Organized into 12 sections: tokens/theme, reset/general, header, buttons, hero, schedule, teacher, booking/ticket, FAQ, footer, bottom bar, reduced motion
- Converted from CSS nesting to standard descendant selectors (works in all browsers, no build step)
- Added CSS variables (`--color-*`, `--radius-*`, `--max-width`) with dark-mode overrides
- Added `color-mix()` for ticket borders and stub dashed lines
- Added `clamp()`, `env(safe-area-*)`, `inset-inline`, `scroll-behavior: smooth`
- All SVG illustration colors switched to `var(--color-*)` for dark-mode adaptation

**To undo:** This was a full rewrite; restore from the pre-rename backup if available.

---

### New file
- `.gitignore` — covers OS files, IDE files, logs, `node_modules`, build output dirs, environment files, and archives.

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