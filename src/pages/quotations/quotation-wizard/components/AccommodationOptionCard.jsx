import React, { useState, useMemo } from "react";

export default function AccommodationOptionCard({
  option,
  onChange,
  onRemove,
  onSelect,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleHotelChange = async (hotel_id) => {
    onChange({ ...option, hotel_id, room_id: null });

    setLoading(true);
    const res = await fetch(`/api/hotels/${hotel_id}/rooms`);
    const data = await res.json();
    setRooms(data.data || []);
    setLoading(false);
  };

  const updatePricing = (field, value) => {
    const cost = field === "cost" ? value : option.pricing.cost;
    const sell = field === "sell" ? value : option.pricing.sell;

    onChange({
      ...option,
      pricing: {
        cost,
        sell,
        margin: sell - cost,
      },
    });
  };

  const marginPercent = useMemo(() => {
    if (!option.pricing.cost) return 0;
    return (
      ((option.pricing.sell - option.pricing.cost) /
        option.pricing.cost) *
      100
    ).toFixed(1);
  }, [option.pricing]);

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3 hover:shadow-md transition">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            checked={option.meta?.isSelected}
            onChange={onSelect}
          />
          <span className="font-medium text-sm">
            Hotel Option
          </span>

          {option.meta?.isRecommended && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Recommended
            </span>
          )}
        </div>

        <button
          onClick={onRemove}
          className="text-red-500 text-xs"
        >
          Remove
        </button>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        
        {/* HOTEL */}
        <select
          value={option.hotel_id || ""}
          onChange={(e) => handleHotelChange(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Select Hotel</option>
        </select>

        {/* ROOM */}
        <select
          value={option.room_id || ""}
          onChange={(e) =>
            onChange({ ...option, room_id: e.target.value })
          }
          disabled={!option.hotel_id || loading}
          className="border rounded p-2"
        >
          <option>
            {loading ? "Loading..." : "Room"}
          </option>

          {rooms.map((r) => (
            <option key={r.id}>{r.name}</option>
          ))}
        </select>

        {/* MEAL */}
        {/* <select
          value={option.meal_plan}
          onChange={(e) =>
            onChange({ ...option, meal_plan: e.target.value })
          }
          className="border rounded p-2"
        >
          <option value="BB">BB</option>
          <option value="HB">HB</option>
          <option value="FB">FB</option>
        </select> */}

        {/* COST */}
        <input
          type="number"
          value={option.pricing.cost}
          onChange={(e) =>
            updatePricing("cost", Number(e.target.value))
          }
          className="border rounded p-2"
          placeholder="Cost"
        />

        {/* SELL */}
        <input
          type="number"
          value={option.pricing.sell}
          onChange={(e) =>
            updatePricing("sell", Number(e.target.value))
          }
          className="border rounded p-2"
          placeholder="Sell"
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
        {/* <span>Margin: {option.pricing.margin}</span>
        <span>{marginPercent}%</span> */}
        <span>
          {option.meta?.isSelected
            ? "Selected"
            : "Not selected"}
        </span>
      </div>
    </div>
  );
}