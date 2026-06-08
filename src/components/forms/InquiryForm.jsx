import { useState } from "react";
import { toast } from "sonner";
import Input from "../common/Input";
import Button from "../common/Button";

export default function InquiryForm({ initial, onSubmit, onCancel }) {
  const [firstName, setFirstName] = useState(initial?.first_name || "");
  const [lastName, setLastName] = useState(initial?.last_name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  const [errors, setErrors] = useState({});

  /* ======================
     VALIDATION
  ====================== */

  function validate() {
    const e = {};

    if (!firstName.trim()) {
      e.firstName = "First name is required";
    }

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Invalid email address";
    }

    if (phone.trim() && !/^\+?[0-9]{9,15}$/.test(phone)) {
      e.phone = "Invalid phone number";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ======================
     SUBMIT
  ====================== */

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    onSubmit({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* NAME */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Input
            label="First Name"
            value={firstName}
            onChange={(v) => {
              setFirstName(v);
              if (errors.firstName)
                setErrors((p) => ({ ...p, firstName: null }));
            }}
            className={errors.firstName ? "border-destructive" : ""}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-destructive">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Last Name"
            value={lastName}
            onChange={(v) => {
              setLastName(v);
              if (errors.lastName)
                setErrors((p) => ({ ...p, lastName: null }));
            }}
            className={errors.lastName ? "border-destructive" : ""}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-destructive">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* CONTACT */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Input
            label="Email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (errors.email)
                setErrors((p) => ({ ...p, email: null }));
            }}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Phone"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (errors.phone)
                setErrors((p) => ({ ...p, phone: null }));
            }}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-destructive">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* NOTES */}
      <div>
        <label className="block mb-1 text-xs font-medium">
          Tour Description
        </label>
        <textarea
          className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe the tour..."
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 border-t bg-card pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" className="min-w-[140px]">
          {initial ? "Save Changes" : "Create Inquiry"}
        </Button>
      </div>
    </form>
  );
}
