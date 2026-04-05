import React, { useMemo } from "react";
import {
  BedDouble,
  Layers3,
  Tag,
  Trash2,
  Wallet,
  Copy, // ✅ NEW
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
  onDuplicate, // ✅ NEW
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
    <Card className="rounded-2xl border bg-background shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          
          {/* LEFT */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/30">
              <BedDouble className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">
                  Room Category {index + 1}
                </p>
                <Badge variant="outline" className="rounded-full">
                  Pricing Line
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Category, room type, quantity, and unit pricing
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            
            <Badge variant="secondary" className="rounded-full">
              Line Total: {lineTotal}
            </Badge>

            {/* 🔥 DUPLICATE BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={onDuplicate}
              disabled={disabled}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>

            {/* REMOVE */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-red-500 hover:text-red-600"
              onClick={onRemove}
              disabled={disabled}
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Layers3 className="h-4 w-4" />
              Room Category
            </label>
            <Input
              placeholder="Deluxe"
              value={value.room_category || ""}
              onChange={(e) =>
                update({ room_category: e.target.value })
              }
              className="rounded-xl"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Tag className="h-4 w-4" />
              Room Type
            </label>
            <Input
              placeholder="DOUBLE"
              value={value.room_type || ""}
              onChange={(e) =>
                update({ room_type: e.target.value })
              }
              className="rounded-xl"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Count
            </label>
            <Input
              type="number"
              min="0"
              value={value.count ?? 1}
              onChange={(e) =>
                update({ count: Number(e.target.value) })
              }
              className="rounded-xl"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Wallet className="h-4 w-4" />
              Unit Price
            </label>
            <Input
              type="number"
              min="0"
              value={value.unit_price ?? 0}
              onChange={(e) =>
                update({ unit_price: Number(e.target.value) })
              }
              className="rounded-xl"
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}