import { Tabs } from "@mantine/core";
import { AppearanceTab } from "./AppearanceTab";
import { NotificationsTab } from "./NotificationsTab";
import { ProfileTab } from "./ProfileTab";

interface SettingsActionData {
  errors?: Record<string, string>;
}

interface SettingsTabsProps {
  user: { name: string; email: string };
  actionData?: SettingsActionData;
  success?: string;
  onDismissSuccess: () => void;
}

export function SettingsTabs({
  user,
  actionData,
  success,
  onDismissSuccess,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile">
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="appearance">Appearance</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="profile" pt="md">
        <ProfileTab
          user={user}
          errors={actionData?.errors}
          success={success}
          onDismissSuccess={onDismissSuccess}
        />
      </Tabs.Panel>

      <Tabs.Panel value="appearance" pt="md">
        <AppearanceTab />
      </Tabs.Panel>

      <Tabs.Panel value="notifications" pt="md">
        <NotificationsTab />
      </Tabs.Panel>
    </Tabs>
  );
}
