import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

/*
standardDescriptions format example:
{
  id: 1,
  title: "Sigiriya to Kandy – 2 Days",
  days: [
    { day:1, destinationId: 5, stops:[4], excursions:[2,3], description:"..." },
    { day:2, destinationId: 7, stops:[],  excursions:[6], description:"..." }
  ]
}
*/

export default function DuplicateStandardModal({ open, onClose, onApply }) {

  const std = useSelector((s) => s.standardDescriptions?.items || []);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.toLowerCase().trim();
    return std.filter((t) =>
      !query
        ? true
        : t.title.toLowerCase().includes(query) ||
          (t.tags || []).some((k) => k.toLowerCase().includes(query))
    );
  }, [std, q]);

  return (
    <Modal open={open} onClose={onClose} title="Duplicate Standard Itinerary">
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        placeholder="Search template…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="max-h-80 overflow-auto flex flex-col gap-3">
        {list.map((t) => (
          <div
            key={t.id}
            className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => onApply(t.days)}
          >
            <div className="font-semibold">{t.title}</div>
            {(t.tags || []).length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                Tags: {(t.tags || []).join(", ")}
              </div>
            )}
          </div>
        ))}

        {list.length === 0 && (
          <div className="text-center text-gray-500 py-10">No matches found.</div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
