import { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";


export default function CustomerForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [allergyText, setAllergyText] = useState("");
  const [celebrationText, setCelebrationText] = useState("");
  const [allergies, setAllergies] = useState(initial?.allergies || []);
  const [celebrations, setCelebrations] = useState(initial?.celebrations || []);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setEmail(initial.email);
      setPhone(initial.phone);
      setAddress(initial.address);
      setAllergies(initial.allergies);
      setCelebrations(initial.celebrations);
    }
  }, [initial]);

  function addAllergy() {
    if (allergyText.trim()) {
      setAllergies([...allergies, allergyText.trim()]);
      setAllergyText("");
    }
  }
  function addCelebration() {
    if (celebrationText.trim()) {
      setCelebrations([...celebrations, celebrationText.trim()]);
      setCelebrationText("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone,
      address,
      allergies,
      celebrations,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="Name" value={name} onChange={setName} />
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <Input label="Phone" value={phone} onChange={setPhone} />
        <Input label="Address" value={address} onChange={setAddress} />
      </div>

      {/* Allergies */}
      <div className="border rounded p-2 space-y-2">
        <label className="block text-xs font-medium">Allergies</label>

        <div className="flex gap-2">
          <input
            className="border px-2 py-1 rounded w-full text-sm"
            placeholder="Add allergy…"
            value={allergyText}
            onChange={(e) => setAllergyText(e.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={addAllergy}
          >
            Add
          </Button>
        </div>

        {allergies.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {allergies.map((a, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Celebrations */}
      <div className="border rounded p-2 space-y-2">
        <label className="block text-xs font-medium">
          Special Celebrations
        </label>

        <div className="flex gap-2">
          <input
            className="border px-2 py-1 rounded w-full text-sm"
            placeholder="Birthday, Honeymoon…"
            value={celebrationText}
            onChange={(e) => setCelebrationText(e.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={addCelebration}
          >
            Add
          </Button>
        </div>

        {celebrations.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {celebrations.map((c, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button size="md" type="submit">
          {initial ? "Save Changes" : "Create Customer"}
        </Button>
      </div>

    </form>
  );

}
