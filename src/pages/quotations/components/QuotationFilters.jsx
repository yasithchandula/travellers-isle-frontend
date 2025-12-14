import Input from "../../../components/common/Input";

export default function QuotationFilters({ filters, setFilters }) {

  function update(field, value) {
    setFilters({ ...filters, [field]: value });
  }

  return (
    <div className="grid grid-cols-3 gap-3 mb-3">

      <Input
        label="Search (Guest / Tour No)"
        value={filters.search}
        onChange={(v) => update("search", v)}
      />

      <div>
        <label className="font-medium">Status</label>
        <select
          className="w-full border rounded px-2 py-2 mt-1"
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Urgent">Urgent</option>
          <option value="Confirmed">Confirmed</option>
        </select>
      </div>

      <Input
        label="Month"
        type="month"
        value={filters.month}
        onChange={(v) => update("month", v)}
      />

      <Input
        label="Executive ID"
        value={filters.executive}
        onChange={(v) => update("executive", v)}
        placeholder="Filter by Executive"
      />

      <Input
        label="Tour Type"
        value={filters.tourType}
        onChange={(v) => update("tourType", v)}
        placeholder="Family / Honeymoon"
      />

      <Input
        label="Pax Min"
        type="number"
        value={filters.paxMin}
        onChange={(v) => update("paxMin", v)}
      />

      <Input
        label="Pax Max"
        type="number"
        value={filters.paxMax}
        onChange={(v) => update("paxMax", v)}
      />

    </div>
  );
}
