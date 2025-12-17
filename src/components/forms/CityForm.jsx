import { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";


export default function CityForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [country, setCountry] = useState(initial?.country || "Sri Lanka");
  const [region, setRegion] = useState(initial?.region || "");
  const [isDestination, setIsDestination] = useState(initial?.isDestination || false);
  const [isStop, setIsStop] = useState(initial?.isStop || false);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setCountry(initial.country);
      setRegion(initial.region);
      setIsDestination(initial.isDestination);
      setIsStop(initial.isStop);
    }
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      country,
      region,
      isDestination,
      isStop,
    });
  }

return (
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Main fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input
        label="City Name"
        value={name}
        onChange={setName}
      />

      <Input
        label="Country"
        value={country}
        onChange={setCountry}
      />

      <Input
        label="Region"
        value={region}
        onChange={setRegion}
      />
    </div>

    {/* City Type */}
    <div>
      <label className="block mb-1 text-xs font-medium text-ti-forest">
        City Type
      </label>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isDestination}
            onChange={(e) => setIsDestination(e.target.checked)}
            className="accent-ti-teal"
          />
          Destination
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isStop}
            onChange={(e) => setIsStop(e.target.checked)}
            className="accent-ti-teal"
          />
          Stop
        </label>
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-2 pt-3 border-t">
      <Button
        variant="outline"
        type="button"
        onClick={onCancel}
        size="md"
      >
        Cancel
      </Button>

      <Button type="submit" size="md">
        {initial ? "Save" : "Add City"}
      </Button>
    </div>
  </form>
);


}
