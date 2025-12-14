import { useState, useEffect } from "react";
import Card from "../../../../components/common/Card";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

export default function OffersPanel({
  grandTotal,
  offers,
  onChange
}) {
  const [local, setLocal] = useState(
    offers || {
      enabled: false,
      offerTitle: "",
      offerNotes: "",
      offerPrice: grandTotal,
      expiryDate: "",
      isB2B: false
    }
  );

  // Sync offerPrice to grandTotal when enabled first time
  useEffect(() => {
    if (!local.enabled) {
      setLocal({ ...local, offerPrice: grandTotal });
      onChange({ ...local, offerPrice: grandTotal });
    }
  }, [grandTotal]);

  function update(patch) {
    const merged = { ...local, ...patch };
    setLocal(merged);
    onChange(merged);
  }

  const discount = local.enabled
    ? Number(grandTotal) - Number(local.offerPrice || 0)
    : 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Activate Offer */}
      <div>
        <label className="font-medium">Enable Special Offer?</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={local.enabled ? "yes" : "no"}
          onChange={(e) =>
            update({ enabled: e.target.value === "yes" })
          }
        >
          <option value="no">No</option>
          <option value="yes">Yes (Add promotional pricing)</option>
        </select>
      </div>

      {local.enabled && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Special Offer Settings</h2>

          {/* OFFER TITLE */}
          <Input
            label="Offer Title (e.g., 'New Year Promo')"
            value={local.offerTitle}
            onChange={(v) => update({ offerTitle: v })}
            placeholder="Example: Valentine Offer"
          />

          {/* OFFER PRICE */}
          <Input
            label="Offer Price (USD)"
            type="number"
            value={local.offerPrice}
            onChange={(v) => update({ offerPrice: Number(v) })}
          />

          {/* EXPIRY */}
          <Input
            label="Offer Expiry Date"
            type="date"
            value={local.expiryDate}
            onChange={(v) => update({ expiryDate: v })}
          />

          {/* OFFER NOTES */}
          <Input
            label="Offer Notes"
            value={local.offerNotes}
            onChange={(v) => update({ offerNotes: v })}
            placeholder="Example: Valid for bookings confirmed before January 30th."
          />

          {/* B2B MODE */}
          <div className="mt-4">
            <label className="font-medium">B2B Mode?</label>
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={local.isB2B ? "yes" : "no"}
              onChange={(e) =>
                update({ isB2B: e.target.value === "yes" })
              }
            >
              <option value="no">No (Show branding / logo)</option>
              <option value="yes">Yes (Remove branding / Word export only)</option>
            </select>
          </div>

          {/* DISCOUNT DISPLAY */}
          <div className="p-4 bg-gray-100 rounded mt-4">
            <div className="font-medium text-sm text-gray-700">
              Regular Price: ${Number(grandTotal).toFixed(2)}
            </div>
            <div className="font-semibold text-lg">
              Offer Price: ${Number(local.offerPrice).toFixed(2)}
            </div>
            <div className="text-green-700 font-medium">
              You Save: ${Number(discount).toFixed(2)}
            </div>
          </div>

        </Card>
      )}
    </div>
  );
}
