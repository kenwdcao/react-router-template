export { getAuthErrorMessage } from "./errors.server";
export { handleLoginAction } from "./login-action.server";
export type { LoginActionData } from "./login-action.server";
export { handleRegisterAction } from "./register-action.server";
export type { RegisterActionData } from "./register-action.server";
export {
  getSession,
  requireAnonymous,
  requireAuth,
} from "./require-auth.server";
export type { AuthSession } from "./require-auth.server";
export { auth, isMicrosoftSSOConfigured } from "./server";
