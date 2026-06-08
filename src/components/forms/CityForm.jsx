import { useState } from "react";
import { toast } from "sonner";
import Input from "../common/Input";
import Button from "../common/Button";

export default function CityForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.city || "");
  const [country, setCountry] = useState(initial?.country || "Sri Lanka");
  const [code, setCode] = useState(initial?.code || "");
  const [isDestination, setIsDestination] = useState(
    initial?.isDestination ?? initial?.is_destination ?? 1
  );
  const [isStop, setIsStop] = useState(
    initial?.isStop ?? initial?.is_stop ?? 1
  );

  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (!initial) return;

  //   setName(initial.city || "");
  //   setCountry(initial.country || "Sri Lanka");
  //   setRegion(initial.region || "");
  //   setIsDestination(
  //     initial.isDestination ?? initial.is_destination ?? 1
  //   );
  //   setIsStop(
  //     initial.isStop ?? initial.is_stop ?? 1
  //   );
  // }, [initial]);

  /* =========================
     VALIDATION
  ========================== */
  function validate() {
    const e = {};

    const trimmedName = name.replace(/\s+/g, " ").trim();
    const trimmedCountry = country.trim();
    const trimmedCode = code.trim();
    // const trimmedRegion = region.trim();

    if (!trimmedName) e.name = "City name is required";
    if (!trimmedCountry) e.country = "Country is required";
    if (!trimmedCode) e.code = "Code is required";
    // if (!trimmedRegion) e.region = "Region is required";

    if (!isDestination && !isStop) {
      e.cityType = "Select at least one city type";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    onSubmit({
      name: name.replace(/\s+/g, " ").trim(),
      country: country.trim(),
      code: code.trim(),
      isDestination,
      isStop,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Input
            label="City Name"
            value={name}
            onChange={(v) => {
              setName(v);
              if (errors.name) setErrors((p) => ({ ...p, name: null }));
            }}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div>
          <Input
            label="Country"
            value={country}
            onChange={(v) => {
              setCountry(v);
              if (errors.country)
                setErrors((p) => ({ ...p, country: null }));
            }}
            className={errors.country ? "border-destructive" : ""}
          />
          {errors.country && (
            <p className="mt-1 text-xs text-destructive">{errors.country}</p>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div>
          <Input
            label="Code"
            value={code}
            onChange={(v) => {
              setCode(v);
              if (errors.code)
                setErrors((p) => ({ ...p, code: null }));
            }}
            className={errors.code ? "border-destructive" : ""}
          />
          {errors.code && (
            <p className="mt-1 text-xs text-destructive">{errors.code}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/20 p-4">
        <label className="mb-1 block text-xs font-medium text-foreground">
          City Type
        </label>

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isDestination}
              onChange={(e) => {
                setIsDestination(Number(e.target.checked));
                if (errors.cityType)
                  setErrors((p) => ({ ...p, cityType: null }));
              }}
              className="accent-primary"
            />
            Destination
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isStop}
              onChange={(e) => {
                setIsStop(Number(e.target.checked));
                if (errors.cityType)
                  setErrors((p) => ({ ...p, cityType: null }));
              }}
              className="accent-primary"
            />
            Stop
          </label>
        </div>

        {errors.cityType && (
          <p className="mt-3 text-xs text-destructive">
            {errors.cityType}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t bg-card pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit" className="min-w-[120px]">
          {initial ? "Save" : "Add City"}
        </Button>
      </div>
    </form>
  );
}
