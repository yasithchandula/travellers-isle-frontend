export default function EmptyState({ text }) {
  return (
    <div className="p-10 text-center bg-white rounded-xl border border-[#E3F5F1] shadow-sm">
      <img src="/empty-state.png" className="mx-auto h-28 mb-4 opacity-70" />
      <div className="text-xl font-serif text-[#243F40]">{text}</div>
    </div>
  );
}
