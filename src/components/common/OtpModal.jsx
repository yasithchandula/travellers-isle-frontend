import { useState } from "react";
import Button from "./Button";

export default function OTPModal({ open, onClose, onVerify }) {
  const [val, setVal] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-80 shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Enter OTP</h3>
        <p className="text-sm mb-3">Ask admin to authorize the download.</p>

        <input
          className="border rounded w-full px-3 py-2 mb-4"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Enter OTP"
        />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onVerify(val)}>Verify</Button>
        </div>
      </div>
    </div>
  );
}
