import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

export default function DestinationSelector({ open, onClose, onSelect }) {
  const cities = useSelector((s) => s.cities.items);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.toLowerCase().trim();
    return cities
      .filter((c) => c.isDestination)
      .filter((c) => !query || c.name.toLowerCase().includes(query) || c.region?.toLowerCase().includes(query));
  }, [cities, q]);

  return (
    <Modal open={open} onClose={onClose} title="Select Destination">
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        placeholder="Search city…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="max-h-80 overflow-auto grid grid-cols-2 gap-2">
        {list.map((c) => (
          <button
            key={c.id}
            className="text-left border rounded px-3 py-2 hover:bg-gray-50"
            onClick={() => onSelect(c.id)}
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-600">{c.region || "—"}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
