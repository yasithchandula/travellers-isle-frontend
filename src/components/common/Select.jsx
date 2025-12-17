export default function Select({
  label,
  value,
  onChange,
  options = [],
  error,
  className = "",
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-ti-forest">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          px-2 py-1 rounded-lg border bg-white text-ti-forest
          border-ti-mint outline-none transition
          focus:ring-2 focus:ring-ti-teal
          ${error ? "border-red-400" : ""}
        `}
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
