import { isRouteErrorResponse } from "react-router";

export interface AdminErrorInfo {
  title: string;
  message: string;
  showLoginLink: boolean;
}

/** Map a thrown route error to friendly admin copy (401/403/404/other). */
export function getAdminErrorInfo(
  error: unknown,
  pageName: string,
): AdminErrorInfo {
  let title = `Unable to load ${pageName}`;
  let message = "An unexpected error occurred while loading this page.";
  let showLoginLink = false;

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      title = "Please sign in";
      message = "Your session is not valid. Sign in again to access this page.";
      showLoginLink = true;
    } else if (error.status === 403) {
      title = "Access denied";
      message = `Only administrators can access ${pageName}.`;
    } else if (error.status === 404) {
      title = "Page not found";
      message = `The ${pageName} page does not exist.`;
    }
  }

  return { title, message, showLoginLink };
}
