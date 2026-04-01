import React from "react";
import { FolderOpen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import EmptyState from "../EmptyState";

export default function DriveMonthList({ yearNode, onOpenMonth }) {
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
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">Month Folders</CardTitle>
        <CardDescription>Select a month to view quotation files.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {months.map((monthNode) => (
            <button
              key={monthNode.key}
              type="button"
              onClick={() => onOpenMonth(monthNode.key)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium">{monthNode.month}</div>
                  <div className="text-xs text-muted-foreground">{yearNode.year}</div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {monthNode.quotations.length} file
                {monthNode.quotations.length === 1 ? "" : "s"}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}