import React from "react";
import { Folder, FolderOpen, Home, PanelLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DriveSidebar({ tree, drivePath, openDriveRoot, openDriveYear, openDriveMonth }) {
  return (
    <Card className="h-fit rounded-2xl border shadow-sm xl:sticky xl:top-6">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <PanelLeft className="h-4 w-4" />
          Drive Navigation
        </CardTitle>
        <CardDescription>
          Folder-first quotation browsing, similar to Google Drive.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3">
        <div className="space-y-2">
          <button
            type="button"
            onClick={openDriveRoot}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition",
              !drivePath.year
                ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                : "hover:bg-muted/50"
            )}
          >
            <Home className="h-4 w-4" />
            My Quotations
          </button>

          {tree.map((yearNode) => {
            const isActiveYear = String(drivePath.year) === String(yearNode.year);

            return (
              <div key={yearNode.year} className="rounded-xl border bg-background">
                <button
                  type="button"
                  onClick={() => openDriveYear(yearNode.year)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 text-left transition",
                    isActiveYear ? "bg-sky-50 text-sky-700" : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-sky-600" />
                    <span className="font-medium">{yearNode.year}</span>
                  </div>
                  <Badge variant="secondary" className="rounded-md">
                    {yearNode.total || 0}
                  </Badge>
                </button>

                {isActiveYear && (
                  <div className="space-y-1 border-t bg-muted/15 p-2">
                    {yearNode.months.map((monthNode) => {
                      const activeMonth = drivePath.monthKey === monthNode.key;

                      return (
                        <button
                          key={monthNode.key}
                          type="button"
                          onClick={() => openDriveMonth(yearNode.year, monthNode.key)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition",
                            activeMonth
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "hover:bg-background"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">{monthNode.month}</span>
                          </div>
                          <Badge variant="outline" className="rounded-md">
                            {monthNode.quotations.length}
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