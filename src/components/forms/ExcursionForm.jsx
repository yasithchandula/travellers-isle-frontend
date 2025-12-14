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
    <form onSubmit={handleSubmit}>
      <Input label="Excursion Name" value={name} onChange={setName} />
      <label className="block text-sm text-gray-700 mb-1">Description</label>
      <textarea className="w-full border rounded px-3 py-2 mb-3" value={description} onChange={(e)=>setDescription(e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Pricing Type</label>
          <select className="w-full border rounded px-3 py-2" value={pricingType} onChange={(e)=>setPricingType(e.target.value)}>
            {PRICING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Tags (comma separated)</label>
          <input className="w-full border rounded px-3 py-2" value={tagsText} onChange={(e)=>setTagsText(e.target.value)} placeholder="family, culture, adventure" />
        </div>
      </div>

      {/* Conditional sections */}
      {pricingType === "PER_PERSON" && (
        <div className="my-3 p-3 border rounded">
          <h3 className="font-semibold mb-2">Per Person Pricing</h3>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Infant range (from)" value={pp.infantRange[0]} onChange={(v)=>setPP({...pp, infantRange:[Number(v), pp.infantRange[1]]})} />
            <Input label="Infant range (to)" value={pp.infantRange[1]} onChange={(v)=>setPP({...pp, infantRange:[pp.infantRange[0], Number(v)]})} />
            <Input label="Infant USD" value={pp.infantUSD} onChange={(v)=>setPP({...pp, infantUSD:Number(v)})} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Child range (from)" value={pp.childRange[0]} onChange={(v)=>setPP({...pp, childRange:[Number(v), pp.childRange[1]]})} />
            <Input label="Child range (to)" value={pp.childRange[1]} onChange={(v)=>setPP({...pp, childRange:[pp.childRange[0], Number(v)]})} />
            <Input label="Child USD" value={pp.childUSD} onChange={(v)=>setPP({...pp, childUSD:Number(v)})} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Adult from (age)" value={pp.adultFrom} onChange={(v)=>setPP({...pp, adultFrom:Number(v)})} />
            <Input label="Adult USD" value={pp.adultUSD} onChange={(v)=>setPP({...pp, adultUSD:Number(v)})} />
            <Input label="Guide Fee USD (optional)" value={pp.guideFeeUSD} onChange={(v)=>setPP({...pp, guideFeeUSD:Number(v)})} />
          </div>
        </div>
      )}

      {pricingType === "SAFARI" && (
        <div className="my-3 p-3 border rounded">
          <h3 className="font-semibold mb-2">Safari Pricing</h3>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Jeep Rent USD" value={safari.jeepRentUSD} onChange={(v)=>setSafari({...safari, jeepRentUSD:Number(v)})} />
            <Input label="Per Person Entrance USD" value={safari.perPersonEntranceUSD} onChange={(v)=>setSafari({...safari, perPersonEntranceUSD:Number(v)})} />
            <Input label="Jeep Entrance USD" value={safari.jeepEntranceUSD} onChange={(v)=>setSafari({...safari, jeepEntranceUSD:Number(v)})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="VAT Rate (0.18 = 18%)" value={safari.vatRate} onChange={(v)=>setSafari({...safari, vatRate:Number(v)})} />
            <Input label="Jeep Capacity" value={safari.jeepCapacity} onChange={(v)=>setSafari({...safari, jeepCapacity:Number(v)})} />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={safari.fullDayAvailable} onChange={(e)=>setSafari({...safari, fullDayAvailable:e.target.checked})} />
                Full Day Available
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Lunch per Person (Full Day) USD" value={safari.lunchPerPersonUSD} onChange={(v)=>setSafari({...safari, lunchPerPersonUSD:Number(v)})} />
          </div>
        </div>
      )}

      {pricingType === "BOAT" && (
        <div className="my-3 p-3 border rounded">
          <h3 className="font-semibold mb-2">Boat Pricing</h3>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Boat Capacity" value={boat.boatCapacity} onChange={(v)=>setBoat({...boat, boatCapacity:Number(v)})} />
            <Input label="Boat Price USD" value={boat.boatPriceUSD} onChange={(v)=>setBoat({...boat, boatPriceUSD:Number(v)})} />
            <Input label="Guide Fee USD (optional)" value={boat.guideFeeUSD} onChange={(v)=>setBoat({...boat, guideFeeUSD:Number(v)})} />
          </div>
        </div>
      )}

      {pricingType === "CUSTOM" && (
        <div className="my-3 p-3 border rounded">
          <h3 className="font-semibold mb-2">Custom Pricing</h3>
          <label className="flex items-center gap-2">
            <input type="checkbox"
              checked={custom.allowZero}
              onChange={(e)=>setCustom({...custom, allowZero: e.target.checked})}
            />
            Allow zero at quotation time (otherwise block continuation)
          </label>
        </div>
      )}

      {/* Assignment to Cities */}
      <div className="my-3 p-3 border rounded">
        <h3 className="font-semibold mb-2">Assign to Destinations / Stops</h3>
        <div className="flex flex-wrap gap-2">
          {cities.map(c => (
            <label key={c.id} className="px-3 py-1 border rounded cursor-pointer flex items-center gap-2">
              <input type="checkbox" checked={assignedCityIds.includes(c.id)} onChange={()=>toggleCity(c.id)} />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {/* Optional supplement & reminder */}
      <div className="grid grid-cols-2 gap-4 my-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isOptionalSupplement} onChange={(e)=>setIsOptionalSupplement(e.target.checked)} />
          Mark as Optional Supplement
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={reminder.enabled} onChange={(e)=>setReminder({...reminder, enabled:e.target.checked})} />
          Enable Reminder (pre-booking)
        </label>
      </div>

      {reminder.enabled && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Input label="Days Before (email batch)" value={reminder.daysBefore} onChange={(v)=>setReminder({...reminder, daysBefore:Number(v)})} />
          <label className="flex items-end gap-2">
            <input type="checkbox" checked={reminder.nextDayAlso} onChange={(e)=>setReminder({...reminder, nextDayAlso:e.target.checked})} />
            Include Next-Day Reminder
          </label>
          <Input label="Reminder Note" value={reminder.note} onChange={(v)=>setReminder({...reminder, note:v})} />
        </div>
      )}

      {/* Preview */}
      <div className="mt-2">{renderPreview()}</div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? "Save Changes" : "Add Excursion"}</Button>
      </div>
    </form>
  );
}
