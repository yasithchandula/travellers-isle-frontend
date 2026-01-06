import { useEffect, useMemo, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import {
  calcPerPersonCost,
  calcSafariCost,
  calcBoatCost,
} from "../../utils/excursionCalc";

const PRICING_TYPES = ["PER_PERSON", "SAFARI", "BOAT", "CUSTOM", "FREE"];

function toTagsText(tags) {
  if (!tags) return "";
  if (Array.isArray(tags)) return tags.join(", ");
  if (typeof tags === "string") return tags;
  return "";
}

export default function ExcursionForm({ initial, cities, onSubmit, onCancel }) {
  // ===== Base =====
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [tagsText, setTagsText] = useState(toTagsText(initial?.tags));
  const [pricingType, setPricingType] = useState(
    initial?.pricing_type || initial?.pricingType || "PER_PERSON"
  );

  const [cityIds, setCityIds] = useState(
    initial?.city_ids || initial?.assignedCityIds || []
  );
  const [citySelect, setCitySelect] = useState("");

  const [isOptionalSupplement, setIsOptionalSupplement] = useState(
    !!(initial?.is_optional_supplement ?? initial?.isOptionalSupplement)
  );
  const [enableReminder, setEnableReminder] = useState(
    !!(initial?.enable_reminder ?? initial?.reminder?.enabled)
  );

  // backend field present in examples (FREE/CUSTOM); safe to send for all
  const [allowZeroAtQuotation, setAllowZeroAtQuotation] = useState(
    !!initial?.allow_zero_at_quotation
  );

  // present in examples (boat/safari/custom/per_person)
  const [infantAgeTo, setInfantAgeTo] = useState(
    initial?.infant_age_to ?? 2
  );
  const [childAgeTo, setChildAgeTo] = useState(
    initial?.child_age_to ?? 11
  );

  // ===== PER_PERSON (flat backend fields) =====
  const [adultPrice, setAdultPrice] = useState(initial?.adult_price ?? 0);
  const [childPrice, setChildPrice] = useState(initial?.child_price ?? 0);
  const [infantPrice, setInfantPrice] = useState(initial?.infant_price ?? 0);
  const [guideFee, setGuideFee] = useState(initial?.guide_fee ?? 0);

  // ===== SAFARI =====
  const [entrancePerPax, setEntrancePerPax] = useState(
    initial?.entrance_per_pax ?? 0
  );
  const [jeepRentPrice, setJeepRentPrice] = useState(
    initial?.jeep_rent_price ?? 0
  );
  const [jeepEntranceFee, setJeepEntranceFee] = useState(
    initial?.jeep_entrance_fee ?? 0
  );
  const [jeepCapacity, setJeepCapacity] = useState(
    initial?.jeep_capacity ?? 6
  );
  const [isFullDay, setIsFullDay] = useState(!!initial?.is_full_day);

  // docs example also sends adult/child/infant_price as 0 for safari.
  // Keep them controllable but default to 0.
  const [safariAdultPrice, setSafariAdultPrice] = useState(
    initial?.adult_price ?? 0
  );
  const [safariChildPrice, setSafariChildPrice] = useState(
    initial?.child_price ?? 0
  );
  const [safariInfantPrice, setSafariInfantPrice] = useState(
    initial?.infant_price ?? 0
  );

  // ===== BOAT =====
  const [boatPrice, setBoatPrice] = useState(initial?.boat_price ?? 0);
  const [boatCapacity, setBoatCapacity] = useState(
    initial?.boat_capacity ?? 6
  );

  // ===== CUSTOM =====
  const [customAmount, setCustomAmount] = useState(
    initial?.adult_price ?? 0
  );

  // ===== Cities helpers =====
  const selectedCities = useMemo(() => {
    const map = new Map((cities || []).map((c) => [Number(c.id), c]));
    return (cityIds || []).map((id) => map.get(Number(id))).filter(Boolean);
  }, [cities, cityIds]);

  function addCity() {
    if (!citySelect) return;
    const id = Number(citySelect);
    setCityIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setCitySelect("");
  }

  function removeCity(id) {
    setCityIds((prev) => prev.filter((x) => Number(x) !== Number(id)));
  }

  // ===== Submit =====
  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name,
      description,
      pricing_type: pricingType,
      tags: tagsText, // backend expects comma string
      city_ids: cityIds.map(Number),
      is_optional_supplement: !!isOptionalSupplement,
      enable_reminder: !!enableReminder,
      allow_zero_at_quotation: !!allowZeroAtQuotation,
      infant_age_to: Number(infantAgeTo),
      child_age_to: Number(childAgeTo),
    };

    if (pricingType === "PER_PERSON") {
      Object.assign(payload, {
        adult_price: Number(adultPrice),
        child_price: Number(childPrice),
        infant_price: Number(infantPrice),
        guide_fee: Number(guideFee),
      });
    }

    if (pricingType === "SAFARI") {
      Object.assign(payload, {
        entrance_per_pax: Number(entrancePerPax),
        jeep_rent_price: Number(jeepRentPrice),
        jeep_entrance_fee: Number(jeepEntranceFee),
        jeep_capacity: Number(jeepCapacity),
        is_full_day: !!isFullDay,

        // keep these because your example includes them (all 0)
        adult_price: Number(safariAdultPrice),
        child_price: Number(safariChildPrice),
        infant_price: Number(safariInfantPrice),
      });
    }

    if (pricingType === "BOAT") {
      Object.assign(payload, {
        boat_price: Number(boatPrice),
        boat_capacity: Number(boatCapacity),
        guide_fee: Number(guideFee),
      });
    }

    if (pricingType === "CUSTOM") {
      Object.assign(payload, {
        adult_price: Number(customAmount),
        // allow_zero_at_quotation already included above
      });
    }

    if (pricingType === "FREE") {
      // only flags; allow_zero_at_quotation already included above
    }

    onSubmit(payload);
  }

  // ===== Preview (kept) =====
  function renderPreview() {
    if (pricingType === "PER_PERSON") {
      const demo = calcPerPersonCost(
        {
          adultUSD: Number(adultPrice),
          childUSD: Number(childPrice),
          infantUSD: Number(infantPrice),
          guideFeeUSD: Number(guideFee),
        },
        { infants: 1, children: 1, adults: 2 },
        true
      );
      return (
        <small className="text-gray-600">
          Demo cost (2A+1C+1I with guide): ${demo}
        </small>
      );
    }

    if (pricingType === "SAFARI") {
      const demo = calcSafariCost(
        {
          jeepRentUSD: Number(jeepRentPrice),
          perPersonEntranceUSD: Number(entrancePerPax),
          jeepEntranceUSD: Number(jeepEntranceFee),
          jeepCapacity: Number(jeepCapacity),
        },
        { totalGuests: 5 },
        !!isFullDay
      );
      return (
        <small className="text-gray-600">
          Demo (5 pax): ${demo} {isFullDay ? "(Full day)" : "(Half day)"}
        </small>
      );
    }

    if (pricingType === "BOAT") {
      const demo = calcBoatCost(
        {
          boatCapacity: Number(boatCapacity),
          boatPriceUSD: Number(boatPrice),
          guideFeeUSD: Number(guideFee),
        },
        { totalGuests: 8 },
        true
      );
      return (
        <small className="text-gray-600">
          Demo cost (8 pax with guide): ${demo}
        </small>
      );
    }

    if (pricingType === "CUSTOM")
      return <small className="text-gray-600">Custom-priced at quotation time.</small>;
    if (pricingType === "FREE")
      return <small className="text-gray-600">Free excursion.</small>;
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
            {PRICING_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-xs">Tags</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="ocean, whale-watching, boat"
          />
        </div>
      </div>

      {/* Global Age Rules (in API examples) */}
      <div className="border rounded-md p-3">
        <h3 className="text-sm font-semibold mb-2">Age Rules</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Infant Age To"
            value={infantAgeTo}
            onChange={(v) => setInfantAgeTo(+v)}
          />
          <Input
            label="Child Age To"
            value={childAgeTo}
            onChange={(v) => setChildAgeTo(+v)}
          />
        </div>
      </div>

      {/* PER PERSON */}
      {pricingType === "PER_PERSON" && (
        <div className="border rounded-md p-3 space-y-2">
          <h3 className="text-sm font-semibold mb-2">Per Person Pricing</h3>

          <div className="grid grid-cols-4 gap-2">
            <Input label="Adult Price (USD)" value={adultPrice} onChange={(v) => setAdultPrice(+v)} />
            <Input label="Child Price (USD)" value={childPrice} onChange={(v) => setChildPrice(+v)} />
            <Input label="Infant Price (USD)" value={infantPrice} onChange={(v) => setInfantPrice(+v)} />
            <Input label="Guide Fee (USD)" value={guideFee} onChange={(v) => setGuideFee(+v)} />
          </div>
        </div>
      )}

      {/* SAFARI */}
      {pricingType === "SAFARI" && (
        <div className="border rounded-md p-3 space-y-2">
          <h3 className="text-sm font-semibold">Safari Pricing</h3>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Entrance / Pax"
              value={entrancePerPax}
              onChange={(v) => setEntrancePerPax(+v)}
            />
            <Input
              label="Jeep Rent Price"
              value={jeepRentPrice}
              onChange={(v) => setJeepRentPrice(+v)}
            />
            <Input
              label="Jeep Entrance Fee"
              value={jeepEntranceFee}
              onChange={(v) => setJeepEntranceFee(+v)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 items-end">
            <Input
              label="Jeep Capacity"
              value={jeepCapacity}
              onChange={(v) => setJeepCapacity(+v)}
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isFullDay}
                onChange={(e) => setIsFullDay(e.target.checked)}
              />
              Full Day
            </label>
          </div>

          {/* Safari optional per-pax prices (your docs example sends them as 0) */}
          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Adult Price (optional)"
              value={safariAdultPrice}
              onChange={(v) => setSafariAdultPrice(+v)}
            />
            <Input
              label="Child Price (optional)"
              value={safariChildPrice}
              onChange={(v) => setSafariChildPrice(+v)}
            />
            <Input
              label="Infant Price (optional)"
              value={safariInfantPrice}
              onChange={(v) => setSafariInfantPrice(+v)}
            />
          </div>
        </div>
      )}

      {/* BOAT */}
      {pricingType === "BOAT" && (
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-semibold mb-2">Boat Pricing</h3>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Boat Price"
              value={boatPrice}
              onChange={(v) => setBoatPrice(+v)}
            />
            <Input
              label="Boat Capacity"
              value={boatCapacity}
              onChange={(v) => setBoatCapacity(+v)}
            />
            <Input
              label="Guide Fee"
              value={guideFee}
              onChange={(v) => setGuideFee(+v)}
            />
          </div>
        </div>
      )}

      {/* CUSTOM */}
      {pricingType === "CUSTOM" && (
        <div className="border rounded-md p-3 space-y-2">
          <h3 className="text-sm font-semibold">Custom Pricing</h3>
          <Input
            label="Amount (USD)"
            value={customAmount}
            onChange={(v) => setCustomAmount(+v)}
          />
          <small className="text-gray-600">
            If you want to allow entering 0 at quotation, enable “Allow Zero at Quotation”.
          </small>
        </div>
      )}

      {/* FREE */}
      {pricingType === "FREE" && (
        <div className="border rounded-md p-3">
          <small className="text-gray-600">
            Free excursion. Use “Allow Zero at Quotation” if quotation flow requires it.
          </small>
        </div>
      )}

      {/* Cities (uncommented + kept same style as your old block) */}
      <div className="p-2 border rounded space-y-2">
        <label className="block text-xs font-medium">Assign Cities</label>

        <div className="flex gap-2">
          <select
            className="flex-1 border rounded px-2 py-1.5 text-sm"
            value={citySelect}
            onChange={(e) => setCitySelect(e.target.value)}
          >
            <option value="">Select city</option>
            {(cities || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.city}
              </option>
            ))}
          </select>

          <Button type="button" size="sm" variant="secondary" onClick={addCity}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedCities.length ? (
            selectedCities.map((city) => (
              <span
                key={city.id}
                className="px-2 py-1 border rounded text-xs flex items-center gap-1"
              >
                {city.city}
                <button
                  type="button"
                  onClick={() => removeCity(city.id)}
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No cities selected</span>
          )}
        </div>
      </div>

      {/* Flags */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isOptionalSupplement}
            onChange={(e) => setIsOptionalSupplement(e.target.checked)}
          />
          Optional Supplement Extra Charge
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enableReminder}
            onChange={(e) => setEnableReminder(e.target.checked)}
          />
          Enable Reminder
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowZeroAtQuotation}
            onChange={(e) => setAllowZeroAtQuotation(e.target.checked)}
          />
          Allow Zero at Quotation
        </label>
      </div>

      <div className="text-xs">{renderPreview()}</div>

      <div className="flex justify-end gap-2 pt-3 border-t">
        <Button variant="outline" size="md" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="md" type="submit">
          {initial ? "Save Changes" : "Add Excursion"}
        </Button>
      </div>
    </form>
  );
}
