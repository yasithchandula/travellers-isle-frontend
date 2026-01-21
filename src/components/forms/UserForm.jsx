import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { ROLES, USER_STATUSES } from "../../utils/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function UserForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    setName(initial?.display_name || "");
    setEmail(initial?.email || "");
    setRole(initial?.role || "");
    setStatus(initial?.status || "ACTIVE");
    setErrors({});
  }, [initial]);

  function validate() {
    const e = {};

    if (!name.trim())
      e.name = "Display name is required";
    else if (name.trim().length < 3)
      e.name = "Display name must be at least 3 characters";

    if (!email.trim())
      e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email address";

    if (!role)
      e.role = "Role is required";

    if (!status)
      e.status = "Status is required";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("Please fix the highlighted fields");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) return;
    if (!validate()) return;

    await onSubmit({
      display_name: name.trim(),
      email: email.trim(),
      role,
      status,
    });
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Display Name */}
      <Input
        label="Display Name"
        value={name}
        onChange={setName}
        placeholder="Jane Doe"
        error={errors.name}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="jane@company.com"
        error={errors.email}
      />

      {/* Role */}
      <div>
        <label className="block mb-1 text-xs font-medium">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`w-full border rounded px-2 py-1.5 text-sm ${errors.role ? "border-red-500" : ""
            }`}
        >
          <option value="" disabled>
            Select role
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="text-xs text-red-500 mt-1">
            {errors.role}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block mb-1 text-xs font-medium">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`w-full border rounded px-2 py-1.5 text-sm ${errors.status ? "border-red-500" : ""
            }`}
        >
          {USER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Please wait..."
            : isEdit
              ? "Save Changes"
              : "Create User"}
        </Button>
      </div>
    </form>
  );
}
