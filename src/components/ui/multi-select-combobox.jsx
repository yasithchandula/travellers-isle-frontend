"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { buildImageUrl } from "@/utils/urls";

export default function ExcursionSelector({
  items = [],
  selected = [],
  setSelected,
  onSearch,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  function addItem(item) {
    if (selected.find((s) => s.id === item.id)) return;
    setSelected([...selected, item]);
    setOpen(false);
  }

  function removeItem(id) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-2 relative">
      {/* Selected chips */}
      <div className="flex flex-wrap gap-2">
        {selected.map((item) => (
          <span
            key={item.id}
            className="flex items-center gap-1 rounded bg-accent px-2 py-1 text-xs text-accent-foreground"
          >
            {item.name}
            <X
              size={14}
              className="cursor-pointer text-destructive"
              onClick={() => removeItem(item.id)}
            />
          </span>
        ))}
      </div>

      {/* Search input */}
      <input
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Search excursions..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          onSearch(e.target.value);
        }}
        onFocus={() => setOpen(true)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md border bg-popover shadow-lg">
          {items.length === 0 && (
            <div className="p-3 text-sm text-gray-500">
              No excursions found
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => addItem(item)}
              className="flex cursor-pointer gap-3 border-b p-3 hover:bg-accent"
            >
              {item.gallery?.[0] && (
                <img
                  src={buildImageUrl(item.gallery[0])}
                  className="w-14 h-14 rounded object-cover"
                />
              )}

              <div className="flex-1">
                <div className="font-medium text-sm">
                  {item.name}
                </div>

                <div className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </div>

                <div className="flex gap-2 pt-1 text-[10px]">
                  <span className="rounded bg-muted px-2 py-0.5">
                    {item.pricing_type}
                  </span>

                  <span className="rounded bg-accent px-2 py-0.5 text-accent-foreground">
                    {item.is_full_day ? "Full Day" : "Half Day"}
                  </span>

                  {item.allow_zero_at_quotation && (
                    <span className="px-2 py-0.5 rounded bg-yellow-200">
                      Zero Allowed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
