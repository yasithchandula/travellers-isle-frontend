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
    <form onSubmit={handleSubmit}>
      <Input label="Name" value={name} onChange={setName} />
      <Input label="Email" type="email" value={email} onChange={setEmail} />
      <Input label="Phone" value={phone} onChange={setPhone} />
      <Input label="Address" value={address} onChange={setAddress} />

      {/* ALLERGIES */}
      <div className="mb-3">
        <label className="block mb-1">Allergies</label>
        <div className="flex gap-2">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Add allergy..."
            value={allergyText}
            onChange={(e) => setAllergyText(e.target.value)}
          />
          <Button variant="secondary" onClick={addAllergy} type="button">Add</Button>
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          {allergies.map((a, i) => (
            <span key={i} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* CELEBRATIONS */}
      <div className="mb-4">
        <label className="block mb-1">Special Celebrations</label>
        <div className="flex gap-2">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Birthday, Honeymoon..."
            value={celebrationText}
            onChange={(e) => setCelebrationText(e.target.value)}
          />
          <Button variant="secondary" type="button" onClick={addCelebration}>Add</Button>
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          {celebrations.map((c, i) => (
            <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit">{initial ? "Save Changes" : "Create Customer"}</Button>
      </div>
    </form>
  );
}
