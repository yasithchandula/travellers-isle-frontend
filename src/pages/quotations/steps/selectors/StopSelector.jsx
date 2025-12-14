import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

export default function StopSelector({ open, onClose, selected = [], onApply }) {
  const cities = useSelector((s) => s.cities.items);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(selected);

  const list = useMemo(() => {
    const query = q.toLowerCase().trim();
    return cities
      .filter((c) => c.isStop)
      .filter((c) => !query || c.name.toLowerCase().includes(query) || c.region?.toLowerCase().includes(query));
  }, [cities, q]);

  function toggle(id) {
    setSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <Modal open={open} onClose={onClose} title="Select Stops">
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        placeholder="Search stop…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="max-h-80 overflow-auto grid grid-cols-2 gap-2">
        {list.map((c) => (
          <label
            key={c.id}
            className="flex items-center gap-2 border rounded px-3 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <input type="checkbox" checked={sel.includes(c.id)} onChange={() => toggle(c.id)} />
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-600">{c.region || "—"}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onApply(sel)}>Apply</Button>
      </div>
    </Modal>
  );
}
