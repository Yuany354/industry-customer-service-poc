# Foundations

## Color roles

| Role | Value | Usage |
|---|---:|---|
| Brand primary | `#0059EC` | Key buttons, key text, selected states, theme background |
| Brand secondary | `#5795FA` | Secondary buttons and secondary brand text |
| Page background | `#F5F7FA` | Desktop page canvas |
| Category title | `#192646` | Large category headings |
| Tab title | `rgba(0,0,0,.90)` | Strong tab/navigation title |
| Heading | `rgba(0,0,0,.88)` | Standard headings |
| Body | `rgba(0,0,0,.60)` | Main explanatory text |
| Auxiliary | `rgba(0,0,0,.45)` | Metadata and secondary icons |
| Muted icon | `rgba(0,0,0,.25)` | Inactive icons |
| Subtle border | `rgba(0,0,0,.15)` | Scrollbar and tag border |
| Divider | `rgba(0,0,0,.06)` | Dividers and faint borders |
| Error / down | `#EF3432` | Error and negative/trading-down semantics |
| Success / up | `#05B96A` | Success and positive/trading-up semantics |

Documented gradients:

- red: `#FF3E18` to `#FFDBD1`;
- orange: `#FF8600` to `#F4EADF`;
- yellow: `#F7C654` to `rgba(255,223,11,.30)`;
- brand: `#0059EC` to `#76AAFF`;
- success fade: `rgba(5,185,106,.30)` to `rgba(5,185,106,0)`.

## Typography

Use `PingFang SC` and these source-defined roles:

| Size | Weight | Role |
|---:|---|---|
| 32 px | Semibold | Large category title |
| 22 px | Semibold | Module category title |
| 20 px | Regular | Title |
| 16 px | Regular | Body |
| 14 px | Regular | List body |
| 12 px | Regular | Date and supporting text |
| 10 px | Regular | King Kong area category supporting text |

Use comfortable production line heights rather than the specimen table's compact label line-height. Defaults in the supplied tokens are 1.25 for headings, 1.5 for body, and 20/22 px for 12/14 px text where component snapshots show them.

## Spacing and layout

- Baseline viewport: Desktop `1440 × 1024`, 1×, px units.
- Core spacing set: `2, 4, 8, 12, 16, 20, 24, 30, 32, 40, 100` px.
- Full-width list inset: 16 px on all four sides.
- List internals: predominantly multiples of 2; source examples use 8 px and 12 px gaps.
- Sidebar/tab examples use 8 px item spacing and adapt to count and width.
- Prefer 16–24 px card padding and 24–32 px section spacing.

## Shape and elevation

- Card radius: 6 px.
- Dropdown/input/secondary/tertiary menu radius: 6 px.
- Standard button radius: 8 px.
- Notification radius: 8 px.
- Brand elevation: `0 10px 15px rgba(0,89,236,.15)`.
- Notification elevation: `0 1px 2px rgba(0,0,0,.03), 0 1px 6px -1px rgba(0,0,0,.02), 0 2px 4px rgba(0,0,0,.02)`.

## Icons

- King Kong/navigation icon cell: 24 × 24 px; background/container large radius 33 px.
- Normalize the optical content box for differently shaped icons instead of scaling every glyph identically.
- Linear icons use a 1 px rounded stroke, simple lines, and restrained color blocks.
- Source categories include first-level navigation/Tab, second-level navigation/Tab, action icons, business-processing icons, list icons, labels, and ranking icons.
- The MCP icon export is empty. Reuse verified icons from the current codebase and apply these visual rules; never invent a source-specific glyph name.
