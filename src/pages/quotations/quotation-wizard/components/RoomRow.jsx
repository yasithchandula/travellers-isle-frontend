import React, { useMemo } from "react";
import {
  BedDouble,
  Layers3,
  Tag,
  Trash2,
  Wallet,
  Copy,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RoomRow({
  value,
  index,
  onChange,
  onRemove,
  onDuplicate,
  disabled,
}) {
  const update = (patch) => {
    onChange({
      ...value,
      ...patch,
    });
  };

  const lineTotal = useMemo(() => {
    return (Number(value.unit_price) || 0) * (Number(value.count) || 0);
  }, [value.unit_price, value.count]);

  return (
    <Card className="rounded-xl border bg-background shadow-sm">
      <CardContent className="p-3 space-y-3">

        {/* HEADER - SINGLE LINE */}
        <div className="flex items-center justify-between gap-2">

          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
              <BedDouble className="h-3.5 w-3.5" />
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <p className="text-xs font-semibold truncate">
                Room {index + 1}
              </p>

              <Badge
                variant="outline"
                className="rounded-full text-[10px] px-2 py-0"
              >
                Line
              </Badge>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1 shrink-0">

            <Badge className="rounded-full text-[10px] px-2 py-0">
              {lineTotal}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={onDuplicate}
              disabled={disabled}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600"
              onClick={onRemove}
              disabled={disabled}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* INPUTS */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">

          {/* CATEGORY */}
          <div>
            <label className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1">
              <Layers3 className="h-3 w-3" />
              Category
            </label>
            <Input
              placeholder="Deluxe"
              value={value.room_category || ""}
              onChange={(e) =>
                update({ room_category: e.target.value })
              }
              className="h-8 rounded-lg text-xs"
              disabled={disabled}
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1">
              <Tag className="h-3 w-3" />
              Type
            </label>
            <Input
              placeholder="DBL"
              value={value.room_type || ""}
              onChange={(e) =>
                update({ room_type: e.target.value })
              }
              className="h-8 rounded-lg text-xs"
              disabled={disabled}
            />
          </div>

          {/* COUNT */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">
              Qty
            </label>
            <Input
              type="number"
              min="0"
              value={value.count ?? 1}
              onChange={(e) =>
                update({ count: Number(e.target.value) })
              }
              className="h-8 rounded-lg text-xs"
              disabled={disabled}
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1">
              <Wallet className="h-3 w-3" />
              Price
            </label>
            <Input
              type="number"
              min="0"
              value={value.unit_price ?? 0}
              onChange={(e) =>
                update({ unit_price: Number(e.target.value) })
              }
              className="h-8 rounded-lg text-xs"
              disabled={disabled}
            />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}