# UI Instructions

This directory contains shared presentational components, theme helpers, and
UI-specific tests.

## Component Boundaries

- Keep components focused on rendering and interaction. Move data loading,
  authentication, persistence, and route action logic to `app/routes` or
  `app/lib`.
- Prefer small components with explicit props over large components that infer
  behavior from global state.
- Reuse existing theme helpers from `app/ui/theme` and shared utilities from
  `app/lib` before adding new styling abstractions.
- Components that are specific to one route can stay near that route. Move them
  into `app/ui` only when they are reusable or part of the shared design system.

## Mantine And Styling

- Prefer Mantine components for interactive UI: buttons, inputs, selects, menus,
  modals, notifications, layout primitives, and theme-aware states.
- Use Mantine props for component variants, colors, spacing, radius, loading, and
  disabled states when the component supports them.
- Use CSS modules for custom component styling that cannot be expressed cleanly
  with Mantine props.
- Use Tailwind classes for page-level layout wrappers and simple composition.
  Avoid mixing Tailwind deeply into reusable component internals unless it is the
  clearest local pattern.
- Do not use inline styles.

## Icons And Accessibility

- Use icons from `lucide-react`.
- Add icons inside buttons through Mantine slots such as `leftSection` or
  `rightSection` when text is present.
- Icon-only buttons must have `aria-label`.
- Form controls need visible labels whenever practical. Use `aria-label` only
  when a visible label would be redundant or visually inappropriate.
- Preserve keyboard access, focus states, semantic headings, and meaningful
  button text.

## State And Forms

- Keep local component state minimal and derived where possible.
- Use React Router `useFetcher` for shared UI components that perform inline
  mutations without route navigation.
- Use controlled inputs only when the component needs immediate local state.
  Prefer native form submission and default values for route-backed forms.
- Reflect pending states with Mantine `loading`, `disabled`, skeleton, or progress
  components instead of custom ad hoc indicators.

## Testing

- Put component tests next to the component when the behavior is local to that
  component.
- Test user-visible behavior and accessibility-relevant output.
- Use stable labels, roles, and visible text in tests instead of implementation
  details.
