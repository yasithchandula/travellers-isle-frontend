import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Button } from "../../../../components/ui/button";
import { Copy, Save } from "lucide-react";

import { fetchHotels } from "../../../../app/slices/hotelSlice";
import { bulkSaveQuotationOptions, fetchQuotationOptions } from "../../../../app/slices/quotationSlice";

import AccommodationCell from "./AccommodationCell";

export default function AccommodationTableStep({
  days = [],
  cities = [],
  quotationShell,
  onUpdateDay,
}) {
  const dispatch = useDispatch();

  const [globalOptions, setGlobalOptions] = useState([
    { option_name: "Option 1", option_index: 0 },
  ]);

  const { items: hotels } = useSelector((state) => state.hotels);
  const { options: apiOptions } = useSelector((state) => state.quotations);

  useEffect(() => {
    if (!apiOptions?.length || !days?.length) return;

    const updatedDays = days.map((day) => {
      const accommodation = [];

      apiOptions.forEach((opt) => {
        const foundDay = opt.days?.find(
          (d) =>
            Number(d.itinerary_day_id) === Number(day.id)
        );

        if (!foundDay) return;

        accommodation[opt.option_index] = {
          option_name: opt.option_name,
          option_index: opt.option_index,
          itinerary_day_id: day.id,

          hotel_id: foundDay.hotel_id || null,
          hotel_name_override:
            foundDay.hotel_name || "",
          meal_plan: foundDay.meal_plan || "BB",
          notes: foundDay.notes || "",
          rooms: foundDay.rooms || [],
        };
      });

      return {
        ...day,
        accommodation,
        is_customer_booked:
          day.is_customer_booked ||
          apiOptions.some((opt) =>
            opt.days?.some(
              (d) =>
                Number(d.itinerary_day_id) === Number(day.id) &&
                d.is_customer_booked
            )
          ),
      };
    });

    updatedDays.forEach((d, i) => {
      onUpdateDay(i, {
        accommodation: d.accommodation,
        is_customer_booked: d.is_customer_booked,
      });
    });
  }, [apiOptions]);

  /** =========================
   * FETCH DATA
   ========================== */
  useEffect(() => {
    dispatch(fetchHotels({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (quotationShell?.id) {
      dispatch(fetchQuotationOptions(quotationShell.id));
    }
  }, [quotationShell?.id, dispatch]);

  /** =========================
   * CITY MAP
   ========================== */
  const cityMap = useMemo(() => {
    const map = {};
    cities.forEach((c) => {
      map[c.id] = c.name || c.city || "-";
    });
    return map;
  }, [cities]);

  /** =========================
   * NORMALIZED HOTELS
   ========================== */
  const normalizedHotels = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    roomCategories: h.room_categories || [],
  }));

  /** =========================
   * ADD OPTION COLUMN
   ========================== */
  const addOptionColumn = () => {
    setGlobalOptions((prev) => [
      ...prev,
      {
        option_name: `Option ${prev.length + 1}`,
        option_index: prev.length,
      },
    ]);
  };

  useEffect(() => {
    if (!apiOptions?.length) return;

    const opts = apiOptions.map((opt) => ({
      option_name: opt.option_name,
      option_index: opt.option_index,
    }));

    setGlobalOptions(opts);
  }, [apiOptions]);

  /** =========================
   * COPY OPTION (FIXED)
   ========================== */
  const copyOptionColumn = (fromIndex) => {
    const newIndex = globalOptions.length;

    // 1. Add new column
    setGlobalOptions((prev) => [
      ...prev,
      {
        option_name: `Option ${newIndex + 1}`,
        option_index: newIndex,
      },
    ]);

    // 2. Copy data across all days
    days.forEach((day, i) => {
      const fromOption = day?.accommodation?.[fromIndex];
      if (!fromOption) return;

      const next = [...(day.accommodation || [])];

      next[newIndex] = {
        ...fromOption,
        option_name: `Option ${newIndex + 1}`,
        option_index: newIndex,
      };

      onUpdateDay(i, { accommodation: next });
    });
  };


  const handleSaveOptionColumn = async (optIndex) => {
    if (!quotationShell?.id) return;

    const payload = {
      quotation_id: quotationShell.id,
      option_name: `Option ${optIndex + 1}`,
      option_index: optIndex,
      hotesls: [],
    };

    days.forEach((day) => {
      const option = day?.accommodation?.[optIndex];
      if (!option) return;

      payload.hotesls.push({
        itinerary_day_id: day.id,
        hotel_id: Number(option.hotel_id),
        hotel_name_override: option.hotel_name_override,
        meal_plan: option.meal_plan,
        is_customer_booked: day.is_customer_booked || false,
        notes: option.notes,
        rooms: option.rooms || [],
      });
    });

    if (!payload.hotesls.length) return;

    await dispatch(bulkSaveQuotationOptions(payload));

    dispatch(fetchQuotationOptions(quotationShell.id));
  };

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
            {/* ================= HEADER ================= */}
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead className="min-w-[240px]">
                  Day Info
                </TableHead>

                {globalOptions.map((opt, i) => (
                  <TableHead key={i} className="min-w-[420px]">
                    <div className="flex items-center justify-between">
                      <span>{opt.option_name}</span>

                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyOptionColumn(i)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={() => handleSaveOptionColumn(i)}
                          className="h-9 px-4 gap-2 rounded-lg"
                        >
                          <Save className="h-4 w-4" />
                          Save Option
                        </Button>
                      </div>
                    </div>
                  </TableHead>
                ))}

                <TableHead className="min-w-[200px]">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addOptionColumn}>
                      + Add
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* ================= BODY ================= */}
            <TableBody>
              {days.map((day, idx) => (
                <TableRow
                  key={day.id || day.date || idx}
                  className="align-top"
                >
                  {/* DAY INFO */}
                  <TableCell>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">
                          {day.date || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Day {day.day_number || idx + 1}
                        </p>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">City:</span>{" "}
                        <span className="text-muted-foreground">
                          {cityMap[day.destination_city_id] || "-"}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">
                          Excursions:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {(day.excursions || []).length} selected
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* OPTIONS COLUMNS */}
                  {globalOptions.map((opt, optIndex) => (
                    <TableCell key={optIndex}>
                      <AccommodationCell
                        day={day}
                        optionIndex={optIndex}
                        hotels={normalizedHotels}
                        quotationshell={quotationShell}
                        value={day?.accommodation?.[optIndex]}
                        onChange={(optionData) => {
                          const next = [...(day.accommodation || [])];
                          next[optIndex] = optionData;

                          onUpdateDay(idx, {
                            accommodation: next,
                          });
                        }}
                      />
                    </TableCell>
                  ))}

                  {/* EMPTY CELL FOR ADD COLUMN ALIGNMENT */}
                  <TableCell />
                </TableRow>
              ))}

              {!days.length && (
                <TableRow>
                  <TableCell
                    colSpan={globalOptions.length + 2}
                    className="text-center py-10"
                  >
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