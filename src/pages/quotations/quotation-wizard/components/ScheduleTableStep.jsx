import React from "react";
import { Loader2 } from "lucide-react";
import ExcursionSelector from "@/components/ui/excursion-selector";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function ScheduleTableStep({
  days = [],
  cities = [],
  excursions = [],
  isLoadingCities = false,
  onUpdateDay,
  onExcursionSearch,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold">Schedule Overview</h3>
          <p className="text-sm text-muted-foreground">
            Assign cities, excursions, and notes for each day.
          </p>
        </div>

        {isLoadingCities && (
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading cities...
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[130px]">Date</TableHead>
                <TableHead className="min-w-[220px]">City</TableHead>
                <TableHead className="min-w-[320px]">Excursions</TableHead>
                <TableHead className="min-w-[220px]">Note</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {days.map((day, idx) => (
                <TableRow
                  key={day.date}
                  className="align-top transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span>{day.date}</span>
                      <span className="text-xs text-muted-foreground">
                        Day {day.day_number || idx + 1}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={day.destination_city_id || ""}
                      onValueChange={(value) =>
                        onUpdateDay(idx, { destination_city_id: value })
                      }
                    >
                      <SelectTrigger className="w-[220px] bg-background">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>

                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="min-w-[320px]">
                    <ExcursionSelector
                      items={excursions}
                      selected={day.excursions || []}
                      setSelected={(updater) => {
                        const current = day.excursions || [];
                        const next =
                          typeof updater === "function"
                            ? updater(current)
                            : updater;

                        onUpdateDay(idx, { excursions: next });
                      }}
                      onSearch={onExcursionSearch}
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      className="max-w-[260px] bg-background"
                      value={day.note || ""}
                      onChange={(e) =>
                        onUpdateDay(idx, {
                          note: e.target.value,
                        })
                      }
                      placeholder="Add quick note"
                    />
                  </TableCell>
                </TableRow>
              ))}

              {!days.length && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No days available yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}