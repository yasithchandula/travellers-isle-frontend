import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { toast } from "sonner";

export default function ConvertInquiryForm({
  inquiry,
  onSubmit,
  onCancel,
}) {

  const emptyForm = {
    start_date: "",
    days_count: "",
    pax_adults: "",
    pax_children_ages: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  /* =============================
     UPDATE FIELD
  ============================== */

  function updateField(field, value) {

    setForm((prev) => ({
      ...prev,
      [field]: value,
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

    const days = Number(form.days_count);
    const adults = Number(form.pax_adults);

    if (!form.start_date) {
      e.start_date = "Start date is required";
    }

    if (!form.days_count || days < 1) {
      e.days_count = "Days count must be at least 1";
    }

    if (!form.pax_adults || adults < 1) {
      e.pax_adults = "At least 1 adult required";
    }

    /* Validate children ages format */

    if (form.pax_children_ages) {

      const ages = form.pax_children_ages
        .split(",")
        .map((n) => n.trim());

      const invalid = ages.some(
        (a) => isNaN(Number(a)) || Number(a) < 0 || Number(a) > 17
      );

      if (invalid) {
        e.pax_children_ages =
          "Children ages must be numbers between 0–17 (comma separated)";
      }
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  /* =============================
     SUBMIT
  ============================== */

  function handleSubmit(e) {

    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix form errors");
      return;
    }

    const payload = {
      inquiry_id: inquiry?.id,

      start_date: form.start_date,

      days_count: Number(form.days_count),

      pax_adults: Number(form.pax_adults),

      pax_children_ages: form.pax_children_ages
        ? form.pax_children_ages
            .split(",")
            .map((n) => Number(n.trim()))
        : [],

      created_by: 1,
    };

    onSubmit(payload);
  }

  /* =============================
     UI
  ============================== */

  return (
    <form
      id="convert-inquiry-form"
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* START DATE */}

      <Input
        label="Start Date"
        type="date"
        value={form.start_date}
        error={errors.start_date}
        onChange={(v) =>
          updateField("start_date", v)
        }
      />

      {/* DAYS */}

      <Input
        label="Days Count"
        type="number"
        value={form.days_count}
        error={errors.days_count}
        onChange={(v) =>
          updateField("days_count", v)
        }
      />

      {/* ADULTS */}

      <Input
        label="Adults"
        type="number"
        value={form.pax_adults}
        error={errors.pax_adults}
        onChange={(v) =>
          updateField("pax_adults", v)
        }
      />

      {/* CHILDREN AGES */}

      <Input
        label="Children Ages"
        placeholder="Example: 5,8,12"
        value={form.pax_children_ages}
        error={errors.pax_children_ages}
        onChange={(v) =>
          updateField("pax_children_ages", v)
        }
      />

      {/* ACTIONS */}

      <div className="flex justify-end gap-2 border-t bg-card pt-4">

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit" className="min-w-[150px]">
          Create Quotation
        </Button>

      </div>

    </form>
  );
}
