export default function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20">
      <div className="flex items-center gap-4">
        <div className="text-3xl text-primary">{icon}</div>
        <div>
          <div className="text-sm uppercase text-muted-foreground">{title}</div>
          <div className="text-3xl font-semibold text-foreground">{value}</div>
        </div>
      </div>
    </div>
  );
}
