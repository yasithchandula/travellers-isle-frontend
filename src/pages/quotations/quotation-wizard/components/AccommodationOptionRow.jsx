import React, { useState } from "react";

export default function AccommodationOptionRow({
  option,
  onChange,
  onRemove,
  onSelect,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleHotelChange = async (hotel_id) => {
    onChange({ hotel_id, room_id: null });

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
      pricing: {
        cost,
        sell,
        margin: sell - cost,
      },
    });
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center border rounded-lg p-2 bg-muted/20">
      
      {/* SELECT */}
      <div className="col-span-1 flex justify-center">
        <input
          type="radio"
          checked={option.meta?.isSelected}
          onChange={onSelect}
        />
      </div>

      {/* HOTEL */}
      <div className="col-span-3">
        <select
          value={option.hotel_id || ""}
          onChange={(e) => handleHotelChange(e.target.value)}
          className="w-full border rounded p-1"
        >
          <option value="">Hotel</option>
        </select>
      </div>

      {/* ROOM */}
      <div className="col-span-2">
        <select
          value={option.room_id || ""}
          onChange={(e) =>
            onChange({ room_id: e.target.value })
          }
          disabled={!option.hotel_id || loading}
          className="w-full border rounded p-1"
        >
          <option>
            {loading ? "Loading..." : "Room"}
          </option>

          {rooms.map((r) => (
            <option key={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* MEAL */}
      <div className="col-span-1">
        <select
          value={option.meal_plan}
          onChange={(e) =>
            onChange({ meal_plan: e.target.value })
          }
          className="w-full border rounded p-1"
        >
          <option value="BB">BB</option>
          <option value="HB">HB</option>
          <option value="FB">FB</option>
        </select>
      </div>

      {/* COST */}
      <div className="col-span-1">
        <input
          type="number"
          value={option.pricing.cost}
          onChange={(e) =>
            updatePricing("cost", Number(e.target.value))
          }
          className="w-full border rounded p-1"
          placeholder="Cost"
        />
      </div>

      {/* SELL */}
      <div className="col-span-1">
        <input
          type="number"
          value={option.pricing.sell}
          onChange={(e) =>
            updatePricing("sell", Number(e.target.value))
          }
          className="w-full border rounded p-1"
          placeholder="Sell"
        />
      </div>

      {/* MARGIN */}
      <div className="col-span-1 text-xs text-center">
        {option.pricing.margin}
      </div>

      {/* REMOVE */}
      <div className="col-span-1 text-right">
        <button onClick={onRemove} className="text-red-500 text-xs">
          ✕
        </button>
      </div>
    </div>
  );
}