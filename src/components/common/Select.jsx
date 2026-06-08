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
        <label className="mb-1 text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
          outline-none transition focus-visible:ring-1 focus-visible:ring-ring
          ${error ? "border-destructive" : ""}
        `}
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && <span className="mt-1 text-xs text-destructive">{error}</span>}
    </div>
  );
}
