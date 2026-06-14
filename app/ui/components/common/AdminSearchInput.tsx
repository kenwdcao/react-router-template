import { TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router";

interface AdminSearchInputProps {
  placeholder: string;
}

/**
 * Search box that writes `?search=` to the URL on every keystroke (replacing
 * history) and resets `page=1`. The route loader re-runs on the URL change and
 * filters server-side.
 */
export function AdminSearchInput({ placeholder }: AdminSearchInputProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get("search") ?? "";

  return (
    <TextInput
      placeholder={placeholder}
      aria-label="Search"
      value={value}
      onChange={(event) => {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            const term = event.currentTarget.value.trim();
            if (term) next.set("search", term);
            else next.delete("search");
            next.set("page", "1");
            return next;
          },
          { replace: true },
        );
      }}
      leftSection={<Search size={16} />}
      className="w-full sm:w-72"
    />
  );
}
