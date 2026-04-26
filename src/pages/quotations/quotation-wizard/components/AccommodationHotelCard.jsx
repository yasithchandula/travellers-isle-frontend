import React, { useMemo } from "react";
import {
  Building2,
  ClipboardList,
  Hotel,
  MessageSquareText,
  Plus,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import RoomRow from "./RoomRow";

export default function AccommodationHotelCard({
  value = {}, // ✅ SAFE DEFAULT
  hotels = [],
  disabled,
  onChange,
}) {
  /** =========================
   * SAFE VALUE
   ========================== */
  const safeValue = {
    hotel_id: null,
    hotel_name_override: "",
    meal_plan: "BB",
    notes: "",
    rooms: [],
    ...value,
  };

  /** =========================
   * SELECTED HOTEL
   ========================== */
  const selectedHotel = useMemo(() => {
    return hotels.find(
      (h) => String(h.id) === String(safeValue.hotel_id)
    );
  }, [hotels, safeValue.hotel_id]);

  /** =========================
   * UPDATE
   ========================== */
  const update = (patch) => {
    onChange({
      ...safeValue,
      ...patch,
    });
  };

  /** =========================
   * ADD ROOM (SMART DEFAULT)
   ========================== */
  const addRoom = () => {
    const firstCategory = selectedHotel?.roomCategories?.[0];

    update({
      rooms: [
        ...(safeValue.rooms || []),
        {
          room_category_id: firstCategory?.id || "",
          room_category: firstCategory?.name || "",
          room_type: firstCategory?.pax
            ? firstCategory.pax === 1
              ? "Single"
              : firstCategory.pax === 2
              ? "Double"
              : firstCategory.pax === 3
              ? "Triple"
              : "Family"
            : "",
          pax: firstCategory?.pax || "",
          count: 1,
          unit_price: firstCategory?.price || 0,
        },
      ],
    });
  };

  /** =========================
   * TOTAL
   ========================== */
  const total = (safeValue.rooms || []).reduce(
    (sum, r) =>
      sum +
      (Number(r.unit_price) || 0) *
        (Number(r.count) || 0),
    0
  );

  return (
    <Card className="rounded-xl border bg-background shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 space-y-4">

          {/* HEADER */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-primary/5 text-primary">
                <Building2 className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">Hotel</p>
                  <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0">
                    Day
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Hotel, meal, rooms & pricing
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/20 px-3 py-2 text-right">
              <p className="text-[10px] text-muted-foreground">Total</p>
              <p className="text-sm font-semibold">{total}</p>
            </div>
          </div>

          <Separator />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">

            {/* HOTEL */}
            <div className="xl:col-span-5">
              <label className="mb-1 block text-[11px] text-muted-foreground">
                Hotel
              </label>
              <Select
                value={safeValue.hotel_id ? String(safeValue.hotel_id) : ""}
                onValueChange={(v) =>
                  update({
                    hotel_id: v,
                    hotel_name_override:
                      selectedHotel?.name || "",
                    rooms: [], 
                  })
                }
                disabled={disabled}
              >
                <SelectTrigger className="rounded-lg h-9">
                  <SelectValue placeholder="Select hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((h) => (
                    <SelectItem key={h.id} value={String(h.id)}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MEAL */}
            <div className="xl:col-span-3">
              <label className="mb-1 block text-[11px] text-muted-foreground">
                Meal
              </label>
              <Select
                value={safeValue.meal_plan || "BB"}
                onValueChange={(v) => update({ meal_plan: v })}
                disabled={disabled}
              >
                <SelectTrigger className="rounded-lg h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BB">BB</SelectItem>
                  <SelectItem value="HB">HB</SelectItem>
                  <SelectItem value="FB">FB</SelectItem>
                  <SelectItem value="RO">RO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* OVERRIDE */}
            <div className="xl:col-span-4">
              <label className="mb-1 block text-[11px] text-muted-foreground">
                Override
              </label>
              <Input
                placeholder="Custom name"
                value={safeValue.hotel_name_override || ""}
                onChange={(e) =>
                  update({ hotel_name_override: e.target.value })
                }
                className="rounded-lg h-9"
                disabled={disabled}
              />
            </div>
          </div>

          {/* ROOMS */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-3">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold">Rooms</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2 rounded-lg text-xs"
                onClick={addRoom}
                disabled={disabled}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>

            {(safeValue.rooms || []).length === 0 ? (
              <div className="rounded-lg border border-dashed bg-background p-4 text-center">
                <Hotel className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-xs">No rooms added</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(safeValue.rooms || []).map((r, i) => (
                  <RoomRow
                    key={i}
                    value={r}
                    index={i}
                    hotel={selectedHotel}
                    onChange={(updated) => {
                      const next = [...safeValue.rooms];
                      next[i] = updated;
                      update({ rooms: next });
                    }}
                    onRemove={() =>
                      update({
                        rooms: safeValue.rooms.filter((_, idx) => idx !== i),
                      })
                    }
                    onDuplicate={() => {
                      const next = [...safeValue.rooms];
                      next.splice(i + 1, 0, { ...r });
                      update({ rooms: next });
                    }}
                    disabled={disabled}
                  />
                ))}
              </div>
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MessageSquareText className="h-3 w-3" />
              Notes
            </label>
            <Textarea
              placeholder="Notes..."
              value={safeValue.notes || ""}
              onChange={(e) => update({ notes: e.target.value })}
              className="min-h-[70px] rounded-xl text-sm"
              disabled={disabled}
            />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}