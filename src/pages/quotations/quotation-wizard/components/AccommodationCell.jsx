import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Hotel,
  UserCheck,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuotationOptions,
  bulkSaveQuotationOptions,
} from "@/app/slices/quotationSlice";

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
  optionIndex = 0,
  value,
  hotels = [],
  quotationshell,
  onChange,
}) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.quotations);

  /** =========================
   * QUOTATION ID
   ========================== */
  const quotationId = useMemo(
    () => quotationshell?.id || day?.quotation_id,
    [quotationshell?.id, day?.quotation_id]
  );

  const option = value || createEmptyOption(day.id, optionIndex);

  const [open, setOpen] = useState(false);
  const [isCustomerBooked, setIsCustomerBooked] = useState(
    day?.is_customer_booked || false
  );

  const [initialOption, setInitialOption] = useState(
    JSON.stringify(option)
  );

  const [initialized, setInitialized] = useState(false);


  /** =========================
   * SYNC INITIAL VALUE
   ========================== */
  useEffect(() => {
    if (!initialized) {
      const syncedOption =
        value || createEmptyOption(day.id, optionIndex);

      setInitialOption(JSON.stringify(syncedOption));
      setInitialized(true);
    }
  }, [initialized, value, day.id, optionIndex]);

  /** =========================
   * UPDATE SINGLE OPTION
   ========================== */
  const updateOption = (patch) => {
    const nextOption = {
      ...option,
      ...patch,
      option_name: `Option ${optionIndex + 1}`,
      option_index: optionIndex,
      itinerary_day_id: day.id,
    };

    onChange?.(nextOption);
  };

  /** =========================
   * CUSTOMER BOOKED
   ========================== */
  const handleCustomerBookedChange = (checked) => {
    setIsCustomerBooked(checked);

    if (checked) {
      const empty = createEmptyOption(day.id, optionIndex);
      updateOption(empty);
      setOpen(false);
    }
  };

  /** =========================
   * RESET
   ========================== */
  const resetOption = () => {
    try {
      const parsed = JSON.parse(initialOption);
      updateOption(parsed);
    } catch {
      updateOption(createEmptyOption(day.id, optionIndex));
    }
  };

  /** =========================
   * SAVE
   ========================== */
  const handleSaveOption = async () => {
    const payload = {
      quotation_id: quotationId,
      option_name: option.option_name || `Option ${optionIndex + 1}`,
      option_index: optionIndex,

      // keep same key as your existing API payload
      hotesls: [
        {
          itinerary_day_id: day.id,
          hotel_id: Number(option.hotel_id),
          hotel_name_override: option.hotel_name_override,
          meal_plan: option.meal_plan,
          is_customer_booked: isCustomerBooked,
          notes: option.notes,
          rooms: option.rooms || [],
        },
      ],
    };

    await dispatch(bulkSaveQuotationOptions(payload));

    if (quotationId) {
      dispatch(fetchQuotationOptions(quotationId));
    }

    setInitialOption(JSON.stringify(option));
  };

  /** =========================
   * DIRTY CHECK
   ========================== */
  const isDirty = JSON.stringify(option) !== initialOption;

  return (
    <div className="space-y-3 min-w-[500px]">
      {/* HEADER */}
      <Card className="rounded-2xl border bg-background shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isCustomerBooked
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
                    {option.option_name || `Option ${optionIndex + 1}`}
                  </Badge>

                  {isCustomerBooked && (
                    <Badge className="rounded-full">
                      Customer Booked
                    </Badge>
                  )}

                  {isDirty && !isCustomerBooked && (
                    <Badge variant="outline" className="rounded-full">
                      Unsaved
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-muted/30">
                <Switch
                  checked={isCustomerBooked}
                  onCheckedChange={handleCustomerBookedChange}
                />
                <span className="text-xs font-medium">
                  Booked by Customer
                </span>
              </div>

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

      {/* OPTION CONTENT */}
      {open && !isCustomerBooked && (
        <div className="min-w-[420px] space-y-3 group">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0.5 text-xs"
            >
              {option.option_name || `Option ${optionIndex + 1}`}
            </Badge>

            <Button
              size="sm"
              variant="ghost"
              onClick={resetOption}
            >
              Reset
            </Button>
          </div>

          <div className="rounded-2xl border bg-background shadow-sm">
            <div className="p-3">
              <AccommodationHotelCard
                value={option}
                hotels={hotels}
                disabled={isCustomerBooked}
                onChange={updateOption}
              />
            </div>
          </div>

          <div className="flex justify-between items-center border rounded-xl px-3 py-2 bg-muted/30">
            <span className="text-xs text-muted-foreground">
              {isDirty ? "Unsaved changes" : "Saved"}
            </span>

            <Button
              size="sm"
              onClick={handleSaveOption}
              disabled={!isDirty || loading}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}