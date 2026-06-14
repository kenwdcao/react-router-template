import {
  Avatar,
  Button,
  Group,
  Indicator,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { Form, useNavigation } from "react-router";
import { signOut } from "~/lib/auth";
import { getAvatarInitial } from "~/lib/utils";

interface ProfileTabProps {
  user: { name: string; email: string };
  errors?: Record<string, string>;
  success?: string;
  onDismissSuccess: () => void;
}

export function ProfileTab({
  user,
  errors,
  success,
  onDismissSuccess,
}: ProfileTabProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(onDismissSuccess, 3000);
    return () => clearTimeout(timer);
  }, [success, onDismissSuccess]);

  return (
    <Stack gap="md" maw={480}>
      <Group>
        <Indicator
          processing
          position="bottom-end"
          size={14}
          color="green"
          offset={4}
        >
          <Avatar size="lg" radius="xl">
            {getAvatarInitial(user.name, user.email)}
          </Avatar>
        </Indicator>
      </Group>

      {errors?.form ? (
        <Text c="red" size="sm">
          {errors.form}
        </Text>
      ) : null}

      {success === "profile" ? (
        <Text c="green" size="sm">
          Profile updated successfully.
        </Text>
      ) : null}

      <Form method="post" replace>
        <input
          type="hidden"
          name="_intent"
          value="profile"
          aria-label="Update profile intent"
        />
        <Stack gap="sm">
          <TextInput
            name="name"
            label="Name"
            defaultValue={user.name}
            placeholder="Your name"
            maxLength={100}
            error={errors?.name}
          />
          <TextInput
            name="email"
            label="Email"
            defaultValue={user.email}
            disabled
          />
          <Group>
            <Button type="submit" loading={isSubmitting}>
              Save profile
            </Button>
          </Group>
        </Stack>
      </Form>

      <Button
        variant="subtle"
        color="red"
        onClick={async () => {
          await signOut();
          window.location.href = "/";
        }}
      >
        Sign out
      </Button>
    </Stack>
  );
}
