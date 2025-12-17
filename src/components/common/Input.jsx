export default function Input({ label, error, className = "", onChange, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-ti-forest">{label}</label>}
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full rounded-lg border border-ti-mint bg-white 
          px-2 py-1 outline-none transition 
          focus:ring-2 focus:ring-ti-teal focus:border-ti-teal
          placeholder:text-ti-teal/50
          ${className}
        `}
      />
      {error && <span className="text-sm text-ti-red">{error}</span>}
    </div>
  );
}
