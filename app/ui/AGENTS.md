# UI Instructions

This directory contains shared presentational components, theme helpers, and UI-specific tests.

## Component Boundaries

- Keep components focused on rendering and interaction. Move data loading, authentication, persistence, and route action logic to `app/routes` or `app/lib`.
- Prefer small components with explicit props over large components that infer behavior from global state.
- Reuse existing theme helpers from `app/ui/theme` and shared utilities from `app/lib` before adding new styling abstractions.
- Components that are specific to one route can stay near that route. Move them into `app/ui` only when they are reusable or part of the shared design system.

## Barrel Exports

- Each component folder must expose its public API through an `index.ts` barrel file. Import components via the folder path, e.g. `~/ui/components/common`, not from individual files.
- Keep barrel files thin: only re-export public symbols. Do not add runtime logic or side effects in `index.ts`.
- When adding a new component to an existing folder, update the folder's `index.ts` so the new export is discoverable through the barrel.

## Mantine And Styling

- Prefer Mantine components for interactive UI: buttons, inputs, selects, menus, modals, notifications, layout primitives, and theme-aware states.
- Use Mantine props for component variants, colors, spacing, radius, loading, and disabled states when the component supports them.
- Use CSS modules for custom component styling that cannot be expressed cleanly with Mantine props.
- Use Tailwind classes for page-level layout wrappers and simple composition. Avoid mixing Tailwind deeply into reusable component internals unless it is the clearest local pattern.
- Do not use inline styles.
- CSS custom properties passed through the `style` prop are allowed only for truly dynamic values. Keep the styling logic in a CSS module and pass only the variable value, for example `style={{ "--swatch": color }}` with `background: var(--swatch)` in the CSS module.
- Browser-native `alert`, `confirm`, and `prompt` are forbidden for product UI flows. Use Mantine `Modal`, `Dialog`, or an equivalent app-level confirmation pattern instead.
- Prefer shared theme customization in `app/ui/theme` for cross-app Mantine primitive styling. Use local component overrides only for intentional one-off behavior.
- Keep similar UI elements at the same abstraction level. Do not mix raw Mantine controls with wrapped domain controls in the same action group unless the distinction is intentional and clear.

## Icons And Accessibility

- Use icons from `lucide-react`.
- Add icons inside buttons through Mantine slots such as `leftSection` or `rightSection` when text is present.
- Icon-only buttons must have `aria-label`.
- Disclosure and toggle buttons that control hidden content should expose `aria-expanded` when applicable.
- Form controls need visible labels whenever practical. Use `aria-label` only when a visible label would be redundant or visually inappropriate.
- Preserve keyboard access, focus states, semantic headings, and meaningful button text.

## State And Forms

- Keep local component state minimal and derived where possible.
- Use React Router `useFetcher` for shared UI components that perform inline mutations without route navigation.
- Use controlled inputs only when the component needs immediate local state. Prefer native form submission and default values for route-backed forms.
- Reflect pending states with Mantine `loading`, `disabled`, skeleton, or progress components instead of custom ad hoc indicators.

## Testing

- Put component tests next to the component when the behavior is local to that component.
- Test user-visible behavior and accessibility-relevant output.
- Use stable labels, roles, and visible text in tests instead of implementation details.
