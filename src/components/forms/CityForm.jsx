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
    <form onSubmit={handleSubmit}>
      <Input label="City Name" value={name} onChange={setName} />
      <Input label="Country" value={country} onChange={setCountry} />
      <Input label="Region" value={region} onChange={setRegion} />

      <div className="my-3">
        <label className="block mb-1 text-sm">City Type</label>

        <div className="flex gap-4 items-center">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={isDestination}
              onChange={(e) => setIsDestination(e.target.checked)}
            />
            Destination
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={isStop}
              onChange={(e) => setIsStop(e.target.checked)}
            />
            Stop
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? "Save" : "Add City"}</Button>
      </div>
    </form>
  );
}
