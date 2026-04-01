import React from "react";
import { ChevronRight, LayoutGrid, Table2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ToolbarToggleButton from "./ToolbarToggleButton";

export default function ExplorerHeader({
  selectedMonthNode,
  filteredExplorerItems,
  explorerInnerView,
  setExplorerInnerView,
}) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md border bg-muted/50 px-2 py-1">
              {selectedMonthNode?.year || "-"}
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="rounded-md border bg-muted/50 px-2 py-1">
              {selectedMonthNode?.month || "No month selected"}
            </span>
          </div>

          <h2 className="text-lg font-semibold tracking-tight">
            {selectedMonthNode?.month} {selectedMonthNode?.year}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredExplorerItems.length} quotation
            {filteredExplorerItems.length === 1 ? "" : "s"} in this folder
          </p>
        </div>

        <div className="inline-flex rounded-xl border bg-muted/30 p-1">
          <ToolbarToggleButton
            active={explorerInnerView === "table"}
            onClick={() => setExplorerInnerView("table")}
            icon={Table2}
            label="Table"
          />
          <ToolbarToggleButton
            active={explorerInnerView === "cards"}
            onClick={() => setExplorerInnerView("cards")}
            icon={LayoutGrid}
            label="Cards"
          />
        </div>
      </CardContent>
    </Card>
  );
}