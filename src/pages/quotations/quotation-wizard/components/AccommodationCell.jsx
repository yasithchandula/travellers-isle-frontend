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
  hotels = [],
  quotationshell,
  onChange,
}) {
  const dispatch = useDispatch();
  const { options: apiOptions, loading } = useSelector(
    (state) => state.quotations
  );

  /** =========================
   * QUOTATION ID (SOURCE OF TRUTH)
   ========================== */
  const quotationId = useMemo(
    () => quotationshell?.id || day?.quotation_id,
    [quotationshell?.id, day?.quotation_id]
  );

  const [open, setOpen] = useState(false);
  const [isCustomerBooked, setIsCustomerBooked] = useState(
    day.is_customer_booked || false
  );

  const [options, setOptions] = useState([]);
  const [initialOptions, setInitialOptions] = useState("[]");

  const getRoomTypeFromPax = (pax) => {
    if (Number(pax) === 1) return "Single";
    if (Number(pax) === 2) return "Double";
    if (Number(pax) === 3) return "Triple";
    if (Number(pax) >= 4) return "Family";
    return "";
  };

  const normalizeRoom = (room, hotel) => {
    const categories = hotel?.roomCategories || hotel?.room_categories || [];

    let matchedCategory = null;

    if (room?.room_category_id) {
      matchedCategory = categories.find(
        (c) => String(c.id) === String(room.room_category_id)
      );
    }

    if (!matchedCategory && room?.room_category) {
      matchedCategory = categories.find(
        (c) =>
          String(c.name).trim().toLowerCase() ===
          String(room.room_category).trim().toLowerCase()
      );
    }

    return {
      ...room,
      room_category_id: matchedCategory?.id ?? room?.room_category_id ?? "",
      room_category: matchedCategory?.name ?? room?.room_category ?? "",
      pax: matchedCategory?.pax ?? room?.pax ?? "",
      room_type:
        room?.room_type ||
        getRoomTypeFromPax(matchedCategory?.pax) ||
        "",
      unit_price:
        room?.unit_price ?? matchedCategory?.price ?? 0,
      count: room?.count ?? 1,
      base_price: room?.base_price ?? matchedCategory?.price ?? 0,
    };
  };

  /** =========================
   * SYNC (API + LOCAL)
   ========================== */
  useEffect(() => {
    let opts = [];

    if (apiOptions?.length) {
      // 🔥 ONLY options that contain THIS day
      const relevantOptions = apiOptions.filter((opt) =>
        opt.days?.some(
          (d) => Number(d.itinerary_day_id) === Number(day.id)
        )
      );

      opts = relevantOptions.map((opt, idx) => {
        const foundDay = opt.days.find(
          (d) => Number(d.itinerary_day_id) === Number(day.id)
        );

        const hotelForOption = hotels.find(
          (h) => String(h.id) === String(foundDay?.hotel_id)
        );

        const normalizedRooms = (foundDay?.rooms || []).map((room) =>
          normalizeRoom(room, hotelForOption)
        );

        return {
          option_name: opt.option_name || `Option ${idx + 1}`,
          option_index: idx,
          itinerary_day_id: day.id,

          hotel_id: foundDay?.hotel_id || null,
          hotel_name_override: foundDay?.hotel_name || "",
          meal_plan: foundDay?.meal_plan || "BB",
          notes: foundDay?.notes || "",

          rooms: normalizedRooms,
        };
      });
    }

    // fallback if nothing found
    if (!opts.length) {
      opts = [createEmptyOption(day.id, 0)];
    }

    setOptions(opts);
    setInitialOptions(JSON.stringify(opts));
    setIsCustomerBooked(day.is_customer_booked || false);
  }, [day, apiOptions, hotels]);

  /** =========================
   * UPDATE
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
   * ADD / DUPLICATE / DELETE
   ========================== */
  const addOption = () => {
    setOptions([
      ...options,
      createEmptyOption(day.id, options.length),
    ]);
  };

  const duplicateOption = (index) => {
    const clone = {
      ...options[index],
      option_name: `Option ${options.length + 1}`,
      option_index: options.length,
      itinerary_day_id: day.id,
    };

    const next = [...options];
    next.splice(index + 1, 0, clone);

    const normalized = next.map((opt, i) => ({
      ...opt,
      option_name: `Option ${i + 1}`,
      option_index: i,
    }));

    setOptions(normalized);
  };

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
   * RESET
   ========================== */
  const resetOption = (index) => {
    try {
      const parsed = JSON.parse(initialOptions);
      const next = [...options];
      next[index] =
        parsed[index] || createEmptyOption(day.id, index);
      setOptions(next);
    } catch {
      const next = [...options];
      next[index] = createEmptyOption(day.id, index);
      setOptions(next);
    }
  };

  /** =========================
   * SAVE (PER OPTION)
   ========================== */
  const handleSaveOption = async (index) => {
    const option = options[index];

    const payload = {
      quotation_id: quotationId,
      option_name: option.option_name,
      option_index: option.option_index,
      hotesls: [
        {
          itinerary_day_id: day.id,
          hotel_id: (Number(option.hotel_id)),
          hotel_name_override: option.hotel_name_override,
          meal_plan: option.meal_plan,
          is_customer_booked: isCustomerBooked,
          notes: option.notes,
          rooms: option.rooms || [],
        }
      ],
    };

    await dispatch(bulkSaveQuotationOptions(payload));

    // 🔁 REFETCH
    if (quotationId) {
      dispatch(fetchQuotationOptions(quotationId));
    }

    setInitialOptions(JSON.stringify(options));
  };

  /** =========================
   * DIRTY CHECK
   ========================== */
  const isOptionDirty = (index) => {
    try {
      const parsed = JSON.parse(initialOptions);
      return (
        JSON.stringify(options[index]) !==
        JSON.stringify(parsed[index])
      );
    } catch {
      return true;
    }
  };

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

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-muted/30">
                <Switch
                  checked={isCustomerBooked}
                  onCheckedChange={(v) => {
                    setIsCustomerBooked(v);
                    if (v) {
                      const empty = [createEmptyOption(day.id, 0)];
                      setOptions(empty);
                      setInitialOptions(JSON.stringify(empty));
                      setOpen(false);
                    }
                  }}
                />
                <span className="text-xs font-medium">
                  Booked by Customer
                </span>
              </div>

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

      {/* OPTIONS */}
      {open && !isCustomerBooked && (
        <div className="flex gap-4 overflow-x-auto pb-3">
          {options.map((opt, index) => (
            <div
              key={index}
              className="min-w-[420px] space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="rounded-full px-2 py-0.5 text-xs"
                >
                  {opt.option_name}
                </Badge>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => duplicateOption(index)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => resetOption(index)}
                  >
                    Reset
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border bg-background shadow-sm">
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

              <div className="flex justify-between items-center border rounded-xl px-3 py-2 bg-muted/30">
                <span className="text-xs text-muted-foreground">
                  {isOptionDirty(index)
                    ? "Unsaved changes"
                    : "Saved"}
                </span>

                <Button
                  size="sm"
                  onClick={() => handleSaveOption(index)}
                  disabled={!isOptionDirty(index) || loading}
                >
                  Save
                </Button>
              </div>
              {opt.isEmpty && (
                <Badge variant="secondary" className="text-xs">
                  Not configured
                </Badge>
              )}
            </div>

          ))}
        </div>
      )}


    </div>
  );
}