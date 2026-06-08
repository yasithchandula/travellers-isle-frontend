export default function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed bg-card p-10 text-center shadow-sm">
      <img src="/empty-state.png" className="mx-auto mb-4 h-28 opacity-70" alt="" />
      <div className="text-lg font-semibold text-foreground">{text}</div>
    </div>
  );
}
