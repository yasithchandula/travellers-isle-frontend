import Input from "../../../../components/common/Input";

export default function CostMisc({
  misc,
  margin,
  bankCharge,
  tt,
  onChange,
}) {

  function update(patch) {
    onChange({
      misc,
      margin,
      bankCharge,
      tt,
      ...patch,
    });
  }

  return (
    <div className="flex flex-col gap-4">

      {/* MISC EXPENSES */}
      <Input
        label="Miscellaneous Cost (USD)"
        type="number"
        value={misc}
        onChange={(v) => update({ misc: Number(v) })}
      />

      {/* MARGIN */}
      <div>
        <label className="font-medium">Travellers Isle Margin</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={margin}
          onChange={(e) => update({ margin: Number(e.target.value) })}
        >
          <option value={25}>25% (Default)</option>
          <option value={20}>20% (Special Offer)</option>
        </select>
      </div>

      {/* BANK CHARGES */}
      <div>
        <label className="font-medium">TT Transfer Enabled?</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={tt ? "yes" : "no"}
          onChange={(e) =>
            update({
              tt: e.target.value === "yes",
              bankCharge: e.target.value === "yes" ? 0 : 3.2,
            })
          }
        >
          <option value="no">No (Apply Bank Charge)</option>
          <option value="yes">Yes (0% Bank Charge)</option>
        </select>
      </div>

      {!tt && (
        <Input
          label="Bank Charge (%)"
          type="number"
          value={bankCharge}
          onChange={(v) => update({ bankCharge: Number(v) })}
        />
      )}

    </div>
  );
}
