import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Hotel,
  UserCheck,
  Plus,
  Copy,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import AccommodationHotelCard from "./AccommodationHotelCard";

/** =========================
 * HELPERS
 ========================== */
const createEmptyOption = (dayId, index) => ({
  option_name: `Option ${index + 1}`,
  option_index: index,
  itinerary_day_id: dayId,
  hotel_id: null,
  hotel_name_override: "",
  meal_plan: "BB",
  notes: "",
  rooms: [],
});

export default function AccommodationCell({
  day,
  hotels = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);

  /** GLOBAL STATE */
  const [isCustomerBooked, setIsCustomerBooked] = useState(
    day.is_customer_booked || false
  );

  /** OPTIONS */
  const [options, setOptions] = useState(
    day.accommodation_options?.length
      ? day.accommodation_options
      : [createEmptyOption(day.id, 0)]
  );

  const [initial, setInitial] = useState(
    JSON.stringify(options)
  );

  /** SYNC */
  useEffect(() => {
    const opts =
      day.accommodation_options?.length
        ? day.accommodation_options
        : [createEmptyOption(day.id, 0)];

    setOptions(opts);
    setInitial(JSON.stringify(opts));
    setIsCustomerBooked(day.is_customer_booked || false);
  }, [day]);

  /** =========================
   * UPDATE OPTION
   ========================== */
  const updateOption = (index, patch) => {
    const next = [...options];
    next[index] = {
      ...next[index],
      ...patch,
      itinerary_day_id: day.id,
    };
    setOptions(next);
  };

  /** =========================
   * ADD OPTION
   ========================== */
  const addOption = () => {
    const next = [
      ...options,
      createEmptyOption(day.id, options.length),
    ];
    setOptions(next);
  };

  /** =========================
   * DUPLICATE OPTION
   ========================== */
  const duplicateOption = (index) => {
    const clone = {
      ...options[index],
      option_name: `Option ${options.length + 1}`,
    };

    const next = [...options];
    next.splice(index + 1, 0, clone);

    setOptions(next);
  };

  /** =========================
   * DELETE OPTION
   ========================== */
  const deleteOption = (index) => {
    if (options.length === 1) return;

    const next = options.filter((_, i) => i !== index);

    const normalized = next.map((opt, i) => ({
      ...opt,
      option_name: `Option ${i + 1}`,
      option_index: i,
    }));

    setOptions(normalized);
  };

  /** =========================
   * RESET OPTION
   ========================== */
  const resetOption = (index) => {
    const parsed = JSON.parse(initial);
    const next = [...options];
    next[index] =
      parsed[index] || createEmptyOption(day.id, index);
    setOptions(next);
  };

  /** =========================
   * SAVE
   ========================== */
  const handleSave = () => {
    onChange({
      is_customer_booked: isCustomerBooked,
      accommodation_options: options,
    });

    setInitial(JSON.stringify(options));
  };

  /** =========================
   * DIRTY CHECK
   ========================== */
  const isDirty = useMemo(() => {
    return JSON.stringify(options) !== initial;
  }, [options, initial]);

  /** =========================
   * UI
   ========================== */
  return (
    <div className="space-y-3 min-w-[500px]">
      {/* ================= HEADER ================= */}
      <Card className="rounded-2xl border bg-background shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                  isCustomerBooked
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/5 text-primary"
                }`}
              >
                {isCustomerBooked ? (
                  <UserCheck className="h-5 w-5" />
                ) : (
                  <Hotel className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Accommodation Options
                </p>

                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="rounded-full">
                    {options.length} Options
                  </Badge>

                  {isCustomerBooked && (
                    <Badge className="rounded-full">
                      Customer Booked
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* GLOBAL SWITCH */}
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-muted/30">
                <Switch
                  checked={isCustomerBooked}
                  onCheckedChange={(v) => {
                    setIsCustomerBooked(v);

                    if (v) {
                      // 🔥 clear all + collapse
                      setOptions([
                        createEmptyOption(day.id, 0),
                      ]);
                      setOpen(false);
                    }
                  }}
                />
                <span className="text-xs font-medium">
                  Booked by Customer
                </span>
              </div>

              {/* ADD */}
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={addOption}
                disabled={isCustomerBooked}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>

              {/* EXPAND */}
              <Button
                size="sm"
                variant="ghost"
                disabled={isCustomerBooked}
                onClick={() => setOpen((p) => !p)}
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

          <Separator />
        </CardContent>
      </Card>

      {/* ================= OPTIONS ================= */}
      {open && !isCustomerBooked && (
        <div className="flex gap-4 overflow-x-auto pb-3">
          {options.map((opt, index) => (
            <div
              key={index}
              className="min-w-[420px] space-y-3 group"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full px-2 py-0.5 text-xs"
                  >
                    {opt.option_name}
                  </Badge>

                  {index === 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      Default
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => duplicateOption(index)}
                    disabled={isCustomerBooked}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => resetOption(index)}
                  >
                    Reset
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                    onClick={() => deleteOption(index)}
                    disabled={options.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* CARD */}
              <div className="rounded-2xl border bg-background shadow-sm hover:shadow-md transition">
                <div className="p-3">
                  <AccommodationHotelCard
                    value={opt}
                    hotels={hotels}
                    disabled={isCustomerBooked}
                    onChange={(patch) =>
                      updateOption(index, patch)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= SAVE BAR ================= */}
      {open && !isCustomerBooked && (
        <div className="flex items-center justify-between border rounded-xl px-3 py-2 bg-muted/30">
          <div className="text-xs text-muted-foreground">
            {isDirty ? "Unsaved changes" : "All changes saved"}
          </div>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save All
          </Button>
        </div>
      )}
    </div>
  );
}