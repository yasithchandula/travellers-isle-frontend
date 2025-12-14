import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

export default function InquiryForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone,
      tourDate,
      adults,
      children,
      message,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Name" value={name} onChange={setName} />
      <Input label="Email" value={email} onChange={setEmail} />
      <Input label="Phone" value={phone} onChange={setPhone} />
      <Input label="Tour Date" type="date" value={tourDate} onChange={setTourDate} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Adults" type="number" value={adults} onChange={setAdults} />
        <Input label="Children" type="number" value={children} onChange={setChildren} />
      </div>

      <label className="block mt-3 text-sm text-gray-700">Message</label>
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 h-24"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the inquiry..."
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Inquiry</Button>
      </div>
    </form>
  );
}
