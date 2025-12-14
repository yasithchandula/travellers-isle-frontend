import SummaryCard from "./SummaryCard";

export default function SummaryGrid() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <SummaryCard title="Today's Inquiries" value="12" icon="📬" />
      <SummaryCard title="Pending Quotes" value="18" icon="📝" />
      <SummaryCard title="Urgent Items" value="3" icon="⚠️" />
      <SummaryCard title="Confirmed Tours" value="7" icon="🌴" />
    </div>
  );
}
