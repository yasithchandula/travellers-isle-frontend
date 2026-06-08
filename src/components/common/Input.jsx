export default function Input({ label, error, className = "", onChange, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className={`
          h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
          outline-none transition focus-visible:ring-1 focus-visible:ring-ring
          ${className}
        `}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
