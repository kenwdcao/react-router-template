# UI Instructions

This directory contains shared presentational components, theme helpers, and UI-specific tests.

## Component Boundaries

- Keep components focused on rendering and interaction. Move data loading, authentication, persistence, and route action logic to `app/routes` or `app/lib`.
- Prefer small components with explicit props over large components that infer behavior from global state.
- Reuse existing theme helpers from `app/ui/theme` and shared utilities from `app/lib` before adding new styling abstractions.
- Components that are specific to one route can stay near that route. Move them into `app/ui` only when they are reusable or part of the shared design system.
- Reusable UI belongs under `app/ui/components/`, grouped by route area or feature (for example `auth/`, `dashboard/`, and `common/`).
- `common/` is for truly cross-feature components only. Feature areas must share UI through `common/`, not by importing each other's feature components.

## Barrel Exports

- Each component folder with multiple public components should expose its public API through an `index.ts` barrel file. Import components via the folder path, e.g. `~/ui/components/common`, not from individual files.
- Keep barrel files thin: only re-export public symbols. Do not add runtime logic or side effects in `index.ts`.
- When adding a new reusable component to an existing folder, update the folder's `index.ts` so the new export is discoverable through the barrel.

## Mantine And Styling

- Prefer Mantine components for interactive UI: buttons, inputs, selects, menus, modals, notifications, layout primitives, and theme-aware states.
- Use Mantine props for component variants, colors, spacing, radius, loading, and disabled states when the component supports them.
- Use CSS modules for custom component styling that cannot be expressed cleanly with Mantine props: dense tables, scroll containers, Mantine class overrides, pseudo-elements, and dynamic styles that use CSS custom properties.
- Use Tailwind classes for page-level layout wrappers and simple composition. Avoid mixing Tailwind deeply into reusable component internals unless it is the clearest local pattern.
- Do not use inline styles. The only allowed `style` prop values are CSS custom properties for truly dynamic values, with the actual styling in a CSS module or utility class (for example `style={{ "--swatch": color }}` with `background: var(--swatch)` in the CSS module).
- Browser-native `alert`, `confirm`, and `prompt` are forbidden for product UI flows. Use Mantine `Modal`, `Dialog`, or an equivalent app-level confirmation pattern instead.
- Prefer shared theme customization in `app/ui/theme` for cross-app Mantine primitive styling. Use local component overrides only for intentional one-off behavior.
- Keep similar UI elements at the same abstraction level. Do not mix raw Mantine controls with wrapped domain controls in the same action group unless the distinction is intentional and clear.

## Modal And Drawer Titles

- All Mantine `Modal` and `Drawer` components must use bold titles.
- Use Mantine's `title` prop with a bold style via `fw={700}`, or wrap the title text in a `Text` component with `fw={700}`.
- Consistent bold titles create visual hierarchy and help users quickly identify the purpose of an overlay.

## Icons And Accessibility

- Use icons from `lucide-react`.
- Add icons inside buttons through Mantine slots such as `leftSection` or `rightSection` when text is present.
- Icon-only buttons must have `aria-label`.
- Disclosure and toggle buttons that control hidden content should expose `aria-expanded` when applicable.
- Form controls need visible labels whenever practical. Use `aria-label` only when a visible label would be redundant or visually inappropriate.
- Preserve keyboard access, focus states, semantic headings, and meaningful button text.

## Loading States And Optimistic UI

- Complex or slow operations (multi-step mutations, data processing, background jobs) must not block the UI with a bare loading bar and no other visual feedback.
- Prefer optimistic updates for mutations where the expected outcome is predictable, so the UI reflects the user's intent immediately and rolls back on error.
- Use skeleton screens for initial data loading in content-heavy views (tables, cards, dashboards) to reduce perceived wait time.
- Combine loading indicators with contextual hints: progress messages, step labels, or partial-content renders instead of a single full-page spinner.
- When planning a UI update that involves loading, optimistic updates, or skeleton patterns, proactively discuss the design approach with the user before implementing. Present the trade-offs (for example optimistic rollback complexity versus blocking feedback) so the user can make an informed decision.

## Destructive Action Confirmation Patterns

Sensitive or destructive actions must require explicit user confirmation before proceeding. Choose the confirmation pattern based on the severity of the action.

### Level 1 — Popover Confirmation

Use a `Popover` for actions that are sensitive but have low-to-moderate impact, where an accidental trigger would be annoying but easily recoverable.

- Example: deleting a single record that has no downstream dependencies.
- The popover shows a brief explanation, the item name, and Cancel / Confirm buttons.
- Keep the popover narrow and focused; do not nest complex forms inside it.

### Level 2 — Modal Confirmation

Use a `Modal` for actions with moderate-to-high impact that would cause meaningful data loss or affect multiple records.

- The modal must explain the consequences in plain language, including what is removed and what is preserved.
- Provide a clear Cancel button and a red Confirm button with a destructive icon.
- Modal titles must be bold (`fw={700}`) per the "Modal And Drawer Titles" rule.

### Level 3 — Modal with Typed Confirmation

Use a `Modal` that requires the user to type a specific value (for example a file name or entity identifier) for actions with the highest impact, where recovery is impossible or extremely costly.

- Display the exact text the user must type inside a `Code` block with a copy-to-clipboard action.
- Use a `TextInput` for the confirmation field; disable the Confirm button until the input matches exactly.
- Include a red `Alert` at the top of the modal summarizing the irreversible consequences.
- Reset the confirmation input when the modal closes so the user must re-type on reopen.

### General Rules

- Never use browser-native `alert`, `confirm`, or `prompt` for product confirmation flows.
- Always use `useFetcher` for the actual mutation so the confirmation overlay can stay open during submission and display errors inline.
- Keep the confirmation control at the same abstraction level as the trigger (for example, do not mix a raw `ActionIcon` with a domain-wrapped delete button for the same action).
- After a successful destructive action, close the confirmation overlay and clear any transient confirmation state.

## Display Density

This template targets information-dense internal tools. Maximize display density on data-heavy surfaces (tables, lists, dashboards) rather than defaulting to generous spacing. Marketing and auth pages may keep normal spacing. Apply density per component through explicit Mantine props and CSS modules — do not rely on theme-level density defaults.

### Table density

- Set a table-wide `xs` font via a CSS module so it cascades to every cell, header, and badge: `font-size: var(--mantine-font-size-xs);` (about 12px) on the table root.
- Use tight table padding, applied identically to header and body: `<Table horizontalSpacing="xs" verticalSpacing={4}>`. `verticalSpacing={4}` is roughly half of Mantine's default.
- Lock column widths with `table-layout: fixed` and a `<colgroup>` of fixed pixel widths, plus a `min-width` on the table, to prevent wrapping and auto-expansion.

### Component size props

- Set an explicit small size on every leaf Mantine component: `size="xs"` for `Text`, inputs, selects, and `Badge`; `size="compact-xs"` or `size="compact-sm"` for buttons. Never rely on theme defaults to provide density.
- Keep icons small and matched to the text size: `size={10}` inside badge sections, `size={12}` for `compact-xs` buttons, `size={14}` for `compact-sm` buttons. Avoid icons larger than 14px in dense regions.

### Spacing rhythm

- Use a three-tier gap scale so dense layouts stay legible:
  - `gap={4}` (4px) for intra-cell stacking of tightly related text.
  - `gap={6}` (6px) for toolbar and cluster grouping.
  - `gap="xs"` (about 10px) for cell-to-cell or section-level grouping.
- Apply tight line-height (`lh={1.2}`) on truncated secondary text so fixed column heights hold.

### CSS-module overrides and truncation

- Shrink Mantine internals below their defaults with a CSS module where needed (for example menu items to `min-height: 28px; padding: 6px 8px;`, or filter `<th>` to 4px vertical padding).
- Truncate text at risk of wrapping: `truncate="end"`, `textWrap="nowrap"`, `lineClamp`, and `text-overflow: ellipsis` so fixed column widths hold.
- For dense scroll surfaces, use sticky headers (with a `top` offset that tucks under the app shell) and hide cosmetic scrollbars (`scrollbar-width: none`) where appropriate.

### Legibility and accessibility

- Density must not sacrifice legibility or accessibility. Preserve focus states, ARIA labels, semantic headings, and meaningful button text.
- Maintain reachable hit areas for truly interactive controls; do not shrink touch targets below a usable minimum.

## State And Forms

- Keep local component state minimal and derived where possible.
- Use React Router `useFetcher` for shared UI components that perform inline mutations without route navigation.
- Use controlled inputs only when the component needs immediate local state. Prefer native form submission and default values for route-backed forms.
- Reflect pending states with Mantine `loading`, `disabled`, skeleton, or progress components instead of custom ad hoc indicators.

## Testing

- Put component tests next to the component when the behavior is local to that component.
- Test user-visible behavior and accessibility-relevant output.
- Use stable labels, roles, and visible text in tests instead of implementation details.
