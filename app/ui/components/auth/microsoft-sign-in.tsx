import { Button } from "@mantine/core";
import { MicrosoftLogo } from "./microsoft-logo";

type MicrosoftSignInButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export function MicrosoftSignInButton({
  loading,
  onClick,
}: MicrosoftSignInButtonProps) {
  return (
    <Button
      variant="outline"
      fullWidth
      onClick={onClick}
      loading={loading}
      leftSection={<MicrosoftLogo />}
    >
      Sign in with Microsoft
    </Button>
  );
}
