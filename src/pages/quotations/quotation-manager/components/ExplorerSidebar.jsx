import React from "react";
import { CalendarDays, ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ExplorerSidebar({
  tree,
  expandedYears,
  toggleYear,
  totalsByYear,
  selectedMonthKey,
  setSelectedMonthKey,
}) {
  return (
    <Card className="h-fit rounded-2xl border shadow-sm xl:sticky xl:top-6">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <FolderOpen className="h-4 w-4" />
          Timeline Explorer
        </CardTitle>
        <CardDescription>
          Browse quotations by year and month like a folder explorer.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3">
        <div className="space-y-2">
          {tree.map((yearNode) => {
            const isExpanded = !!expandedYears[yearNode.year];

            return (
              <div key={yearNode.year} className="overflow-hidden rounded-xl border bg-background">
                <button
                  type="button"
                  onClick={() => toggleYear(yearNode.year)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Folder className="h-4 w-4 text-sky-600" />
                    <span className="font-medium">{yearNode.year}</span>
                  </div>

                  <Badge variant="secondary" className="rounded-md">
                    {totalsByYear[yearNode.year] || 0}
                  </Badge>
                </button>

                {isExpanded && (
                  <div className="space-y-1 border-t bg-muted/15 p-2">
                    {yearNode.months.map((monthNode) => {
                      const count = monthNode.quotations.length;
                      const isActive = selectedMonthKey === monthNode.key;

                      return (
                        <button
                          key={monthNode.key}
                          type="button"
                          onClick={() => setSelectedMonthKey(monthNode.key)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition",
                            isActive
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "hover:bg-background"
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0" />
                            <span className="truncate text-sm font-medium">{monthNode.month}</span>
                          </div>

                          <Badge
                            variant="outline"
                            className={cn("rounded-md", isActive && "border-primary/30 text-primary")}
                          >
                            {count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}