import { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { ROLES, USER_STATUSES } from "../../utils/constants";

export default function UserForm({ initial, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [role, setRole] = useState(initial?.role || "TOUR_EXECUTIVE");
  const [status, setStatus] = useState(initial?.status || "active");
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    setName(initial?.name || "");
    setEmail(initial?.email || "");
    setRole(initial?.role || "TOUR_EXECUTIVE");
    setStatus(initial?.status || "active");
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit({ name: name.trim(), email: email.trim(), role, status });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Full Name" value={name} onChange={setName} placeholder="Jane Doe" />
      <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="jane@company.com" />

      <div className="mb-3">
        <label className="block mb-1 text-sm text-gray-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
        >
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
        >
          {USER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{isEdit ? "Save Changes" : "Create User"}</Button>
      </div>
    </form>
  );
}
