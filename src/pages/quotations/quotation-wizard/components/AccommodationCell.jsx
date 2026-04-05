import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Hotel,
  UserCheck,
  UtensilsCrossed,
  BedDouble,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import AccommodationHotelCard from "./AccommodationHotelCard";

export default function AccommodationCell({
  day,
  hotels = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);

  /** =========================
   * LOCAL STATE (EDIT BUFFER)
   ========================== */
  const [current, setCurrent] = useState(
    day.accommodation || {
      itinerary_day_id: day.id,
      hotel_id: null,
      hotel_name_override: "",
      meal_plan: "BB",
      is_customer_booked: false,
      notes: "",
      rooms: [],
    }
  );

  const [initial, setInitial] = useState(
    JSON.stringify(day.accommodation || {})
  );

  /** Sync when day changes */
  useEffect(() => {
    const acc =
      day.accommodation || {
        itinerary_day_id: day.id,
        hotel_id: null,
        hotel_name_override: "",
        meal_plan: "BB",
        is_customer_booked: false,
        notes: "",
        rooms: [],
      };

    setCurrent(acc);
    setInitial(JSON.stringify(acc));
  }, [day]);

  /** =========================
   * UPDATE HANDLER
   ========================== */
  const update = (patch) => {
    const next = {
      ...current,
      ...patch,
      itinerary_day_id: day.id,
    };
    setCurrent(next);
  };

  /** =========================
   * DIRTY CHECK
   ========================== */
  const isDirty = useMemo(() => {
    return JSON.stringify(current) !== initial;
  }, [current, initial]);

  /** =========================
   * SAVE / RESET
   ========================== */
  const handleSave = () => {
    onChange(current); // send to parent / API
    setInitial(JSON.stringify(current));
  };

  const handleReset = () => {
    const parsed = JSON.parse(initial);
    setCurrent(parsed);
  };

  /** =========================
   * SUMMARY
   ========================== */
  const summary = useMemo(() => {
    const roomCount = (current.rooms || []).reduce(
      (sum, r) => sum + (Number(r.count) || 0),
      0
    );

    const total = (current.rooms || []).reduce(
      (sum, r) =>
        sum + (Number(r.unit_price) || 0) * (Number(r.count) || 0),
      0
    );

    return {
      roomLines: (current.rooms || []).length,
      roomCount,
      total,
    };
  }, [current.rooms]);

  const displayName = current.is_customer_booked
    ? current.hotel_name_override || "Booked by Customer"
    : current.hotel_name_override || "No hotel selected";

  /** =========================
   * UI
   ========================== */
  return (
    <div className="space-y-3 min-w-[460px]">
      <Card className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* LEFT */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    current.is_customer_booked
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/5 text-primary"
                  }`}
                >
                  {current.is_customer_booked ? (
                    <UserCheck className="h-5 w-5" />
                  ) : (
                    <Hotel className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">
                      Accommodation
                    </p>

                    {current.is_customer_booked ? (
                      <Badge variant="secondary" className="rounded-full">
                        Customer Booked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-full">
                        Hotel Managed
                      </Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {current.is_customer_booked
                        ? "Hotel selection is disabled for this day."
                        : "Manage hotel, meal plan, room categories, and pricing."}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2">
                  <Switch
                    checked={current.is_customer_booked}
                    onCheckedChange={(v) =>
                      update({
                        is_customer_booked: v,
                        hotel_id: v ? null : current.hotel_id,
                        rooms: v ? [] : current.rooms,
                      })
                    }
                  />
                  <span className="text-xs font-medium">
                    Booked by Customer
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {open ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* SUMMARY */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span className="text-xs font-medium">Meal Plan</span>
                </div>
                <p className="text-sm font-semibold">
                  {current.meal_plan || "-"}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                  <BedDouble className="h-4 w-4" />
                  <span className="text-xs font-medium">Room Lines</span>
                </div>
                <p className="text-sm font-semibold">
                  {summary.roomLines}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs font-medium">Total</span>
                </div>
                <p className="text-sm font-semibold">
                  {summary.total}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EDIT PANEL */}
      {open && (
        <>
          <AccommodationHotelCard
            value={current}
            hotels={hotels}
            disabled={current.is_customer_booked}
            onChange={update}
          />

          {/* 🔥 SAVE / RESET BAR (UI SAME STYLE) */}
          <div className="flex items-center justify-between border rounded-xl px-3 py-2 bg-muted/30">
            <div className="text-xs text-muted-foreground">
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                disabled={!isDirty}
              >
                Reset
              </Button>

              <Button
                size="sm"
                onClick={handleSave}
                disabled={!isDirty}
              >
                Save
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}