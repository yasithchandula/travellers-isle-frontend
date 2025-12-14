import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useState } from "react";

export default function Step1TourEntry({ data, onChange, next }) {
  const [form, setForm] = useState(data);

  function update(field, value) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange(updated);
  }

  function proceed() {
    if (!form.guestName || !form.tourStart || !form.tourEnd) {
      alert("Fill required fields");
      return;
    }
    next();
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Guest Name" value={form.guestName} onChange={(v)=>update("guestName",v)} />
        <Input label="Email" value={form.email} onChange={(v)=>update("email",v)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input type="date" label="Tour Start" value={form.tourStart} onChange={(v)=>update("tourStart",v)} />
        <Input type="date" label="Tour End" value={form.tourEnd} onChange={(v)=>update("tourEnd",v)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input label="Adults" type="number" value={form.adults} onChange={(v)=>update("adults",Number(v))} />
        <Input
          label="Children (comma-separated ages)"
          value={form.children.join(",")}
          onChange={(v)=>update("children", v.split(",").map(a=>Number(a.trim())))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input label="Tour Type" value={form.tourType} onChange={(v)=>update("tourType",v)} />
        <Input label="Exchange Rate (USD → LKR)" type="number" value={form.exchangeRate} onChange={(v)=>update("exchangeRate",Number(v))} />
      </div>

      <div className="mt-4">
        <label className="text-sm text-gray-600">Tour Number:</label>
        <div className="font-semibold">{form.tourNumber}</div>
      </div>

      <div className="mt-4">
        <label className="text-sm text-gray-600">Submission Date:</label>
        <div className="font-semibold">{form.submissionDate}</div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={proceed}>Next →</Button>
      </div>
    </div>
  );
}
