import React from "react";
import { ArrowLeft, ChevronRight, Grid3X3, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ToolbarToggleButton from "./ToolbarToggleButton";

export default function DriveHeader({
  drivePath,
  driveMonthNode,
  driveYearNode,
  filteredDriveMonthItems,
  openDriveRoot,
  openDriveYear,
  goDriveBack,
  driveInnerView,
  setDriveInnerView,
}) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={openDriveRoot}
                className="rounded-md border bg-muted/50 px-2 py-1 hover:bg-muted"
              >
                My Quotations
              </button>

              {drivePath.year && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <button
                    type="button"
                    onClick={() => openDriveYear(drivePath.year)}
                    className="rounded-md border bg-muted/50 px-2 py-1 hover:bg-muted"
                  >
                    {drivePath.year}
                  </button>
                </>
              )}

              {driveMonthNode && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="rounded-md border bg-muted/50 px-2 py-1">
                    {driveMonthNode.month}
                  </span>
                </>
              )}
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              {!drivePath.year
                ? "All quotation folders"
                : driveMonthNode
                ? `${driveMonthNode.month} ${driveMonthNode.year}`
                : `${drivePath.year} folders`}
            </h2>

            <p className="text-sm text-muted-foreground">
              {!drivePath.year
                ? "Open a year folder to view months."
                : driveMonthNode
                ? `${filteredDriveMonthItems.length} quotation${filteredDriveMonthItems.length === 1 ? "" : "s"} inside this month`
                : `${driveYearNode?.months?.length || 0} month folder${(driveYearNode?.months?.length || 0) === 1 ? "" : "s"} available`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={goDriveBack}
              disabled={!drivePath.year && !drivePath.monthKey}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="inline-flex rounded-xl border bg-muted/30 p-1">
              <ToolbarToggleButton
                active={driveInnerView === "grid"}
                onClick={() => setDriveInnerView("grid")}
                icon={Grid3X3}
                label="Grid"
              />
              <ToolbarToggleButton
                active={driveInnerView === "list"}
                onClick={() => setDriveInnerView("list")}
                icon={Rows3}
                label="List"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}