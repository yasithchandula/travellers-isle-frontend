import { useMemo, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { toast } from "sonner";
import {
  calcPerPersonCost,
  calcSafariCost,
  calcBoatCost,
} from "../../utils/excursionCalc";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

const PRICING_TYPES = ["PER_PERSON", "SAFARI", "BOAT", "CUSTOM", "FREE"];

function FormSection({ title, description, children, contentClassName = "space-y-4" }) {
  return (
    <section className="rounded-lg border bg-muted/20 p-3.5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

export default function ExcursionForm({ initial, cities, onSubmit, onCancel, hideActions = false, }) {
  // ===== Base =====
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
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
  const [hasOptionalSupplement, setHasOptionalSupplement] = useState(
    Number(initial?.optional_supplement_price || 0) > 0
  );
  const [enableReminder, setEnableReminder] = useState(
    !!(initial?.enable_reminder ?? initial?.reminder?.enabled)
  );

  // backend field present in examples (FREE/CUSTOM); safe to send for all
  const [allowZeroAtQuotation, setAllowZeroAtQuotation] = useState(
    !!initial?.allow_zero_at_quotation
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
  const [safariAdultPrice] = useState(
    initial?.adult_price ?? 0
  );
  const [safariChildPrice] = useState(
    initial?.child_price ?? 0
  );
  const [safariInfantPrice] = useState(
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

    if (hasOptionalSupplement && optional_supplement_price <= 0) {
      e.optionalSupplement = "Enter an optional supplement amount";
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
      tags: [],
      city_ids: cityIds.map(Number),
      optional_supplement_price: hasOptionalSupplement
        ? Number(optional_supplement_price)
        : 0,
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
    className="mx-auto max-w-5xl space-y-4"
  >

    {/* ================= BASIC ================= */}
    <FormSection
      title="Excursion Details"
      description="Core details and pricing configuration."
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)_minmax(120px,0.6fr)]">
        <div className="space-y-1.5">
          <Label>Excursion Name</Label>
          <Input value={name} onChange={setName} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Pricing Type</Label>
          <Select value={pricingType} onValueChange={setPricingType}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select pricing type" />
            </SelectTrigger>
            <SelectContent>
              {PRICING_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="LKR">LKR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[76px] resize-y"
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>
    </FormSection>

    {/* ================= PRICING ================= */}
    <FormSection
      title="Pricing"
      description="Only fields relevant to the selected pricing type are shown."
    >

        {pricingType === "PER_PERSON" && (
          <div className="space-y-2.5">

            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
              <div>Category</div>
              <div>Age From</div>
              <div>Age To</div>
              <div>Price</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
              <span>Infant</span>
              <Input value={pp.infant.from} disabled />
              <Input value={pp.infant.to} onChange={(v)=>updateInfantTo(v)} />
              <Input value={infantPrice} onChange={(v)=>setInfantPrice(v)} />
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
              <span>Child</span>
              <Input value={pp.child.from} disabled />
              <Input value={pp.child.to} onChange={(v)=>updateChildTo(v)} />
              <Input value={childPrice} onChange={(v)=>setChildPrice(v)} />
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
              <span>Adult</span>
              <Input value={pp.adult.from} disabled />
              <div className="text-muted-foreground">∞</div>
              <Input value={adultPrice} onChange={(v)=>setAdultPrice(v)} />
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
              <span>Guide Fee</span>
              <div />
              <div />
              <Input value={guideFee} onChange={(v)=>setGuideFee(v)} />
            </div>

          </div>
        )}

        {pricingType === "SAFARI" && (
          <div className="grid gap-3 md:grid-cols-3">
            <Input label="Entrance / Pax" value={entrancePerPax} onChange={(v)=>setEntrancePerPax(toNumberSafe(v))} />
            <Input label="Jeep Rent" value={jeepRentPrice} onChange={(v)=>setJeepRentPrice(+v)} />
            <Input label="Jeep Entrance" value={jeepEntranceFee} onChange={(v)=>setJeepEntranceFee(+v)} />
            <Input label="Capacity" value={jeepCapacity} onChange={(v)=>setJeepCapacity(+v)} />

            <label className="mt-6 flex items-center gap-2 text-sm">
              <Checkbox checked={isFullDay} onCheckedChange={(checked) => setIsFullDay(checked === true)} />
              Full Day
            </label>
          </div>
        )}

        {pricingType === "BOAT" && (
          <div className="grid gap-3 md:grid-cols-3">
            <Input label="Boat Price" value={boatPrice} onChange={(v)=>setBoatPrice(+v)} />
            <Input label="Capacity" value={boatCapacity} onChange={(v)=>setBoatCapacity(+v)} />
            <Input label="Guide Fee" value={guideFee} onChange={(v)=>setGuideFee(+v)} />
          </div>
        )}

        {pricingType === "CUSTOM" && (
          <Input
            label="Custom Amount"
            value={customAmount}
            onChange={(v)=>setCustomAmount(+v)}
          />
        )}

        {pricingType === "FREE" && (
          <p className="text-sm text-muted-foreground">
            Free excursion
          </p>
        )}
    </FormSection>

    {/* ================= CITIES ================= */}
    <FormSection
      title="Available Cities"
      description="Select the destinations where this excursion can be offered."
    >

        <div className="flex gap-2">
          <Select value={citySelect} onValueChange={setCitySelect}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {(cities || []).map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.city || c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" onClick={addCity}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedCities.length ? (
            selectedCities.map((city) => (
              <Badge key={city.id} variant="secondary">
                {city.city || city.name}
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => removeCity(city.id)}
                >
                  ×
                </span>
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">
              No cities selected
            </span>
          )}
        </div>
    </FormSection>

    {/* ================= OPTIONS ================= */}
    <FormSection
      title="Quotation Options"
      description="Optional commercial and operational behavior."
      contentClassName="grid gap-3 md:grid-cols-3"
    >
        <div className="rounded-lg border bg-background p-3">
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              checked={hasOptionalSupplement}
              onCheckedChange={(checked) => setHasOptionalSupplement(checked === true)}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium">Optional supplement</span>
              <span className="block text-xs text-muted-foreground">
                Add an optional extra amount.
              </span>
            </span>
          </label>

          {hasOptionalSupplement && (
            <div className="mt-3">
              <Input
                label={`Amount (${currency})`}
                type="number"
                min="0"
                value={optional_supplement_price}
                onChange={(value) => setOptionalSupplementPrice(+value)}
                error={errors.optionalSupplement}
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-background p-3">
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              checked={enableReminder}
              onCheckedChange={(checked) => setEnableReminder(checked === true)}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium">Reminder</span>
              <span className="block text-xs text-muted-foreground">
                Flag this excursion for follow-up.
              </span>
            </span>
          </label>
        </div>

        <div className="rounded-lg border bg-background p-3">
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              checked={allowZeroAtQuotation}
              onCheckedChange={(checked) => setAllowZeroAtQuotation(checked === true)}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium">Allow zero amount</span>
              <span className="block text-xs text-muted-foreground">
                Permit a zero price during quotation.
              </span>
            </span>
          </label>
        </div>

        <div className="text-xs text-muted-foreground md:col-span-3">
          {renderPreview()}
        </div>
    </FormSection>

    {!hideActions && (
      <div className="flex justify-end gap-2 border-t bg-card pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="min-w-[150px]">
          {initial ? "Save Changes" : "Add Excursion"}
        </Button>
      </div>
    )}

  </form>
);
}
