import React from "react";
import { BedDouble, Trash2, Copy } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RoomRow({
  value,
  index,
  onChange,
  onRemove,
  onDuplicate,
  disabled,
  hotel,
}) {
  const update = (patch) => {
    onChange({
      ...value,
      ...patch,
    });
  };

  const lineTotal =
    (Number(value.unit_price) || 0) * (Number(value.count) || 0);

  const categories = hotel?.roomCategories || hotel?.room_categories || [];

  const getRoomTypeFromPax = (pax) => {
    if (pax === 1) return "Single";
    if (pax === 2) return "Double";
    if (pax === 3) return "Triple";
    if (pax >= 4) return "Family";
    return "";
  };

  return (
    <Card className="rounded-lg border bg-background shadow-sm">
      <CardContent className="p-2.5 space-y-2">

        {/* ================= ROW 1 ================= */}
        <div className="flex items-end gap-2">

          {/* INDEX */}
          <div className="flex items-center gap-1.5 min-w-[64px]">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-muted/30">
              <BedDouble className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs font-semibold text-foreground">
              #{index + 1}
            </span>
          </div>

          {/* CATEGORY */}
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground mb-1">
              Category
            </p>
            <Select
              value={value.room_category_id ? String(value.room_category_id) : ""}
              onValueChange={(v) => {
                const selected = categories.find((c) => String(c.id) === v);

                update({
                  room_category_id: v,

                  room_category: selected?.name,
                  room_type: getRoomTypeFromPax(selected?.pax),
                  unit_price: selected?.price || 0,
                });
              }}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 rounded-md text-xs">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name} ({c.pax} pax)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* TYPE */}
          <div className="w-[90px]">
            <p className="text-[10px] text-muted-foreground mb-1">
              Type
            </p>
            <Input
              value={value.room_type || ""}
              placeholder="-"
              className="h-8 rounded-md text-xs"
              disabled
            />
          </div>
        </div>

        {/* ================= ROW 2 ================= */}
        <div className="flex items-end gap-2">

          {/* QTY */}
          <div className="w-[70px]">
            <p className="text-[10px] text-muted-foreground mb-1">
              Rooms
            </p>
            <Input
              type="number"
              min="1"
              value={value.count ?? 1}
              onChange={(e) =>
                update({
                  count: Number(e.target.value),
                })
              }
              className="h-8 rounded-md text-xs"
              disabled={disabled}
            />
          </div>

          {/* PRICE */}
          <div className="w-[110px]">
            <p className="text-[10px] text-muted-foreground mb-1">
              Price / Room
            </p>
            <Input
              type="number"
              min="0"
              value={value.unit_price ?? 0}
              onChange={(e) =>
                update({ unit_price: Number(e.target.value) })
              }
              className="h-8 rounded-md text-xs"
              disabled={disabled}
            />
          </div>

          {/* TOTAL */}
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground mb-1 text-right">
              Total
            </p>
            <div className="flex h-8 items-center justify-end rounded-md border bg-muted/20 px-2 text-xs font-semibold">
              {lineTotal}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={onDuplicate}
              disabled={disabled}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-red-500 hover:text-red-600"
              onClick={onRemove}
              disabled={disabled}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}