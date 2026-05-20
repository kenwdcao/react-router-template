export const PROJECT_STATUS = {
  active: "active",
  archived: "archived",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export type ProjectSummary = {
  createdAt: Date | string;
  description: string | null;
  id: string;
  name: string;
  status: string;
  updatedAt: Date | string;
};
