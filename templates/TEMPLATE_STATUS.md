# Template Status

Track progress for each signature template during finalization cycles.

| Template | Figma frame | Name | Status | Notes |
|----------|-------------|------|--------|-------|
| template-1 | Email Signature 2 - Aesthetics (1:2) | Amelia Aesthetics | in-review | Blue logomark |
| template-2 | Email Signature 2 - Headshot (5:2) | Headshot | in-review | Circular headshot |
| template-3 | Email Signature 2 - Medspa (6:243) | Amelia Medspa | in-review | Teal logomark |
| template-4 | Email Signature 2 - Health (6:269) | Amelia Health | in-review | Sage logomark |
| template-5 | Email Signature 2 - HQ (6:255) | Amelia HQ | in-review | Black logomark, Instagram + website |

## Status values

- **draft** — placeholder or initial conversion, not ready for production
- **in-review** — wired in app, under visual/email-client QA
- **finalized** — approved; shown in production template picker

## Assets

Brand logomarks and icons exported from Figma to [`public/assets/signatures/`](../public/assets/signatures/).

## Typography

Templates use **Outfit** (Google Fonts) via `@import` in the copied HTML output, with `'Outfit', Arial, Helvetica, sans-serif` fallbacks on all text elements.

## Review checklist

- [ ] Visual parity with Figma/reference
- [ ] Table layout, inline styles only
- [ ] Dynamic fields render correctly
- [ ] Empty optional fields collapse cleanly
- [ ] Cell icon on cell row, cursor icon on website row
- [ ] Headshot displays at correct size (Headshot template only)
- [ ] Tested in Outlook, Gmail, Apple Mail
