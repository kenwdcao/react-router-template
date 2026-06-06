import { navigateBrowserTo } from "~/lib/auth/browser-navigation";
import { authClient } from "~/lib/auth/client";

type StartMicrosoftSignInOptions = {
  errorRoute: "/login" | "/register";
  onError: (message: string) => void;
  onSubmittingChange: (value: boolean) => void;
  redirectTo: string;
};

const MICROSOFT_SIGN_IN_ERROR = "Microsoft sign-in failed. Please try again.";

export async function startMicrosoftSignIn({
  errorRoute,
  onError,
  onSubmittingChange,
  redirectTo,
}: StartMicrosoftSignInOptions) {
  onSubmittingChange(true);

  try {
    const absoluteCallbackURL = new URL(redirectTo, window.location.origin)
      .href;
    const absoluteErrorCallbackURL = new URL(errorRoute, window.location.origin)
      .href;

    const result = await authClient.signIn.social({
      provider: "microsoft",
      callbackURL: absoluteCallbackURL,
      errorCallbackURL: absoluteErrorCallbackURL,
    });

    if (result.error) {
      onSubmittingChange(false);
      onError(MICROSOFT_SIGN_IN_ERROR);
      return;
    }

    if (result.data?.url) {
      navigateBrowserTo(result.data.url);
      return;
    }

    onSubmittingChange(false);
    onError(MICROSOFT_SIGN_IN_ERROR);
  } catch {
    onSubmittingChange(false);
    onError(MICROSOFT_SIGN_IN_ERROR);
  }
}
