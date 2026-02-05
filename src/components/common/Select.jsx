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
border rounded px-2 py-1 text-sm
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
