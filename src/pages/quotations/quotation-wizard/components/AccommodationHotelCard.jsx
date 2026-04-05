import React from "react";
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
  value,
  hotels = [],
  disabled,
  onChange,
}) {
  const update = (patch) => {
    onChange({
      ...value,
      ...patch,
    });
  };

  const addRoom = () => {
    update({
      rooms: [
        ...(value.rooms || []),
        {
          room_category: "Normal",
          room_type: "DOUBLE",
          count: 1,
          unit_price: 0,
        },
      ],
    });
  };

  const total = (value.rooms || []).reduce(
    (sum, r) => sum + (Number(r.unit_price) || 0) * (Number(r.count) || 0),
    0
  );

  return (
    <Card className="rounded-2xl border bg-background shadow-sm">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-primary/5 text-primary">
                <Building2 className="h-5 w-5" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">Hotel Details</p>
                  <Badge variant="outline" className="rounded-full">
                    Day Accommodation
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure hotel, meal plan, override label, notes, and room pricing.
                </p>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/20 px-4 py-3 text-right">
              <p className="text-xs font-medium text-muted-foreground">
                Accommodation Total
              </p>
              <p className="text-lg font-semibold">{total}</p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Hotel
              </label>
              <Select
                value={value.hotel_id ? String(value.hotel_id) : ""}
                onValueChange={(v) =>
                  update({
                    hotel_id: v,
                    hotel_name_override:
                      hotels.find((h) => String(h.id) === String(v))?.name || "",
                  })
                }
                disabled={disabled}
              >
                <SelectTrigger className="rounded-xl">
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

            <div className="xl:col-span-3">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Meal Plan
              </label>
              <Select
                value={value.meal_plan || "BB"}
                onValueChange={(v) => update({ meal_plan: v })}
                disabled={disabled}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Meal Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BB">BB</SelectItem>
                  <SelectItem value="HB">HB</SelectItem>
                  <SelectItem value="FB">FB</SelectItem>
                  <SelectItem value="RO">RO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="xl:col-span-4">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Hotel Name Override
              </label>
              <Input
                placeholder="Override display name"
                value={value.hotel_name_override || ""}
                onChange={(e) =>
                  update({ hotel_name_override: e.target.value })
                }
                className="rounded-xl"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border bg-muted/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Room Categories</p>
            </div>

            <div className="space-y-3">
              {(value.rooms || []).length === 0 ? (
                <div className="rounded-xl border border-dashed bg-background p-6 text-center">
                  <Hotel className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">No room categories added</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add room lines like Normal, Deluxe, Superior, etc.
                  </p>

                  <Button
                    size="sm"
                    className="mt-4 rounded-xl"
                    onClick={addRoom}
                    disabled={disabled}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Room Category
                  </Button>
                </div>
              ) : (
                <>
                  {(value.rooms || []).map((r, i) => (
                    <RoomRow
                      key={i}
                      value={r}
                      index={i}
                      onChange={(updated) => {
                        const next = [...value.rooms];
                        next[i] = updated;
                        update({ rooms: next });
                      }}
                      onRemove={() =>
                        update({
                          rooms: value.rooms.filter((_, idx) => idx !== i),
                        })
                      }

                      onDuplicate={() => {
                        const next = [...value.rooms];

                        next.splice(i + 1, 0, {
                          ...r,
                          // optional: reset count if needed
                          // count: 1,
                        });

                        update({ rooms: next });
                      }}
                      disabled={disabled}
                    />
                  ))}

                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={addRoom}
                    disabled={disabled}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room Category
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <MessageSquareText className="h-4 w-4" />
              Notes
            </label>
            <Textarea
              placeholder="Internal notes, guest preferences, special requests..."
              value={value.notes || ""}
              onChange={(e) => update({ notes: e.target.value })}
              className="min-h-[100px] rounded-2xl"
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}