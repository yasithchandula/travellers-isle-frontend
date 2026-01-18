import { useEffect, useMemo, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { toast } from "sonner";
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

export default function ExcursionForm({ initial, cities, onSubmit, onCancel, hideActions = false, }) {
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

  const [optional_supplement_price, setOptionalSupplementPrice] = useState(
    initial?.optional_supplement_price || 0
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

  const [currency, setCurrency] = useState(
    initial?.currency || "USD"
  );


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

  const [errors, setErrors] = useState({});


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

  const [pp, setPP] = useState({
    infant: { from: 0, to: 2, price: 0 },
    child: { from: 2, to: 6, price: 8 },
    adult: { from: 6, price: 12 },
    guideFee: 0,
  });

  /* =========================
     LOGIC HELPERS
  ========================== */

  function updateInfantTo(value) {
    const infantTo = Number(value) || 0;

    setPP((prev) => {
      const childFrom = infantTo;
      const childTo = Math.max(prev.child.to, childFrom);
      const adultFrom = childTo;

      return {
        ...prev,
        infant: { ...prev.infant, from: 0, to: infantTo },
        child: { ...prev.child, from: childFrom, to: childTo },
        adult: { ...prev.adult, from: adultFrom },
      };
    });
  }

  function updateChildTo(value) {
    const childTo = Number(value) || 0;

    setPP((prev) => {
      const safeChildTo = Math.max(childTo, prev.child.from);

      return {
        ...prev,
        child: { ...prev.child, to: safeChildTo },
        adult: { ...prev.adult, from: safeChildTo },
      };
    });
  }

  function validate() {
    const e = {};

    if (!name.trim()) e.name = "Excursion name is required";
    else if (name.trim().length < 3)
      e.name = "Name must be at least 3 characters";

    if (!description.trim()) e.description = "Excursion Description is required";

    if (!pricingType) e.pricingType = "Pricing type is required";

    if (pricingType === "PER_PERSON") {
      if (adultPrice <= 0) e.adultPrice = "Adult price cannot be negative";
      if (childPrice <= 0) e.childPrice = "Child price cannot be negative";
      if (infantPrice < 0) e.infantPrice = "Infant price cannot be negative";
    }

    if (pricingType === "SAFARI") {
      if (jeepCapacity < 1) e.jeepCapacity = "Jeep capacity must be at least 1";
      if (jeepRentPrice <= 0) e.jeepRentPrice = "Jeep rent cannot be negative";
      if (entrancePerPax <= 0)
        e.entrancePerPax = "Entrance per pax cannot be negative";
      if (jeepEntranceFee <= 0) e.jeepEntranceFee = 'Jeep entrance per pax cannot be negative'
    }

    if (pricingType === "BOAT") {
      if (boatCapacity <= 0)
        e.boatCapacity = "Boat capacity must be at least 1";
      if (boatPrice <= 0) e.boatPrice = "Boat price cannot be negative";
    }

    if (pricingType === "CUSTOM") {
      if (!allowZeroAtQuotation && customAmount <= 0)
        e.customAmount =
          "Amount must be greater than 0 or enable Allow Zero at Quotation";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function toNumberSafe(v) {
    if (v === "" || v === null || v === undefined) return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }



  // ===== Submit =====
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    const payload = {
      name,
      description,
      pricing_type: pricingType,
      currency: currency,
      tags: tagsText,
      city_ids: cityIds.map(Number),
      optional_supplement_price: optional_supplement_price,
      enable_reminder: !!enableReminder,
      allow_zero_at_quotation: !!allowZeroAtQuotation,
      infant_age_to: Number(pp.infant.to),
      child_age_to: Number(pp.child.to),
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
      });
    }

    try {
      await onSubmit(payload);

      // toast.success(
      //   initial ? "Excursion updated successfully" : "Excursion added successfully",
      //   { id: "excursion" }
      // );
    } catch (err) {
      toast.error(
        err?.message || "Failed to save excursion. Please try again.",
        { id: "excursion" }
      );
    }
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
    <form
      id="excursion-form"
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <Input label="Excursion Name" value={name} onChange={setName} />
      {errors.name && (
        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
      )}

      <div>
        <label className="block text-xs mb-1">Description</label>
        <textarea
          className="w-full border rounded px-2 py-1.5 text-sm h-20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
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
          {errors.pricingType && (
            <p className="text-xs text-red-500 mt-1">{errors.pricingType}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-xs">Currency</label>
          <select
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="LKR">LKR</option>
          </select>
        </div>
      </div>


      {/* Global Age Rules (in API examples) */}
      {/* <div className="border rounded-md p-3">
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
      </div> */}

      {/* PER PERSON */}
      {pricingType === "PER_PERSON" && (
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-semibold mb-3">Per Person Pricing</h3>

          <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-2">
            <div>Category</div>
            <div>Age From</div>
            <div>Age To</div>
            <div>Price (USD)</div>
          </div>

          {/* ================= INFANT ================= */}
          <div className="grid grid-cols-4 gap-2 items-center">
            <span className="text-sm">Infant</span>

            <input
              className="border rounded px-2 py-1 text-sm bg-gray-50"
              value={pp.infant.from}
              disabled
            />

            <input
              className="border rounded px-2 py-1 text-sm"
              type="number"
              min={0}
              value={pp.infant.to}
              onChange={(e) => updateInfantTo(e.target.value)}
            />

            <input
              className="border rounded px-2 py-1 text-sm"
              type="number"
              min={0}
              value={infantPrice}
              onChange={(e) =>
                setInfantPrice(e.target.value)
              }
            />
            {errors.infantPrice && (
              <p className="text-xs text-red-500 mt-1 items-end">{errors.infantPrice}</p>
            )}

            <div />
          </div>

          {/* ================= CHILD ================= */}
          <div className="grid grid-cols-4 gap-2 items-center mt-2">
            <span className="text-sm">Child</span>

            <input
              className="border rounded px-2 py-1 text-sm bg-gray-50"
              value={pp.child.from}
              disabled
            />

            <input
              className="border rounded px-2 py-1 text-sm"
              type="number"
              min={pp.child.from}
              value={pp.child.to}
              onChange={(e) => updateChildTo(e.target.value)}
            />

            <input
              className="border rounded px-2 py-1 text-sm"
              type="number"
              min={0}
              value={childPrice}
              onChange={(e) =>
                setChildPrice(e.target.value)
              }
            />
            <div />
          </div>
          {errors.childPrice && (
            <p className="text-xs text-red-500 text-end">{errors.childPrice}</p>
          )}

          {/* ================= ADULT ================= */}
          <div className="grid grid-cols-4 gap-2 items-center mt-2">
            <span className="text-sm">Adult</span>

            <input
              className="border rounded px-2 py-1 text-sm bg-gray-50"
              value={pp.adult.from}
              disabled
            />

            <span className="text-gray-400 text-sm flex items-center">∞</span>

            <input
              className="border rounded px-2 py-1 text-sm"
              type="number"
              min={0}
              value={adultPrice}
              onChange={(e) =>
                setAdultPrice(e.target.value)
              }
            />
            <div />
          </div>
          {errors.adultPrice && (
            <p className="text-xs text-red-500 text-end">{errors.adultPrice}</p>
          )}

          {/* ================= GUIDE FEE ================= */}
          <div className="grid grid-cols-4 gap-2 items-center mt-2">
            <span className="text-sm">Guide Fee</span>
            <span className="text-gray-400 text-sm">–</span>
            <span className="text-gray-400 text-sm">–</span>

            <input
              className="border rounded px-2 py-1 text-sm"
              type="number"
              min={0}
              value={guideFee}
              onChange={(e) =>
                setGuideFee(e.target.value)
              }
            />

            <div />
          </div>
          {errors.guideFee && (
            <p className="text-xs text-red-500 text-end">{errors.guideFee}</p>
          )}
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
              onChange={(v) => setEntrancePerPax(toNumberSafe(v))}
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
          {errors.entrancePerPax && (
            <p className="text-xs text-red-500 text-end">{errors.entrancePerPax}</p>
          )}
          {errors.jeepRentPrice && (
            <p className="text-xs text-red-500 text-end">{errors.jeepRentPrice}</p>
          )}
          {errors.jeepCapacity && (
            <p className="text-xs text-red-500 text-end">{errors.jeepCapacity}</p>
          )}
          {errors.jeepEntranceFee && (
            <p className="text-xs text-red-500 text-end">{errors.jeepEntranceFee}</p>
          )}

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
          {errors.boatCapacity && (
            <p className="text-xs text-red-500 text-end">{errors.boatCapacity}</p>
          )}
          {errors.boatPrice && (
            <p className="text-xs text-red-500 text-end">{errors.boatPrice}</p>
          )}
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
          {errors.customAmount && (
            <p className="text-xs text-red-500 text-end">{errors.customAmount}</p>
          )}
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
        {errors.cityIds && (
          <p className="text-xs text-red-500 text-end">{errors.cityIds}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Input
          className="col-6"
          label="Optional Supplement extra charge (Per person)"
          type="number"
          value={optional_supplement_price}
          onChange={(v) => setOptionalSupplementPrice(+v)}
        />
      </div>

      {/* Flags */}
      <div className="grid grid-cols-2 gap-3 text-sm">
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

      {!hideActions && (
        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" size="md" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="md" type="submit">
            {initial ? "Save Changes" : "Add Excursion"}
          </Button>
        </div>
      )}

    </form >
  );
}
