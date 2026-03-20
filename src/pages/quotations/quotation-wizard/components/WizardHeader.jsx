import React from "react";
import SummaryBadge from "./SummaryBadge";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function WizardHeader({
  daysCount,
  totalExcursions,
  totalDescriptions,
}) {
  return (
    <CardHeader className="border-b bg-card/80">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Quotation Builder
          </CardTitle>
          <CardDescription className="text-sm">
            Build the schedule, itinerary, and notes for this quotation.
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <SummaryBadge>
            {daysCount || 0} {daysCount === 1 ? "day" : "days"}
          </SummaryBadge>

          <SummaryBadge>
            {totalExcursions} excursion{totalExcursions === 1 ? "" : "s"}
          </SummaryBadge>

          <SummaryBadge>
            {totalDescriptions} description
            {totalDescriptions === 1 ? "" : "s"}
          </SummaryBadge>
        </div>
      </div>
    </CardHeader>
  );
}