"use client";

import { useState, useRef, useEffect } from "react";
import { Badge, Circle, Trash, Trash2, X } from "lucide-react";
import { buildImageUrl } from "@/utils/urls";
import { Toggle } from "radix-ui";


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
    if (selected.find((s) => s.id === item.id)) {
      setOpen(false);
      return;
    }

    const newItem = { ...item, is_optional: false };
    setSelected([...selected, newItem]);

    setOpen(false);
    setQuery("");
  }

  function removeItem(id) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  function toggleOptional(id) {
    const updatedSelected = selected.map((item) => {
      return item.id === id ? { ...item, is_optional: !item.is_optional } : item
    }
    );
    setSelected(updatedSelected);
  }

  return (
    <div ref={wrapperRef} className="space-y-2 relative">
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

      {/* Selected chips */}
      <div className="flex flex-wrap gap-3">
        {selected.map((item) => (
          <div
            key={item.id}
            className={`group relative flex items-center gap-3 pl-3 pr-2 py-2 rounded-xl border transition-all duration-200 shadow-sm ${item.is_optional
              ? "bg-white border-orange-200 hover:border-orange-300"
              : "bg-ti-mint/5 border-ti-mint/20 hover:border-ti-mint/40"
              }`}
          >

            <div className="flex flex-col min-w-[100px]">
              <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                {item.name}
              </span>
              <span className={`text-[9px] font-semibold uppercase tracking-wider ${item.is_optional ? "text-orange-500" : "text-ti-mint"
                }`}>
                {item.is_optional ? "Optional" : "Included"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 ml-2 border-l pl-2">
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => toggleOptional(item.id)}
                title={item.is_optional ? "Change to Included" : "Change to Optional"}
                className={`p-1.5 rounded-lg border transition-colors  ${item.is_optional
                  ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                  }`}
              >
                <Circle size={14} fill={item.is_optional ? "currentColor" : "none"} />
              </button>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
