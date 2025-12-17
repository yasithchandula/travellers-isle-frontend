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
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Basic info */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input label="Name" value={name} onChange={setName} />
      <Input label="Email" value={email} onChange={setEmail} />
      <Input label="Phone" value={phone} onChange={setPhone} />
      <Input
        label="Tour Date"
        type="date"
        value={tourDate}
        onChange={setTourDate}
      />
    </div>

    {/* Pax */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input
        label="Adults"
        type="number"
        value={adults}
        onChange={setAdults}
      />
      <Input
        label="Children"
        type="number"
        value={children}
        onChange={setChildren}
      />
    </div>

    {/* Message */}
    <div>
      <label className="block mb-1 text-xs font-medium text-ti-forest">
        Message
      </label>
      <textarea
        className="w-full border border-gray-300 rounded px-2 py-1.5 h-20 text-sm
                   focus:outline-none focus:ring-1 focus:ring-ti-teal"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the inquiry..."
      />
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-2 pt-3 border-t">
      <Button
        variant="outline"
        type="button"
        onClick={onCancel}
        size="md"
      >
        Cancel
      </Button>
      <Button type="submit" size="md">
        Create Inquiry
      </Button>
    </div>
  </form>
);


}
