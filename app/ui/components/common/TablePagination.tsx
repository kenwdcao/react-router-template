import { Group, NumberInput, Pagination, Select, Text } from "@mantine/core";
import styles from "./TablePagination.module.css";

export interface TablePaginationProps {
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalCount: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange: (pageSize: string) => void;
  /** Available page size options */
  pageSizeOptions?: string[];
  /** Label for the items (e.g., "users", "items") */
  itemLabel?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = ["10", "20", "30", "40", "50", "100"];

export function TablePagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  itemLabel = "items",
}: TablePaginationProps) {
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <Group
      justify="space-between"
      align="center"
      p="md"
      className="flex-wrap gap-y-2 border-t border-(--mantine-color-default-border)"
    >
      <Group gap="sm">
        <Text size="sm" c="dimmed" className="hidden sm:block">
          Showing {startItem}-{endItem} of {totalCount} {itemLabel}
        </Text>
        <Select
          size="xs"
          value={String(pageSize)}
          onChange={(value) => value && onPageSizeChange(value)}
          data={pageSizeOptions}
          classNames={{
            input: styles.pageSizeInput,
            option: styles.pageSizeOption,
          }}
          aria-label="Items per page"
        />
        <Text size="sm" c="dimmed" className="hidden sm:block">
          per page
        </Text>
      </Group>
      <Group gap="sm">
        <Pagination
          value={page}
          onChange={onPageChange}
          total={totalPages}
          size="sm"
          siblings={1}
          boundaries={1}
        />
        <Group gap={4} className="hidden md:flex">
          <Text size="sm" c="dimmed">
            Go to
          </Text>
          <NumberInput
            size="xs"
            min={1}
            max={totalPages}
            value={page}
            onChange={(value) => {
              if (
                typeof value === "number" &&
                value >= 1 &&
                value <= totalPages
              ) {
                onPageChange(value);
              }
            }}
            classNames={{ input: styles.gotoInput }}
            aria-label="Go to page"
          />
          <Text size="sm" c="dimmed">
            page
          </Text>
        </Group>
      </Group>
    </Group>
  );
}
