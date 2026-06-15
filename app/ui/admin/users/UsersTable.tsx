import { Avatar, Badge, Group, Table, Text } from "@mantine/core";
import { getAvatarInitial } from "~/lib/utils";
import { YouBadge } from "~/ui/components/common";
import { BanAction } from "./BanAction";
import { UserLockButton } from "./UserLockButton";

export interface AdminUserTableRow {
  id: string;
  name: string;
  email: string;
  /** Server-derived display role ("admin" if on the ADMIN_EMAILS list, else db role). */
  displayRole: string;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  lastLogin: Date | null;
}

interface UsersTableProps {
  users: AdminUserTableRow[];
  currentUserId: string;
  formatDate: (date: Date) => string;
}

export function UsersTable({
  users,
  currentUserId,
  formatDate,
}: UsersTableProps) {
  return (
    <Table
      striped
      highlightOnHover
      withTableBorder
      horizontalSpacing="xs"
      verticalSpacing={4}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Created</Table.Th>
          <Table.Th>Updated</Table.Th>
          <Table.Th>Last Login</Table.Th>
          <Table.Th>Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td>
              <Group gap="xs" wrap="nowrap">
                <Avatar size="sm" radius="md" src={user.image ?? undefined}>
                  {getAvatarInitial(user.name, user.email)}
                </Avatar>
                <Group gap="xs" wrap="nowrap">
                  {user.name}
                  <YouBadge show={user.id === currentUserId} />
                </Group>
              </Group>
            </Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>
              <Badge
                size="xs"
                variant="light"
                color={user.displayRole === "admin" ? "red" : "gray"}
              >
                {user.displayRole}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge
                size="xs"
                variant="light"
                color={user.banned ? "red" : "green"}
              >
                {user.banned ? "Banned" : "Active"}
              </Badge>
            </Table.Td>
            <Table.Td>{formatDate(user.createdAt)}</Table.Td>
            <Table.Td>{formatDate(user.updatedAt)}</Table.Td>
            <Table.Td>
              {user.lastLogin ? formatDate(user.lastLogin) : "-"}
            </Table.Td>
            <Table.Td>
              {user.id === currentUserId ? (
                <UserLockButton
                  locked={user.banned}
                  disabled
                  title="You cannot ban yourself"
                />
              ) : (
                <BanAction user={user} />
              )}
            </Table.Td>
          </Table.Tr>
        ))}
        {users.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={8}>
              <Text size="xs" c="dimmed" ta="center" py="lg">
                No users found.
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
