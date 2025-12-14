export default function SummaryCard({ title, value, icon }) {
  return (
    <div className="
      p-5 rounded-xl bg-white shadow-md border border-ti-sky 
      hover:shadow-lg transition-all
    ">
      <div className="flex items-center gap-4">
        <div className="text-3xl text-ti-teal">{icon}</div>
        <div>
          <div className="text-sm text-ti-teal uppercase tracking-wide">{title}</div>
          <div className="text-3xl font-semibold text-ti-forest">{value}</div>
        </div>
      </div>
    </div>
  );
}
