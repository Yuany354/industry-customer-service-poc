# Components, imagery, and states

## Buttons

The source covers filled, outlined, and text buttons in large, medium, and small sizes. It explicitly shows states for default, hover, focus, click/active, and disabled, plus primary, dashed, text, and link treatments.

- Use primary blue fill for the dominant action.
- Keep secondary actions outlined or text/link style.
- Keep button groups to one dominant action.
- Use 8 px radius unless matching a captured component with a different established radius.
- The local MasterGo component snapshot includes a `Button` component sized 76 × 32 with a default variant.

## Tags, navigation, sidebar, lists, fields, selectors

- Tags include basic/status patterns; use compact padding, subdued borders, and semantic color only when status requires it.
- Top navigation supports transparent home treatment, logged-in/logged-out states, and a clear selected-tab effect.
- Sidebars support first-, second-, and third-level navigation plus bordered, underlined, no-icon, icon, and outline tab patterns. Use 8 px spacing where shown and distribute according to item count and available width.
- Lists and tables favor white cards, 16 px outer padding, dense 8/12 px internal gaps, clear headers, subdued metadata, and aligned actions.
- Search/input examples use the same 6 px field radius and light borders. The source copy includes `已根据 已关注 过滤` as a filtered-state example.
- Selectors include single-select, checkbox, and button-selection treatments.

## Dialogs and notifications

Captured notification component:

- width 401 px, height 196 px;
- column layout, 4 px gap;
- padding 20 px vertical and 24 px horizontal;
- 8 px radius and notification shadow;
- title 16/24 px, body 14/22 px;
- close icon 14 × 14 px at black 20%;
- action row has 12 px top padding and 8 px button gap;
- example actions are a small link-style cancel and a small primary confirmation.

Use a modal only for blocking decisions. Use notification/toast patterns for transient feedback and preserve a clear close affordance.

## Cards

- Standard card radius is 6 px.
- Cards may contain service-audience details, product scope, derivatives types, research/articles, case studies, and service capabilities.
- Keep one visual hierarchy: title, summary/metadata, optional tag, then action.
- Avoid decorative shadows when a subtle border or page-background contrast is sufficient.

## Imagery

- Site banner outputs: 1440 × 350 px and 2560 × 350 px.
- Banner safe area height: 290 px.
- Live content: ad popup 341 × 245 px; main live image 317 × 177 px.
- Live main image display radius: 6 px; export the image itself with square corners.
- Keep essential text, logos, and faces inside the safe region. Do not bake controls into image files.

## Empty and exceptional states

Empty-state illustration frame: 260 × 150 px. Supported scenarios include:

- no data, no content, no search results;
- load error, network error, system error, resource not found;
- loading/progress and no permission;
- unsigned investment agreement;
- report suitability not met;
- institution has not purchased a paid report.

Each state needs a concise title, one-line explanation when useful, and at most one primary recovery action.

## Footer

The specification's footer page is a brand-closing composition (`THANKS` / Guotai Junan Futures design-system identification), not a complete production site-footer data model. For a product page, retain the project's existing legal/contact footer. If no footer exists, create a restrained white footer with divider, legal links, contact information, and copyright using auxiliary text tokens.
