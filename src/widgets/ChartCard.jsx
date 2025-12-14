export default function ChartCard({ title, children }) {
  return (
    <div className="card p-6">
      <h3 className="font-serif text-xl text-ti-forest mb-4">{title}</h3>
      {children}
    </div>
  );
}
