# Codex CLI prompt — Glavzaves (static landing)

You are working in a small repo that is a **single-page static landing**.

## Repo map
- `index.html` — everything (HTML + inline CSS + inline JS)
- `assets/` — images referenced from the page (do not rename/move)

## Goal
Clean up and polish the landing page without changing its core structure or breaking any existing flows. Deliver production-quality HTML/CSS.

## Non‑negotiables (must preserve)
- Keep the site **static**: no frameworks, no build pipeline, no external dependencies.
- Do not break anchors / navigation: keep section ids exactly as they are: `#hero #services #advantages #projects #process #reviews #faq #lead-form #contacts`.
- Do not break the mobile menu toggle behavior. Preserve ids and attributes used by JS:
  - `#menu-toggle` (button)
  - `#mobile-menu` (container)
  - `data-open` attribute logic
- Do not break the form + Telegram flow. Preserve ids and JS wiring:
  - `<form id="quote-form">`
  - `#form-status`
  - Keep opening Telegram via `https://t.me/share/url?...` and the `window.open(url, "_blank", "noopener,noreferrer")` behavior.
- Do not change or remove Telegram links (`https://t.me/+79118097134`), phone links (`tel:+79918097134`), email, or existing asset paths like `./assets/...`.

## Work style
- Prefer **surgical edits** in `index.html`.
- Keep the current design direction (clean, premium, glassy cards), but make it more consistent and conversion-friendly.
- Do not invent facts (guarantees, certifications, years on market) unless already present.

---

## Pass 1 — Production cleanup (correctness + hygiene)
1. Fix HTML validity issues (e.g. duplicated closing tags, invalid nesting). Ensure exactly one closing `</body></html>` pair.
2. Remove duplicated / dead CSS and normalize naming. Replace inline `style="..."` on repeated patterns with CSS classes where reasonable.
3. Ensure accessibility basics:
   - proper heading hierarchy
   - visible focus states
   - reasonable contrast
   - `aria-*` attributes remain correct
4. Keep image `width`/`height` attributes (avoid layout shift).

## Pass 2 — UI polish (layout + hierarchy)
Improve layout, spacing, typography hierarchy, and the visual consistency of:
- cards (services/advantages)
- projects tiles and project copy blocks
- process/steps section
- contacts cards
- footer

Focus on:
- better vertical rhythm between sections
- consistent padding and border-radius usage
- consistent section headings and supporting text

## Pass 3 — Mobile pass (responsive)
1. Review breakpoints: ensure 1-column layout where needed, no overflow.
2. Improve tap targets, spacing, and readability on small screens.
3. Make sure the CTA band and form are comfortable on mobile.

## Pass 4 — Conversion pass (clarity + CTA)
1. Strengthen above-the-fold CTA and supporting microcopy.
2. Make benefits more scannable; clarify what the user gets and next steps.
3. Keep the same Telegram/form flow; do not replace it with server-side submission.

---

## Output
- Make the necessary edits to `index.html` only (unless a very small auxiliary file is absolutely necessary, which is unlikely).
- After changes, provide a brief summary of what you improved and any risks/notes.
