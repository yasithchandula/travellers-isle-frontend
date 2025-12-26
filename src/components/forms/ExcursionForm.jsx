import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { calcPerPersonCost, calcSafariCost, calcBoatCost } from "../../utils/excursionCalc";

const PRICING_TYPES = ["PER_PERSON", "SAFARI", "BOAT", "CUSTOM", "FREE"];

export default function ExcursionForm({ initial, cities, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [tagsText, setTagsText] = useState((initial?.tags || []).join(", "));
  const [pricingType, setPricingType] = useState(initial?.pricingType || "PER_PERSON");
  const [assignedCityIds, setAssignedCityIds] = useState(initial?.assignedCityIds || []);
  const [isOptionalSupplement, setIsOptionalSupplement] = useState(!!initial?.isOptionalSupplement);
  const [citySelect, setCitySelect] = useState("");

  // Per Person
  const [pp, setPP] = useState(initial?.perPerson || {
    infantRange: [0, 2],
    childRange: [3, 5],
    adultFrom: 6,
    infantUSD: 0,
    childUSD: 0,
    adultUSD: 0,
    guideFeeUSD: 0,
  });

  // Safari
  const [safari, setSafari] = useState(initial?.safari || {
    jeepRentUSD: 0,
    perPersonEntranceUSD: 0,
    jeepEntranceUSD: 0,
    vatRate: 0.18,
    jeepCapacity: 6,
    fullDayAvailable: false,
    lunchPerPersonUSD: 0
  });

  // Boat
  const [boat, setBoat] = useState(initial?.boat || {
    boatCapacity: 6,
    boatPriceUSD: 0,
    guideFeeUSD: 0
  });

  // Custom (placeholder for validation only)
  const [custom, setCustom] = useState(initial?.custom || { allowZero: false });

  // Reminder
  const [reminder, setReminder] = useState(initial?.reminder || {
    enabled: false,
    daysBefore: 0,
    nextDayAlso: false,
    note: ""
  });

  // City selection
  function toggleCity(id) {
    setAssignedCityIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name,
      description,
      tags: tagsText.split(",").map(t => t.trim()).filter(Boolean),
      pricingType,
      perPerson: pricingType === "PER_PERSON" ? pp : null,
      safari: pricingType === "SAFARI" ? safari : null,
      boat: pricingType === "BOAT" ? boat : null,
      custom: pricingType === "CUSTOM" ? custom : null,
      isOptionalSupplement,
      assignedCityIds,
      reminder
    };

    // CUSTOM: if later price-entry is zero => should block in quotation flow (back-end rule). Here we just pass metadata.
    onSubmit(payload);
  }

  // Small inline preview (sanity check)
  function renderPreview() {
    if (pricingType === "PER_PERSON") {
      const demo = calcPerPersonCost(pp, { infants: 1, children: 1, adults: 2 }, true);
      return <small className="text-gray-600">Demo cost (2A+1C+1I with guide): ${demo}</small>;
    }
    if (pricingType === "SAFARI") {
      const demoHalf = calcSafariCost(safari, { totalGuests: 5 }, false);
      const demoFull = calcSafariCost(safari, { totalGuests: 5 }, true);
      return <small className="text-gray-600">Demo (5 pax): Half ${demoHalf} • Full ${demoFull}</small>;
    }
    if (pricingType === "BOAT") {
      const demo = calcBoatCost(boat, { totalGuests: 8 }, true);
      return <small className="text-gray-600">Demo cost (8 pax with guide): ${demo}</small>;
    }
    if (pricingType === "CUSTOM") return <small className="text-gray-600">Custom-priced at quotation time.</small>;
    if (pricingType === "FREE") return <small className="text-gray-600">Free excursion.</small>;
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input label="Excursion Name" value={name} onChange={setName} />

      <div>
        <label className="block text-xs mb-1">Description</label>
        <textarea
          className="w-full border rounded px-2 py-1.5 text-sm h-20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-xs">Pricing Type</label>
          <select
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value)}
          >
            {PRICING_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* <div>
          <label className="block mb-1 text-xs">Tags</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="family, culture, adventure"
          />
        </div> */}
      </div>

      {/* PER PERSON */}
      {pricingType === "PER_PERSON" && (
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-semibold mb-2">Per Person Pricing</h3>

          <div className="grid grid-cols-5 gap-2 text-xs text-gray-600 mb-1">
            <div>Category</div>
            <div>Age From</div>
            <div>Age To</div>
            <div>Price (USD)</div>
          </div>

          {/* Infant */}
          <div className="grid grid-cols-5 gap-2 items-center">
            <span className="text-sm">Infant</span>
            <input
              className="border rounded px-2 py-1 text-sm"
              value={pp.infantRange[0]}
              onChange={(v) => setPP({ ...pp, infantRange: [+v.target.value, pp.infantRange[1]] })}
            />
            <input
              className="border rounded px-2 py-1 text-sm"
              value={pp.infantRange[1]}
              onChange={(v) => setPP({ ...pp, infantRange: [pp.infantRange[0], +v.target.value] })}
            />
            <input
              className="border rounded px-2 py-1 text-sm"
              value={pp.infantUSD}
              onChange={(v) => setPP({ ...pp, infantUSD: +v.target.value })}
            />
          </div>

          {/* Child */}
          <div className="grid grid-cols-5 gap-2 items-center mt-1">
            <span className="text-sm">Child</span>
            <input className="border rounded px-2 py-1 text-sm"
              value={pp.childRange[0]}
              onChange={(v) => setPP({ ...pp, childRange: [+v.target.value, pp.childRange[1]] })}
            />
            <input className="border rounded px-2 py-1 text-sm"
              value={pp.childRange[1]}
              onChange={(v) => setPP({ ...pp, childRange: [pp.childRange[0], +v.target.value] })}
            />
            <input className="border rounded px-2 py-1 text-sm"
              value={pp.childUSD}
              onChange={(v) => setPP({ ...pp, childUSD: +v.target.value })}
            />
          </div>

          {/* Adult */}
          <div className="grid grid-cols-5 gap-2 items-center mt-1">
            <span className="text-sm">Adult</span>
            <input className="border rounded px-2 py-1 text-sm"
              value={pp.adultFrom}
              onChange={(v) => setPP({ ...pp, adultFrom: +v.target.value })}
            />
            <span className="text-gray-400 text-sm">∞</span>
            <input className="border rounded px-2 py-1 text-sm"
              value={pp.adultUSD}
              onChange={(v) => setPP({ ...pp, adultUSD: +v.target.value })}
            />
          </div>
          {/* Guide Fee */}
          <div className="grid grid-cols-5 gap-2 items-center mt-1">
            <span className="text-sm">Guid Fee</span>
            <span className="text-gray-400 text-sm">-</span>
            <span className="text-gray-400 text-sm"></span>
            <input
              className="border rounded px-2 py-1 text-sm"
              value={pp.guideFeeUSD}
              onChange={(v) => setPP({ ...pp, guideFeeUSD: +v.target.value })}
              placeholder="Optional"
            />
          </div>
        </div>
      )}


      {/* SAFARI */}
      {pricingType === "SAFARI" && (
        <div className="border rounded-md p-3 space-y-2">
          <h3 className="text-sm font-semibold">Safari Pricing</h3>

          <div className="grid grid-cols-3 gap-2">
            <Input label="Jeep Rent (USD)" value={safari.jeepRentUSD} onChange={(v) => setSafari({ ...safari, jeepRentUSD: +v })} />
            <Input label="Entrance / Pax" value={safari.perPersonEntranceUSD} onChange={(v) => setSafari({ ...safari, perPersonEntranceUSD: +v })} />
            <Input label="Jeep Entrance" value={safari.jeepEntranceUSD} onChange={(v) => setSafari({ ...safari, jeepEntranceUSD: +v })} />
          </div>

          <div className="grid grid-cols-3 gap-2 items-end">
            <Input label="VAT Rate" value={safari.vatRate} onChange={(v) => setSafari({ ...safari, vatRate: +v })} disabled={true}/>
            <Input label="Jeep Capacity" value={safari.jeepCapacity} onChange={(v) => setSafari({ ...safari, jeepCapacity: +v })} />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={safari.fullDayAvailable}
                onChange={(e) => setSafari({ ...safari, fullDayAvailable: e.target.checked })}
              />
              Full Day
            </label>
          </div>

          {safari.fullDayAvailable && (
            <Input
              label="Lunch / Pax (USD)"
              value={safari.lunchPerPersonUSD}
              onChange={(v) => setSafari({ ...safari, lunchPerPersonUSD: +v })}
            />
          )}
        </div>
      )}


      {/* BOAT */}
      {pricingType === "BOAT" && (
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-semibold mb-2">Boat Pricing</h3>

          <div className="grid grid-cols-3 gap-2">
            <Input label="Capacity" value={boat.boatCapacity} onChange={(v) => setBoat({ ...boat, boatCapacity: +v })} />
            <Input label="Boat Price (USD)" value={boat.boatPriceUSD} onChange={(v) => setBoat({ ...boat, boatPriceUSD: +v })} />
            <Input label="Guide Fee (USD)" value={boat.guideFeeUSD} onChange={(v) => setBoat({ ...boat, guideFeeUSD: +v })} />
          </div>
        </div>
      )}


      {/* CUSTOM */}
      {pricingType === "CUSTOM" && (
        <div className="">
          <label className="flex items-center gap-2 text-sm">
             Amount
            <Input
              type="input"
              className="col-3"
              checked={custom.allowZero}
              onChange={(e) => setCustom({ ...custom, allowZero: e.target.checked })}
            />
           
          </label>
        </div>
      )}

      {/* Cities */}
      {/* <div className="p-2 border rounded space-y-2">
        <label className="block text-xs font-medium">Assign Cities</label>

        <div className="flex gap-2">
          <select
            className="flex-1 border rounded px-2 py-1.5 text-sm"
            value={citySelect}
            onChange={(e) => setCitySelect(e.target.value)}
          >
            <option value="">Select city</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              if (!citySelect) return;
              const id = Number(citySelect);
              if (!assignedCityIds.includes(id)) {
                setAssignedCityIds([...assignedCityIds, id]);
              }
              setCitySelect("");
            }}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {assignedCityIds.map(id => {
            const city = cities.find(c => c.id === id);
            return (
              <span
                key={id}
                className="px-2 py-1 border rounded text-xs flex items-center gap-1"
              >
                {city?.name}
                <button
                  type="button"
                  onClick={() =>
                    setAssignedCityIds(assignedCityIds.filter(x => x !== id))
                  }
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div> */}


      {/* Flags */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center gap-2">
          Optional Supplement Extra Charge
          <input type="input" className="border rounded px-2 py-1 text-sm" onChange={(e) => setIsOptionalSupplement(e.target.checked)} />
        </label>
        

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={reminder.enabled} onChange={(e) => setReminder({ ...reminder, enabled: e.target.checked })} />
          Enable Reminder
        </label>
      </div>

      {reminder.enabled && (
        <div className="grid grid-cols-3 gap-2">
          <input className="border rounded px-2 py-1 text-sm" label="Days Before" value={reminder.daysBefore} onChange={(v) => setReminder({ ...reminder, daysBefore: +v })} />
          <input className="border rounded px-2 py-1 text-sm" label="Note" value={reminder.note} onChange={(v) => setReminder({ ...reminder, note: v })} />
        </div>
      )}

      <div className="text-xs">{renderPreview()}</div>

      <div className="flex justify-end gap-2 pt-3 border-t">
        <Button variant="outline" size="md" type="button" onClick={onCancel}>Cancel</Button>
        <Button size="md" type="submit">
          {initial ? "Save Changes" : "Add Excursion"}
        </Button>
      </div>

    </form>
  );

}
