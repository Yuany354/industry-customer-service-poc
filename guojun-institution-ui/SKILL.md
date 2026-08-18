---
name: guojun-institution-ui
description: Use the Guojun institutional one-stop service platform WEB design system when creating, modifying, reviewing, or translating prototypes and frontend pages. Trigger for 国君机构服务平台, 机构一站式服务平台, MasterGo 设计规范, design tokens, UI consistency reviews, or requests involving its colors, typography, icons, spacing, imagery, buttons, tags, navigation, sidebars, lists, inputs, selectors, dialogs, empty states, and footer.
---

# 国君机构服务平台 WEB UI

Use the MasterGo-derived design system in this skill as the source of truth for prototypes and frontend UI. Preserve product consistency before adding visual novelty.

## Workflow

1. Inspect the target repository and reuse its framework, components, icons, and conventions.
2. Read [foundations.md](references/foundations.md) for every page. Also read [components.md](references/components.md) when the task contains controls, cards, navigation, imagery, states, or footer.
3. Use `assets/tokens.css` directly when CSS custom properties fit the project. Use `assets/tokens.json` when generating framework tokens or theme configuration.
4. Design at the 1440 px desktop baseline, then add responsive behavior without changing the hierarchy or token semantics.
5. Prefer existing product components. If none exist, implement the smallest reusable component that expresses the documented states.
6. Check the finished page against the checklist below. For screenshot or live-page work, compare visually at the target viewport.

## Non-negotiable rules

- Use PingFang SC on Chinese UI when available; provide a system sans-serif fallback.
- Use the documented role tokens. Do not introduce a second brand blue, success green, or error red.
- Keep content backgrounds light: page background `#F5F7FA`, cards and controls white unless the source pattern says otherwise.
- Use the 4/8 px rhythm. Prefer the documented spacing set over arbitrary values.
- Use 6 px for cards and standard fields; use 8 px for primary buttons and notifications where documented.
- Use 1 px rounded line icons. Reuse the repository icon library; do not redraw unknown source icons from memory.
- Use red and green only for trading/error/success meaning, not decoration.
- Preserve all interaction states for actionable controls: default, hover, focus, active/click, and disabled.
- Do not modify the MasterGo source unless the user explicitly requests a write-back operation.

## Page construction

Build pages in this order:

1. Global header/navigation and page background.
2. Main content container and page hierarchy.
3. Cards, lists, tables, forms, tags, and actions.
4. Loading, empty, error, permission, and disabled states.
5. Footer when the page belongs to the public/full-site shell.

For financial information, optimize for scanability: align numeric columns, keep labels concise, use subdued metadata, and reserve the brand blue for key actions and selected states.

## Quality gate

Before delivery, verify:

- every color maps to a named token or documented gradient;
- every text style maps to the documented type scale;
- card, input, button, tag, and notification radii match the source pattern;
- list padding is 16 px and internal gaps use documented multiples where applicable;
- icons have consistent 1 px rounded strokes and optical size;
- banners and live imagery respect their safe-area and output-size rules;
- focus, hover, active, disabled, empty, loading, error, and permission states are represented where relevant;
- no raw placeholder icon, random stock image, or unrelated visual language remains;
- the result is usable at 1440 px and degrades cleanly at narrower widths.

## Source fidelity

This skill was extracted from the MasterGo file `国君机构服务平台 WEB UI设计规范`, document `183854742328163`, updated `2026-01-14`. Read [source-map.md](references/source-map.md) when auditing provenance, refreshing the snapshot, or resolving ambiguity. Formal MasterGo variables contain only one white color variable; the richer semantic tokens here are evidence-derived from the specification frames and are intentionally named for frontend use.
