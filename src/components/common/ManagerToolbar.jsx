import { Search, Grid3X3, List, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InlineLoading } from "@/components/common/LoadingStates";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function ManagerToolbar({
  title = "Browse items",
  description = "",
  search,
  onSearchChange,
  tagFilter = "all",
  onTagChange,
  tags = [],
  limit = 10,
  onLimitChange,
  limitOptions = [10, 20, 50],
  view = "card",
  setView,
  loading = false,
  resultCount = 0,
}) {
  return (
    <Card>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-5 pt-0">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="h-10 pl-9"
              />
            </div>

            {/* TAG FILTER */}
            {tags.length > 0 && (
              <select
                value={tagFilter}
                onChange={(e) => onTagChange(e.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-1 focus:ring-ring"
              >
                <option value="all">All tags</option>

                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            )}

            {/* LIMIT */}
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-1 focus:ring-ring"
            >
              {limitOptions.map((value) => (
                <option key={value} value={value}>
                  {value} / page
                </option>
              ))}
            </select>
          </div>

          {/* VIEW SWITCH */}
          {setView && (
            <div className="inline-flex rounded-lg border bg-muted/40 p-1">
              <Button
                variant={view === "card" ? "default" : "ghost"}
                size="sm"
                className="rounded-md"
                onClick={() => setView("card")}
              >
                <Grid3X3 className="mr-2 h-4 w-4" />
                Cards
              </Button>

              <Button
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                className="rounded-md"
                onClick={() => setView("table")}
              >
                <List className="mr-2 h-4 w-4" />
                Table
              </Button>
            </div>
          )}
        </div>

        {/* RESULT INFO */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {loading ? (
              <InlineLoading label="Updating results" />
            ) : (
              `${resultCount} results`
            )}
          </span>

          {tagFilter !== "all" && (
            <Badge variant="secondary" className="rounded-full">
              <Tag className="mr-1 h-3 w-3" />
              {tagFilter}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
