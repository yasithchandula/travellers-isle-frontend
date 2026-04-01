import React from "react";
import { Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "../EmptyState";

export default function DriveYearGrid({ items, onOpenYear }) {
  if (!items?.length) {
    return (
      <EmptyState
        title="No year folders"
        description="No quotation folders are available yet."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((yearNode) => {
        const totalQuotes = yearNode.months.reduce(
          (sum, month) => sum + month.quotations.length,
          0
        );

        return (
          <button
            key={yearNode.year}
            type="button"
            onClick={() => onOpenYear(yearNode.year)}
            className="text-left"
          >
            <Card className="rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-2xl border bg-sky-50 p-3">
                    <Folder className="h-6 w-6 text-sky-600" />
                  </div>
                  <Badge variant="secondary" className="rounded-md">
                    {yearNode.months.length} months
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-semibold">{yearNode.year}</div>
                  <div className="text-sm text-muted-foreground">
                    {totalQuotes} quotation{totalQuotes === 1 ? "" : "s"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}