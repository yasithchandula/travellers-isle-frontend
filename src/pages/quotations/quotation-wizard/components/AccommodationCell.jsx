import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import AccommodationOptionCard from "./AccommodationOptionCard";

export default function AccommodationCell({ day, onChange }) {
  const [open, setOpen] = useState(false);

  const options = day.accommodation?.options || [];

  const selected = options.find((o) => o.meta?.isSelected);

  const total = useMemo(() => {
    return options.reduce((sum, o) => sum + (o.pricing.sell || 0), 0);
  }, [options]);

  const updateAll = (next) => {
    onChange({ ...day.accommodation, options: next });
  };

  const addOption = () => {
    updateAll([
      ...options,
      {
        id: crypto.randomUUID(),
        hotel_id: null,
        room_id: null,
        meal_plan: "BB",
        nights: 1,
        pricing: { cost: 0, sell: 0, margin: 0 },
        meta: { isSelected: options.length === 0 },
      },
    ]);
  };

  const autoSelectCheapest = () => {
    if (!options.length) return;

    const cheapest = [...options].sort(
      (a, b) => a.pricing.sell - b.pricing.sell
    )[0];

    updateAll(
      options.map((o) => ({
        ...o,
        meta: { ...o.meta, isSelected: o.id === cheapest.id },
      }))
    );
  };

  return (
    <div className="space-y-2">
      
      {/* SUMMARY BAR */}
      <div className="flex items-center justify-between border rounded-lg px-3 py-2 bg-muted/30">
        <div className="text-sm">
          {selected
            ? `${selected.hotel_id || "Hotel"} • ${
                selected.room_id || "Room"
              } • ${selected.pricing.sell || 0}`
            : "No hotel selected"}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={autoSelectCheapest}>
            Auto Select
          </Button>

          <Button size="sm" variant="ghost" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Edit"}
          </Button>
        </div>
      </div>

      {/* EXPANDED */}
      {open && (
        <div className="border rounded-xl p-3 bg-background space-y-3">
          
          {/* OPTIONS */}
          <div className="grid gap-3">
            {options.map((opt) => (
              <AccommodationOptionCard
                key={opt.id}
                option={opt}
                options={options}
                onChange={(updated) =>
                  updateAll(
                    options.map((o) =>
                      o.id === opt.id ? updated : o
                    )
                  )
                }
                onSelect={() =>
                  updateAll(
                    options.map((o) => ({
                      ...o,
                      meta: {
                        ...o.meta,
                        isSelected: o.id === opt.id,
                      },
                    }))
                  )
                }
                onRemove={() =>
                  updateAll(options.filter((o) => o.id !== opt.id))
                }
              />
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button size="sm" onClick={addOption}>
              + Add Hotel
            </Button>

            <div className="text-sm font-medium">
              Total: {total}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}