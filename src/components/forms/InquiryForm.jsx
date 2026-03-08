import { useState } from "react";
import { toast } from "sonner";
import Input from "../common/Input";
import Button from "../common/Button";

export default function InquiryForm({ initial, onSubmit, onCancel }) {
  const [firstName, setFirstName] = useState(initial?.first_name || "");
  const [lastName, setLastName] = useState(initial?.last_name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");

  const [arrivalDate, setArrivalDate] = useState(
    initial?.arrival_date || ""
  );
  const [departureDate, setDepartureDate] = useState(
    initial?.departure_date || ""
  );

  const [adults, setAdults] = useState(initial?.adults || 2);
  const [children, setChildren] = useState(initial?.children || 0);

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

    if (!lastName.trim()) {
      e.lastName = "Last name is required";
    }

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Invalid email address";
    }

    if (!phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{9,15}$/.test(phone)) {
      e.phone = "Invalid phone number";
    }

    if (!arrivalDate) {
      e.arrivalDate = "Arrival date is required";
    }

    if (!departureDate) {
      e.departureDate = "Departure date is required";
    }

    if (
      arrivalDate &&
      departureDate &&
      new Date(arrivalDate) > new Date(departureDate)
    ) {
      e.departureDate = "Departure must be after arrival";
    }

    if (Number(adults) < 1) {
      e.adults = "At least one adult required";
    }

    if (Number(children) < 0) {
      e.children = "Children cannot be negative";
    }

    if (Number(adults) + Number(children) > 50) {
      e.children = "Group size seems too large";
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
      arrival_date: arrivalDate,
      departure_date: departureDate,
      adults: Number(adults),
      children: Number(children),
      notes: notes.trim(),
    });
  }

  /* ======================
     TRIP DAYS CALC
  ====================== */

  const tripDays =
    arrivalDate && departureDate
      ? Math.ceil(
          (new Date(departureDate) - new Date(arrivalDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* NAME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Input
            label="First Name"
            value={firstName}
            onChange={(v) => {
              setFirstName(v);
              if (errors.firstName)
                setErrors((p) => ({ ...p, firstName: null }));
            }}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">
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
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* CONTACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Input
            label="Email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (errors.email)
                setErrors((p) => ({ ...p, email: null }));
            }}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
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
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* DATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Input
            type="date"
            label="Arrival Date"
            value={arrivalDate}
            onChange={(v) => {
              setArrivalDate(v);
              if (errors.arrivalDate)
                setErrors((p) => ({ ...p, arrivalDate: null }));
            }}
            className={errors.arrivalDate ? "border-red-500" : ""}
          />
          {errors.arrivalDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.arrivalDate}
            </p>
          )}
        </div>

        <div>
          <Input
            type="date"
            label="Departure Date"
            value={departureDate}
            onChange={(v) => {
              setDepartureDate(v);
              if (errors.departureDate)
                setErrors((p) => ({ ...p, departureDate: null }));
            }}
            className={errors.departureDate ? "border-red-500" : ""}
          />
          {errors.departureDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.departureDate}
            </p>
          )}
        </div>
      </div>

      {tripDays && (
        <div className="text-sm text-ti-forest font-medium">
          Trip Duration: {tripDays} days
        </div>
      )}

      {/* PAX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Input
            label="Adults"
            type="number"
            value={adults}
            onChange={(v) => {
              setAdults(v);
              if (errors.adults)
                setErrors((p) => ({ ...p, adults: null }));
            }}
            className={errors.adults ? "border-red-500" : ""}
          />
          {errors.adults && (
            <p className="text-xs text-red-500 mt-1">
              {errors.adults}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Children"
            type="number"
            value={children}
            onChange={(v) => {
              setChildren(v);
              if (errors.children)
                setErrors((p) => ({ ...p, children: null }));
            }}
            className={errors.children ? "border-red-500" : ""}
          />
          {errors.children && (
            <p className="text-xs text-red-500 mt-1">
              {errors.children}
            </p>
          )}
        </div>
      </div>

      {/* NOTES */}
      <div>
        <label className="block mb-1 text-xs font-medium">
          Notes
        </label>
        <textarea
          className="w-full border rounded px-2 py-1.5 text-sm h-24 focus:ring-1 focus:ring-ti-teal"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe the inquiry..."
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 pt-3 border-t">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">
          {initial ? "Save Changes" : "Create Inquiry"}
        </Button>
      </div>
    </form>
  );
}