import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DayNavigation({
  dayIndex,
  daysLength,
  isSavingDay,
  onPrevDay,
  onNextDay,
}) {
  return (
    <div className="flex flex-col gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <Button
        variant="outline"
        onClick={onPrevDay}
        disabled={dayIndex === 0 || isSavingDay}
        className="min-w-[130px]"
      >
        Prev Day
      </Button>

      <div className="text-sm text-muted-foreground">
        Day {dayIndex + 1} of {daysLength}
      </div>

      <Button
        variant="outline"
        onClick={onNextDay}
        disabled={dayIndex === daysLength - 1 || isSavingDay}
        className="min-w-[130px]"
      >
        {isSavingDay ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        ) : (
          "Next Day"
        )}
      </Button>
    </div>
  );
}