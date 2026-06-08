export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-lg border bg-card p-4 text-card-foreground shadow-sm
        transition-colors hover:bg-muted/20
        ${className}
      `}
    >
      {children}
    </div>
  );
}
