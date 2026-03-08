import { useState, useEffect } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

export default function InquiryForm({
  initial,
  onSubmit,
  onCancel,
  hideActions = false,
}) {
  const emptyForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    arrival_date: "",
    departure_date: "",
    adults: 2,
    children: 0,
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  /* =============================
     EDIT MODE HYDRATION
  ============================== */

  useEffect(() => {
    if (!initial) {
      setForm(emptyForm);
      setErrors({});
      return;
    }

    setForm({
      first_name: initial.first_name || "",
      last_name: initial.last_name || "",
      email: initial.email || "",
      phone: initial.phone || "",
      arrival_date: initial.arrival_date || "",
      departure_date: initial.departure_date || "",
      adults: initial.adults ?? 2,
      children: initial.children ?? 0,
      notes: initial.notes || "",
    });

    setErrors({});
  }, [initial]);

  /* =============================
     UPDATE FIELD
  ============================== */

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value.trimStart() : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  }

  /* =============================
     VALIDATION
  ============================== */

  function validate() {
    const e = {};

    /* ---------- NAME ---------- */

    if (!form.first_name || form.first_name.trim().length < 2) {
      e.first_name = "First name must contain at least 2 characters";
    }

    if (!form.last_name || form.last_name.trim().length < 2) {
      e.last_name = "Last name must contain at least 2 characters";
    }

    /* ---------- EMAIL ---------- */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email || !emailRegex.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    /* ---------- PHONE ---------- */

    const phoneRegex =
      /^\+?[0-9]{9,15}$/;

    if (!form.phone || !phoneRegex.test(form.phone)) {
      e.phone =
        "Enter a valid phone number (9–15 digits)";
    }

    /* ---------- DATES ---------- */

    if (!form.arrival_date) {
      e.arrival_date = "Arrival date is required";
    }

    if (!form.departure_date) {
      e.departure_date = "Departure date is required";
    }

    if (
      form.arrival_date &&
      form.departure_date &&
      new Date(form.arrival_date) >
        new Date(form.departure_date)
    ) {
      e.departure_date =
        "Departure date must be after arrival date";
    }

    /* ---------- PAX ---------- */

    const adults = Number(form.adults);
    const children = Number(form.children);

    if (!Number.isInteger(adults) || adults < 1) {
      e.adults = "At least 1 adult required";
    }

    if (!Number.isInteger(children) || children < 0) {
      e.children = "Children cannot be negative";
    }

    if (adults + children > 50) {
      e.children =
        "Group size seems too large (max 50)";
    }

    /* ---------- NOTES ---------- */

    if (form.notes && form.notes.length > 1000) {
      e.notes =
        "Notes cannot exceed 1000 characters";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  /* =============================
     SUBMIT
  ============================== */

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      arrival_date: form.arrival_date,
      departure_date: form.departure_date,
      adults: Number(form.adults),
      children: Number(form.children),
      notes: form.notes?.trim() || "",
    };

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* NAME */}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          value={form.first_name}
          error={errors.first_name}
          onChange={(v) =>
            updateField("first_name", v)
          }
        />

        <Input
          label="Last Name"
          value={form.last_name}
          error={errors.last_name}
          onChange={(v) =>
            updateField("last_name", v)
          }
        />
      </div>

      {/* CONTACT */}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Email"
          value={form.email}
          error={errors.email}
          onChange={(v) =>
            updateField("email", v)
          }
        />

        <Input
          label="Phone"
          value={form.phone}
          error={errors.phone}
          onChange={(v) =>
            updateField("phone", v)
          }
        />
      </div>

      {/* DATES */}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Arrival Date"
          type="date"
          value={form.arrival_date}
          error={errors.arrival_date}
          onChange={(v) =>
            updateField("arrival_date", v)
          }
        />

        <Input
          label="Departure Date"
          type="date"
          value={form.departure_date}
          error={errors.departure_date}
          onChange={(v) =>
            updateField("departure_date", v)
          }
        />
      </div>

      {/* PAX */}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Adults"
          type="number"
          value={form.adults}
          error={errors.adults}
          onChange={(v) =>
            updateField("adults", v)
          }
        />

        <Input
          label="Children"
          type="number"
          value={form.children}
          error={errors.children}
          onChange={(v) =>
            updateField("children", v)
          }
        />
      </div>

      {/* NOTES */}

      <div>
        <label className="block mb-1 text-xs font-medium text-ti-forest">
          Notes
        </label>

        <textarea
          value={form.notes}
          onChange={(e) =>
            updateField("notes", e.target.value)
          }
          className="w-full border rounded px-3 py-2 text-sm h-24
                     focus:outline-none focus:ring-1 focus:ring-ti-teal"
          placeholder="Describe the inquiry..."
        />

        {errors.notes && (
          <p className="text-xs text-red-600 mt-1">
            {errors.notes}
          </p>
        )}
      </div>

      {/* ACTIONS */}

      {!hideActions && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button type="submit">
            {initial
              ? "Update Inquiry"
              : "Create Inquiry"}
          </Button>
        </div>
      )}
    </form>
  );
}