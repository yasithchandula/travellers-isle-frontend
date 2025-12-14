import { useState, useEffect } from "react";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

const VEHICLE_TYPES = [
  "Car",
  "SUV",
  "Van",
  "Mini Coach",
  "Large Coach (Bus)",
];

export default function CostTransport({ tourEntry, transport, setTransport }) {
  const daysOnTour = calculateTourDays(tourEntry.tourStart, tourEntry.tourEnd);
  const paxCount = tourEntry.adults + tourEntry.children.length;

  // Auto-fill on load
  useEffect(() => {
    if (!transport) {
      setTransport({
        vehicleType: "",
        baseRate: 130,
        days: daysOnTour,
        distance: 0,
        guideFee: 0,
        assistantFee: 0,
        driverBata: 0,
        driverAccommodation: 0,
        noTransport: false,
        transferDistance: 0,
      });
    }
  }, []);

  // Helper to update fields
  function update(patch) {
    setTransport({ ...transport, ...patch });
  }

   if (!transport) return null;

  const isBus = transport?.vehicleType?.includes("Coach");

  const paxOverLimit = paxCount > 8;

  return (
    <div className="flex flex-col gap-4">

      {/* Vehicle Type */}
      <div>
        <label className="font-medium">Vehicle Type</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={transport.vehicleType}
          onChange={(e) => update({ vehicleType: e.target.value })}
          disabled={transport.noTransport}
        >
          <option value="">Select</option>
          {VEHICLE_TYPES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* No Transport Toggle */}
      <div>
        <label className="font-medium">No Transport</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={transport.noTransport ? "yes" : "no"}
          onChange={(e) => {
            const noTrans = e.target.value === "yes";
            update({
              noTransport: noTrans,
              baseRate: noTrans ? 0 : transport.baseRate,
              driverBata: noTrans ? 0 : transport.driverBata,
              guideFee: noTrans ? 0 : transport.guideFee,
              assistantFee: noTrans ? 0 : transport.assistantFee,
            });
          }}
        >
          <option value="no">No</option>
          <option value="yes">Yes (Disable all transport costs)</option>
        </select>
      </div>

      {/* Transfer Distance (if no transport) */}
      {transport.noTransport && (
        <div>
          <label className="font-medium">Transfer Distance (KM)</label>
          <Input
            type="number"
            value={transport.transferDistance}
            onChange={(v) => update({ transferDistance: Number(v) })}
            placeholder="Enter KM for occasional transfers"
          />
        </div>
      )}

      {/* Basic Rate */}
      {!transport.noTransport && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Base Rate (USD per day)"
            type="number"
            value={transport.baseRate}
            onChange={(v) => update({ baseRate: Number(v) })}
          />
          <Input
            label="Days on Tour"
            type="number"
            value={transport.days}
            onChange={(v) => update({ days: Number(v) })}
          />
        </div>
      )}

      {/* Distance */}
      {!transport.noTransport && (
        <Input
          label="Total Distance (KM)"
          type="number"
          value={transport.distance}
          onChange={(v) => update({ distance: Number(v) })}
          placeholder="Auto-calculation later, editable now"
        />
      )}

      {/* Guide Fee (only when > 8 pax or bus) */}
      {!transport.noTransport && (
        <>
          {(paxOverLimit || isBus) && (
            <Input
              label="National Guide Fee (USD per day)"
              type="number"
              value={transport.guideFee}
              onChange={(v) => update({ guideFee: Number(v) })}
            />
          )}

          {isBus && (
            <Input
              label="Assistant Fee (USD per day)"
              type="number"
              value={transport.assistantFee}
              onChange={(v) => update({ assistantFee: Number(v) })}
            />
          )}
        </>
      )}

      {/* Driver Bata */}
      {!transport.noTransport && (
        <Input
          label="Driver Bata (Total USD)"
          type="number"
          value={transport.driverBata}
          onChange={(v) => update({ driverBata: Number(v) })}
        />
      )}

      <div className="text-gray-500 text-sm mt-2">
        * Driver accommodation is included in Hotel section per night.
      </div>
    </div>
  );
}

/* Utility: calculate number of days */
function calculateTourDays(start, end) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e - s) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  } catch {
    return 1;
  }
}
