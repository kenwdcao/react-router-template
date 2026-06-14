/**
 * Suggested prompts shown in the FAQ dropdown above the chat input. Kept in a
 * plain module (not the component file) so React Fast Refresh stays happy and
 * both the FAQ menu and the empty state can share one source of truth.
 */
export const suggestedPrompts: string[] = [
  "What's in this template?",
  "How do I add a new route?",
  "How is auth set up?",
  "How do I create a new project using this template?",
  "How do I migrate my existing React Router v7 app to this template?",
];
