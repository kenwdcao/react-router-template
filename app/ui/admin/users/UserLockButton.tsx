import { ActionIcon, Tooltip, type ActionIconProps } from "@mantine/core";
import { Lock, Unlock } from "lucide-react";

interface UserLockButtonProps extends ActionIconProps {
  locked: boolean;
  title?: string;
  onClick?: () => void;
}

export function UserLockButton({
  locked,
  disabled,
  title,
  onClick,
  ...rest
}: UserLockButtonProps) {
  const icon = locked ? <Unlock size={16} /> : <Lock size={16} />;
  const ariaLabel = locked ? "Unban user" : "Ban user";
  // Green when the action will restore access (locked), red when it will revoke.
  const color = locked ? "green" : "red";

  const button = (
    <ActionIcon
      variant="light"
      aria-label={ariaLabel}
      color={color}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon}
    </ActionIcon>
  );

  if (disabled && title) {
    return (
      <Tooltip label={title} position="top">
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
}
