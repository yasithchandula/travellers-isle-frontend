import React from "react";
import { Folder } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import EmptyState from "../EmptyState";

export default function DriveYearList({ items, onOpenYear }) {
  if (!items?.length) {
    return (
      <EmptyState
        title="No year folders"
        description="No quotation folders are available yet."
      />
    );
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">Year Folders</CardTitle>
        <CardDescription>Open a year folder to view month folders.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
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
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-sky-600" />
                  <div>
                    <div className="font-medium">{yearNode.year}</div>
                    <div className="text-xs text-muted-foreground">
                      {yearNode.months.length} months
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {totalQuotes} quotation{totalQuotes === 1 ? "" : "s"}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}