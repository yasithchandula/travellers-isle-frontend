import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";

import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

export default function DuplicateQuotationModal({ open, onClose, onApply }) {
  const quotations = useSelector((s) => s.quotations.items);
  const excursions = useSelector((s) => s.excursions.items);

  const [filters, setFilters] = useState({
    month: "",
    duration: "",
    adults: "",
    children: "",
    category: "",
    excursionIds: [],
    searchTerm: "",
  });

  function update(field, val) {
    setFilters({ ...filters, [field]: val });
  }

  const filtered = useMemo(() => {
    const q = filters.searchTerm.toLowerCase().trim();

    return quotations.filter((qt) => {
      // Month filter
      if (filters.month && !qt.tourStart.startsWith(filters.month)) return false;

      // Duration filter
      if (filters.duration && qt.duration !== Number(filters.duration))
        return false;

      // Pax filters
      if (filters.adults && qt.adults !== Number(filters.adults)) return false;
      if (filters.children && qt.children !== Number(filters.children))
        return false;

      // Category
      if (filters.category && qt.tourType !== filters.category) return false;

      // Excursions filter
      if (filters.excursionIds.length > 0) {
        const ex = qt.itinerary.flatMap((d) => d.excursions);
        if (!filters.excursionIds.every((id) => ex.includes(id))) return false;
      }

      // Free-text search
      if (
        q &&
        !(
          qt.tourNumber.toLowerCase().includes(q) ||
          qt.guestName.toLowerCase().includes(q) ||
          qt.notes?.toLowerCase().includes(q)
        )
      )
        return false;

      return true;
    });
  }, [filters, quotations]);

  function toggleExcursion(id) {
    const ex = filters.excursionIds;
    update(
      "excursionIds",
      ex.includes(id) ? ex.filter((x) => x !== id) : [...ex, id]
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Duplicate Previous Quotation">
      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Input
          label="Month"
          type="month"
          value={filters.month}
          onChange={(v) => update("month", v)}
        />
        <Input
          label="Duration (nights)"
          type="number"
          value={filters.duration}
          onChange={(v) => update("duration", v)}
        />
        <Input
          label="Adults"
          type="number"
          value={filters.adults}
          onChange={(v) => update("adults", v)}
        />
        <Input
          label="Children"
          type="number"
          value={filters.children}
          onChange={(v) => update("children", v)}
        />
        <Input
          label="Category"
          value={filters.category}
          onChange={(v) => update("category", v)}
        />
        <Input
          label="Search Text"
          value={filters.searchTerm}
          onChange={(v) => update("searchTerm", v)}
        />
      </div>

      {/* Excursion checklist */}
      <div className="border rounded p-2 max-h-40 overflow-auto mb-4">
        <div className="font-medium mb-1">Filter by Excursions:</div>
        {excursions.map((ex) => (
          <label key={ex.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.excursionIds.includes(ex.id)}
              onChange={() => toggleExcursion(ex.id)}
            />
            {ex.name}
          </label>
        ))}
      </div>

      {/* Results */}
      <div className="max-h-72 overflow-auto">
        {filtered.map((qt) => (
          <div
            key={qt.id}
            onClick={() => onApply(qt.itinerary)}
            className="border rounded p-3 mb-2 hover:bg-gray-50 cursor-pointer"
          >
            <div className="font-semibold">
              {qt.tourNumber} — {qt.guestName}
            </div>
            <div className="text-sm text-gray-600">
              {qt.adults} adults, {qt.children} children — {qt.duration} nights
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-10">No quotations found.</div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
