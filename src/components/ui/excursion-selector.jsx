"use client";

import { useState, useRef, useEffect } from "react";
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

  const wrapperRef = useRef(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addItem(item) {
    if (selected.find((s) => s.id === item.id)) return;

    setSelected([...selected, item]);

    setOpen(false);     // close after add
    setQuery("");       // optional clear search
  }

  function removeItem(id) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  return (
    <div ref={wrapperRef} className="space-y-2 relative">
      {/* Selected chips */}
      <div className="flex flex-wrap gap-2">
        {selected.map((item) => (
          <span
            key={item.id}
            className="px-2 py-1 text-xs rounded bg-ti-mint/60 flex items-center gap-1"
          >
            {item.name}
            <X
              size={14}
              className="cursor-pointer text-ti-red"
              onClick={() => removeItem(item.id)}
            />
          </span>
        ))}
      </div>

      {/* Search input */}
      <input
        className="w-full border rounded px-3 py-2 text-sm"
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
        <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow max-h-80 overflow-auto">
          {items.length === 0 && (
            <div className="p-3 text-sm text-gray-500">
              No excursions found
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => addItem(item)}
              className="flex gap-3 p-3 cursor-pointer hover:bg-ti-sky/10 border-b"
            >
              {item.gallery?.[0] && (
                <img
                  src={buildImageUrl(item.gallery[0])}
                  className="w-14 h-14 rounded object-cover"
                />
              )}

              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>

                <div className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </div>

                <div className="flex gap-2 pt-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-ti-sky/30">
                    {item.pricing_type}
                  </span>

                  <span className="px-2 py-0.5 rounded bg-ti-mint/40">
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
