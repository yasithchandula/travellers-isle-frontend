import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FilterBar({
  search,
  onSearchChange,
  tag,
  onTagChange,
  tags = [],
  limit,
  onLimitChange,
  limitOptions = [6, 9, 12, 18],
}) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

      <div className="flex flex-1 flex-col gap-3 md:flex-row">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="h-10 pl-9"
          />
        </div>

        {/* Tags */}
        <select
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Limit */}
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
        >
          {limitOptions.map((value) => (
            <option key={value} value={value}>
              {value} / page
            </option>
          ))}
        </select>

      </div>

    </div>
  );
}
