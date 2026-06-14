export const PROJECT_STATUS = {
  active: "active",
  archived: "archived",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
