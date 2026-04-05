import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import AccommodationCell from "./AccommodationCell";

export default function AccommodationTableStep({
  days = [],
  cities = [],
  onUpdateDay,
}) {
  const cityMap = useMemo(() => {
    const map = {};
    cities.forEach((c) => (map[c.id] = c.name));
    return map;
  }, [cities]);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">
            Accommodation Planning
          </h3>
          <p className="text-sm text-muted-foreground">
            Add multiple hotel options, room categories, and pricing.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead className="min-w-[120px]">Day</TableHead>
                <TableHead className="min-w-[160px]">City</TableHead>
                <TableHead className="min-w-[140px]">Excursions</TableHead>
                <TableHead className="min-w-[520px]">
                  Accommodation Options
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {days.map((day, idx) => (
                <TableRow key={day.id || day.date} className="align-top">
                  {/* DAY */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{day.date}</span>
                      <span className="text-xs text-muted-foreground">
                        Day {day.day_number || idx + 1}
                      </span>
                    </div>
                  </TableCell>

                  {/* CITY */}
                  <TableCell>
                    {cityMap[day.destination_city_id] || "-"}
                  </TableCell>

                  {/* EXCURSIONS */}
                  <TableCell className="text-xs text-muted-foreground">
                    {(day.excursions || []).length} selected
                  </TableCell>

                  {/* ACCOMMODATION */}
                  <TableCell>
                    <AccommodationCell
                      day={day}
                      onChange={(accommodation) =>
                        onUpdateDay(idx, { accommodation })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}

            {!days.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  No days available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </div >
  );
}