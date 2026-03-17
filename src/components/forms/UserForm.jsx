import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ROLES, USER_STATUSES } from "../../utils/constants";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

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

    if (!name.trim()) e.name = "Display name is required";
    else if (name.trim().length < 3)
      e.name = "Display name must be at least 3 characters";

    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email address";

    if (!role) e.role = "Role is required";
    if (!status) e.status = "Status is required";

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
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Display Name */}
      <div className="space-y-2">
        <Label>Display Name</Label>
        <Input
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="jane@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label>Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>

          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.role && (
          <p className="text-xs text-red-500">{errors.role}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {USER_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.status && (
          <p className="text-xs text-red-500">{errors.status}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button disabled={submitting}>
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