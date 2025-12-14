import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";

export default function CostHotels({ itinerary, hotels, setHotels }) {
  const allHotels = useSelector((s) => s.hotels.items);
  const cities = useSelector((s) => s.cities.items);

  // Group itinerary by destination → blocks
  const blocks = useMemo(() => {
    if (!itinerary?.days?.length) return [];

    const temp = [];
    let current = null;

    itinerary.days.forEach((d) => {
      if (!current || current.destinationId !== d.destinationId) {
        // start new block
        current = {
          destinationId: d.destinationId,
          nights: 1,
        };
        temp.push(current);
      } else {
        current.nights += 1;
      }
    });

    return temp;
  }, [itinerary]);

  // Ensure hotels array matches block count
  useEffect(() => {
    const newHotels = blocks.map((b, idx) => {
      return hotels[idx] || {
        destinationId: b.destinationId,
        nights: b.nights,
        hotelId: "",
        roomCategory: "",
        mealPlan: "",
        earlyCI: false,
        lateCO: false,
        earlyCICharge: 0,
        lateCOCharge: 0,
        driverAccommodation: 0,
      };
    });
    setHotels(newHotels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks.length]);

  function updateBlock(i, patch) {
    const updated = [...hotels];
    updated[i] = { ...updated[i], ...patch };
    setHotels(updated);
  }

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, index) => {
        const destName =
          cities.find((c) => c.id === b.destinationId)?.name || "Unknown";

        // Hotels assigned to that city
        const hotelsForCity = allHotels.filter(
          (h) => h.cityId === b.destinationId
        );

        const selectedHotel = allHotels.find(
          (h) => h.id === hotels[index]?.hotelId
        );

        return (
          <div
            key={index}
            className="border rounded p-4 bg-gray-50 flex flex-col gap-4"
          >
            <div className="text-lg font-semibold">
              {destName} — {b.nights} Night{b.nights > 1 ? "s" : ""}
            </div>

            {/* Select Hotel */}
            <div>
              <label className="font-medium">Hotel</label>
              <select
                className="w-full border rounded px-3 py-2 mt-1"
                value={hotels[index]?.hotelId || ""}
                onChange={(e) => {
                  const hid = Number(e.target.value);
                  const hotel = allHotels.find((h) => h.id === hid);

                  updateBlock(index, {
                    hotelId: hid,
                    roomCategory: "",
                    mealPlan: "",
                    driverAccommodation:
                      hotel?.driverAccommodation?.priceUSD || 0,
                  });
                }}
              >
                <option value="">Select hotel</option>
                {hotelsForCity.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Category */}
            {selectedHotel && (
              <div>
                <label className="font-medium">Room Category</label>
                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={hotels[index]?.roomCategory || ""}
                  onChange={(e) =>
                    updateBlock(index, { roomCategory: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {selectedHotel.roomCategories.map((rc, i) => (
                    <option key={i} value={rc.name}>
                      {rc.name} — ${rc.basePriceUSD}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Meal Plan */}
            {selectedHotel && (
              <div>
                <label className="font-medium">Meal Plan</label>
                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={hotels[index]?.mealPlan || ""}
                  onChange={(e) =>
                    updateBlock(index, { mealPlan: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {selectedHotel.mealPlans.map((mp) => (
                    <option key={mp} value={mp}>
                      {mp}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Early Check-in / Late Check-out */}
            {selectedHotel && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Early Check-in?</label>
                    <select
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={hotels[index]?.earlyCI ? "yes" : "no"}
                      onChange={(e) =>
                        updateBlock(index, {
                          earlyCI: e.target.value === "yes",
                          earlyCICharge:
                            e.target.value === "yes"
                              ? selectedHotel.earlyCheckinUSD
                              : 0,
                        })
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">
                        Yes (+${selectedHotel.earlyCheckinUSD})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium">Late Check-out?</label>
                    <select
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={hotels[index]?.lateCO ? "yes" : "no"}
                      onChange={(e) =>
                        updateBlock(index, {
                          lateCO: e.target.value === "yes",
                          lateCOCharge:
                            e.target.value === "yes"
                              ? selectedHotel.lateCheckoutUSD
                              : 0,
                        })
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">
                        Yes (+${selectedHotel.lateCheckoutUSD})
                      </option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Driver Accommodation */}
            {selectedHotel && (
              <div className="mt-2 text-sm text-gray-700">
                Driver Accommodation: $
                {selectedHotel.driverAccommodation?.priceUSD || 0}
              </div>
            )}

            {/* Special Contact */}
            {selectedHotel && (
              <div className="text-xs text-gray-600">
                Special Pricing Contact:{" "}
                {selectedHotel.specialPricingContact?.name} (
                {selectedHotel.specialPricingContact?.phone})
              </div>
            )}
          </div>
        );
      })}

      {blocks.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No itinerary days selected.
        </div>
      )}
    </div>
  );
}
