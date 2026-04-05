import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";


import {
  fetchHotels,
} from "../../../../app/slices/hotelSlice";



import AccommodationCell from "./AccommodationCell";

export default function AccommodationTableStep({
  days = [],
  cities = [],
  onUpdateDay,
}) {
  const dispatch = useDispatch();

  const { items: hotels, loading } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotels({ page: 1, limit: 50 }));
  }, [dispatch]);

  const cityMap = useMemo(() => {
    const map = {};
    cities.forEach((c) => {
      map[c.id] = c.name || c.city || "-";
    });
    return map;
  }, [cities]);

  const normalizedHotels = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    roomCategories: h.room_categories || [],
  }));

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">
            Accommodation Planning
          </h3>
          <p className="text-sm text-muted-foreground">
            Add multiple hotels, room categories, and pricing for each day.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead className="min-w-[240px]">Day Info</TableHead>
                <TableHead className="min-w-[820px]">
                  Accommodation Options
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {days.map((day, idx) => (
                <TableRow key={day.id || day.date || idx} className="align-top">
                  {/* MERGED INFO COLUMN */}
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {day.date || "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Day {day.day_number || idx + 1}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">City:</span>{" "}
                        <span className="text-muted-foreground">
                          {cityMap[day.destination_city_id] || "-"}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Excursions:</span>{" "}
                        <span className="text-muted-foreground">
                          {(day.excursions || []).length} selected
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* ACCOMMODATION */}
                  <TableCell>
                    <AccommodationCell
                      day={day}
                      hotels={normalizedHotels}
                      onChange={(accommodation) =>
                        onUpdateDay(idx, { accommodation })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}

              {!days.length && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-10">
                    No days available
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