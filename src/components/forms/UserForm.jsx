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
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Jane Doe"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="jane@company.com"
        />
      </div>

      {/* Role & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm
                     focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm
                     focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
          >
            {USER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
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
        <Button
          type="submit"
          size="md"
          disabled={submitting}
        >
          {isEdit ? "Save Changes" : "Create User"}
        </Button>
      </div>

    </form>
  );

}
