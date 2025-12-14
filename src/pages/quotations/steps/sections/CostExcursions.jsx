import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../../../../components/common/Input";
import Card from "../../../../components/common/Card";
import { calcPerPersonCost, calcSafariCost, calcBoatCost } from "../../../../utils/excursionCalc";

/*
Shape we store here in parent:
excursions: {
  days: [
    { dayIndex: 0, items: [
        { excursionId: 2, type: 'SAFARI', includeGuide: false, isFullDay: false, customPrice: 0, subtotal: 123 }
    ]}
  ]
}
*/

export default function CostExcursions({ itinerary, excursions, setExcursions }) {
  const allExcursions = useSelector((s) => s.excursions.items);
  const tourEntry = useSelector((s) => s.quotations?.currentTourEntry) || null; // optional, else pass counts via props in future

  // Fallback counts from itinerary context if not in redux
  // adults + children array (ages)
  const adults = (tourEntry?.adults) ?? 2;
  const childAges = (tourEntry?.children) ?? [];
  const infants = childAges.filter(a => a <= 2).length;
  const children = childAges.filter(a => a >= 3 && a < 6).length; // fits your 0-2 / 3-5 design; adjust if you add more ranges
  const totalGuests = adults + childAges.length;

  // Initialize from itinerary.days if empty
  useEffect(() => {
    if (!excursions || !excursions.days || excursions.days.length === 0) {
      const seed = (itinerary?.days || []).map((d, idx) => ({
        dayIndex: idx,
        items: (d.excursions || []).map((eid) => {
          const ex = allExcursions.find((e) => e.id === eid);
          return {
            excursionId: eid,
            type: ex?.pricingType || "CUSTOM",
            includeGuide: true,
            isFullDay: false,
            customPrice: 0,
            subtotal: 0,
          };
        }),
      }));
      setExcursions({ days: seed, total: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary?.days?.length, allExcursions.length]);

  const [local, setLocal] = useState(excursions || { days: [] });

  useEffect(() => {
    setLocal(excursions || { days: [] });
  }, [excursions]);

  function updateItem(dayIndex, itemIndex, patch) {
    const next = structuredClone(local);
    next.days[dayIndex].items[itemIndex] = {
      ...next.days[dayIndex].items[itemIndex],
      ...patch,
    };
    setLocal(next);
    const computed = computeTotals(next, allExcursions, { adults, infants, children, totalGuests });
    setExcursions(computed);
  }

  if (!local || !local.days) {
    return <div className="text-gray-500">No excursions selected in itinerary.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {local.days.map((d, di) => (
        <Card key={di}>
          <div className="font-semibold mb-3">Day {di + 1}</div>

          {d.items.length === 0 && (
            <div className="text-gray-500">No excursions on this day.</div>
          )}

          <div className="flex flex-col gap-3">
            {d.items.map((it, ii) => {
              const ex = allExcursions.find((e) => e.id === it.excursionId);
              if (!ex) return null;

              return (
                <div key={ii} className="border rounded p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{ex.name}</div>
                      <div className="text-xs text-gray-600">{ex.pricingType}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Subtotal</div>
                      <div className="text-lg font-semibold">${Number(it.subtotal || 0).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Controls per type */}
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {/* PER_PERSON & BOAT -> include guide */}
                    {(it.type === "PER_PERSON" || it.type === "BOAT") && (
                      <div>
                        <label className="text-sm">Include Guide?</label>
                        <select
                          className="w-full border rounded px-2 py-1 mt-1"
                          value={it.includeGuide ? "yes" : "no"}
                          onChange={(e) =>
                            updateItem(di, ii, { includeGuide: e.target.value === "yes" })
                          }
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    )}

                    {/* SAFARI -> is full day */}
                    {it.type === "SAFARI" && (
                      <div>
                        <label className="text-sm">Full Day?</label>
                        <select
                          className="w-full border rounded px-2 py-1 mt-1"
                          value={it.isFullDay ? "yes" : "no"}
                          onChange={(e) =>
                            updateItem(di, ii, { isFullDay: e.target.value === "yes" })
                          }
                        >
                          <option value="no">No (Half)</option>
                          <option value="yes">Yes (Full Day)</option>
                        </select>
                      </div>
                    )}

                    {/* CUSTOM -> editable price */}
                    {it.type === "CUSTOM" && (
                      <div>
                        <Input
                          label="Custom Price (USD)"
                          type="number"
                          value={it.customPrice || 0}
                          onChange={(v) => updateItem(di, ii, { customPrice: Number(v) })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Section Total */}
      <div className="text-right text-xl font-semibold">
        Total Excursions: ${Number(local.total || 0).toFixed(2)}
      </div>
    </div>
  );
}

function computeTotals(state, allExcursions, counts) {
  let total = 0;

  const days = (state.days || []).map((d) => {
    const items = (d.items || []).map((it) => {
      const ex = allExcursions.find((e) => e.id === it.excursionId);
      let subtotal = 0;

      if (!ex) return { ...it, subtotal };

      switch (it.type) {
        case "PER_PERSON":
          subtotal = calcPerPersonCost(
            ex.perPerson,
            { infants: counts.infants, children: counts.children, adults: counts.adults },
            it.includeGuide
          );
          break;

        case "SAFARI":
          subtotal = calcSafariCost(
            ex.safari,
            { totalGuests: counts.totalGuests },
            it.isFullDay
          );
          break;

        case "BOAT":
          subtotal = calcBoatCost(
            ex.boat,
            { totalGuests: counts.totalGuests },
            it.includeGuide
          );
          break;

        case "FREE":
          subtotal = 0;
          break;

        case "CUSTOM":
        default:
          subtotal = Number(it.customPrice || 0);
          break;
      }

      return { ...it, subtotal };
    });

    const dayTotal = items.reduce((s, x) => s + Number(x.subtotal || 0), 0);
    total += dayTotal;
    return { dayIndex: d.dayIndex, items, dayTotal };
  });

  return { days, total };
}
