import { useMemo, useState } from "react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

export default function Step1TourEntry({
  data,
  onChange,
  next,
  customers = [],
}) {
  const [form, setForm] = useState({
    customerId: data?.customerId ?? "",
    guestName: data?.guestName ?? "",
    email: data?.email ?? "",
    tourStart: data?.tourStart ?? "",
    days: Number(data?.days ?? 1),         
    adults: Number(data?.adults ?? 1),
    children: data?.children ?? [],
    tourNumber: data?.tourNumber ?? "",
    submissionDate: data?.submissionDate ?? "",
  });

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  function update(field, value) {
    const updated = {
      ...form,
      [field]:
        field === "days" || field === "adults"
          ? Number(value)                
          : value,
    };

    setForm(updated);
    onChange(updated);                   
  }

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, customers]);

  function selectCustomer(c) {
    const updated = {
      ...form,
      customerId: c.id,
      guestName: c.name,
      email: c.email || "",
    };
    setForm(updated);
    onChange(updated);
    setSearch(c.name);
    setShowDropdown(false);
  }

  function proceed() {

    if (!form.tourStart) {
      alert("Please select tour start date");
      return;
    }

    if (!Number.isInteger(form.days) || form.days <= 0) {
      alert("Days must be at least 1");
      return;
    }

    onChange({
      ...form,
      days: Number(form.days),
      adults: Number(form.adults),
    });
    console.log("STEP1 SUBMIT:", {
      ...form,
      days: Number(form.days),
      adults: Number(form.adults),
    });
    next();
  }

  return (
    <Card>
      {/* Customer search */}
      <div className="relative">
        <Input
          label="Customer *"
          placeholder="Search customer..."
          value={search}
          onChange={(v) => {
            setSearch(v);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && filteredCustomers.length > 0 && (
          <div className="absolute z-20 w-full bg-white border rounded-md shadow mt-1 max-h-48 overflow-y-auto">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => selectCustomer(c)}
              >
                <div className="font-medium">{c.name}</div>
                {c.email && (
                  <div className="text-xs text-gray-500">{c.email}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guest & Email */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input
          label="Guest Name"
          value={form.guestName}
          onChange={(v) => update("guestName", v)}
        />
        <Input
          label="Email"
          value={form.email}
          onChange={(v) => update("email", v)}
        />
      </div>

      {/* Start date & Days */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input
          type="date"
          label="Tour Start *"
          value={form.tourStart}
          onChange={(v) => update("tourStart", v)}
        />
        <Input
          type="number"
          label="How many days? *"
          min={1}
          value={form.days}
          onChange={(v) => update("days", v)}
        />
      </div>

      {/* Pax */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input
          label="Adults"
          type="number"
          min={1}
          value={form.adults}
          onChange={(v) => update("adults", v)}
        />
        <Input
          label="Children (comma-separated ages)"
          value={form.children.join(",")}
          onChange={(v) =>
            update(
              "children",
              v
                .split(",")
                .map((a) => Number(a.trim()))
                .filter((n) => !isNaN(n))
            )
          }
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-6">
        <Button onClick={proceed}>Next →</Button>
      </div>
    </Card>
  );
}
