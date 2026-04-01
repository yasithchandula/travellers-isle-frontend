import React from "react";
import { FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "../EmptyState";

export default function DriveMonthGrid({ yearNode, onOpenMonth }) {
  const months = yearNode?.months || [];

  if (!months.length) {
    return (
      <EmptyState
        title="No month folders"
        description="This year does not contain any quotation months."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {months.map((monthNode) => (
        <button
          key={monthNode.key}
          type="button"
          onClick={() => onOpenMonth(monthNode.key)}
          className="text-left"
        >
          <Card className="rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-2xl border bg-amber-50 p-3">
                  <FolderOpen className="h-6 w-6 text-amber-600" />
                </div>
                <Badge variant="secondary" className="rounded-md">
                  {monthNode.quotations.length} files
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="text-base font-semibold">{monthNode.month}</div>
                <div className="text-sm text-muted-foreground">
                  {yearNode.year} quotation folder
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}