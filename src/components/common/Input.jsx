export default function Input({ label, error, className = "", onChange, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-ti-forest">{label}</label>}
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className={`
          border rounded px-2 py-1 text-sm
          ${className}
        `}
      />
      {error && <span className="text-sm text-ti-red">{error}</span>}
    </div>
  );
}
