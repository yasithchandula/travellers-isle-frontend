import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

export default function ExcursionSelector({ open, onClose, selected = [], onApply, limitToCityId = null }) {
  const excursions = useSelector((s) => s.excursions.items);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(selected);

  const list = useMemo(() => {
    const query = q.toLowerCase().trim();
    return excursions
      .filter((e) =>
        !limitToCityId
          ? true
          : (e.assignedCityIds || []).includes(limitToCityId)
      )
      .filter(
        (e) =>
          !query ||
          e.name.toLowerCase().includes(query) ||
          (e.tags || []).some((t) => t.toLowerCase().includes(query))
      );
  }, [excursions, q, limitToCityId]);

  function toggle(id) {
    setSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <Modal open={open} onClose={onClose} title="Select Excursions">
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        placeholder="Search excursions…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="max-h-80 overflow-auto grid grid-cols-2 gap-2">
        {list.map((e) => (
          <label
            key={e.id}
            className="flex items-center gap-2 border rounded px-3 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <input type="checkbox" checked={sel.includes(e.id)} onChange={() => toggle(e.id)} />
            <div>
              <div className="font-medium">{e.name}</div>
              <div className="text-sm text-gray-600">{(e.tags || []).join(", ")}</div>
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
