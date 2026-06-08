import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { toast } from "sonner";

const MAX_CHILDREN = 20;

export default function ConvertInquiryForm({
  inquiry,
  onSubmit,
  onCancel,
}) {

  const emptyForm = {
    start_date: "",
    days_count: "",
    pax_adults: "",
    children_count: "0",
    pax_children_ages: [],
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

  function updateChildrenCount(value) {
    const count = value === "" ? "" : Number(value);
    const nextCount =
      Number.isInteger(count) && count >= 0 && count <= MAX_CHILDREN
        ? count
        : value;

    setForm((prev) => ({
      ...prev,
      children_count: value,
      pax_children_ages:
        Number.isInteger(nextCount) && nextCount >= 0
          ? Array.from(
              { length: nextCount },
              (_, index) => prev.pax_children_ages[index] || ""
            )
          : prev.pax_children_ages,
    }));

    setErrors((prev) => ({
      ...prev,
      children_count: null,
      pax_children_ages: null,
      childAges: null,
    }));
  }

  function updateChildAge(index, value) {
    setForm((prev) => {
      const ages = [...prev.pax_children_ages];
      ages[index] = value;

      return {
        ...prev,
        pax_children_ages: ages,
      };
    });

    setErrors((prev) => ({
      ...prev,
      pax_children_ages: null,
      childAges: {
        ...prev.childAges,
        [index]: null,
      },
    }));
  }

  /* =============================
     VALIDATION
  ============================== */

  function validate() {

    const e = {};

    const days = Number(form.days_count);
    const adults = Number(form.pax_adults);
    const childrenCount = Number(form.children_count);

    if (!form.start_date) {
      e.start_date = "Start date is required";
    }

    if (!form.days_count || days < 1) {
      e.days_count = "Days count must be at least 1";
    }

    if (!form.pax_adults || adults < 1) {
      e.pax_adults = "At least 1 adult required";
    }

    if (
      form.children_count === "" ||
      !Number.isInteger(childrenCount) ||
      childrenCount < 0 ||
      childrenCount > MAX_CHILDREN
    ) {
      e.children_count = `Children count must be between 0 and ${MAX_CHILDREN}`;
    }

    if (!e.children_count && childrenCount > 0) {
      const childAges = {};

      form.pax_children_ages.forEach((age, index) => {
        const value = Number(age);

        if (age === "" || !Number.isInteger(value) || value < 0 || value > 17) {
          childAges[index] = "Age must be 0 to 17";
        }
      });

      if (Object.keys(childAges).length > 0) {
        e.childAges = childAges;
        e.pax_children_ages = "Add a valid age for each child";
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

      pax_children_ages: form.pax_children_ages.map((age) =>
        Number(age)
      ),

      created_by: 1,
    };

    onSubmit(payload);
  }

  /* =============================
     UI
  ============================== */

  const childrenCount = Number(form.children_count);
  const showChildrenAges =
    Number.isInteger(childrenCount) &&
    childrenCount > 0 &&
    childrenCount <= MAX_CHILDREN;
  const childrenLabel =
    form.pax_children_ages.length === 1 ? "child" : "children";

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
        label="Children"
        type="number"
        min="0"
        max={MAX_CHILDREN}
        value={form.children_count}
        error={errors.children_count}
        onChange={updateChildrenCount}
      />

      {showChildrenAges && (
        <div className="rounded-lg border border-input bg-muted/20 p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Children Ages
              </p>
              <p className="text-xs text-muted-foreground">
                Add one age for each child. Ages should be 0 to 17.
              </p>
            </div>

            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {form.pax_children_ages.length} {childrenLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {form.pax_children_ages.map((age, index) => (
              <Input
                key={index}
                label={`Child ${index + 1} Age`}
                type="number"
                min="0"
                max="17"
                value={age}
                error={errors.childAges?.[index]}
                onChange={(v) => updateChildAge(index, v)}
              />
            ))}
          </div>

          {errors.pax_children_ages && (
            <p className="mt-3 text-xs text-destructive">
              {errors.pax_children_ages}
            </p>
          )}
        </div>
      )}

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
