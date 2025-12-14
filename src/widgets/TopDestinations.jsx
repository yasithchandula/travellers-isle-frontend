import Card from "../components/common/Card";

export default function TopDestinations() {
  const sample = [
    { city: "Kandy", count: 42 },
    { city: "Ella", count: 38 },
    { city: "Sigiriya", count: 32 },
    { city: "Nuwara Eliya", count: 29 },
  ];

  return (
    <Card>
      <h3 className="font-serif text-xl mb-4 text-ti-forest">Top Destinations</h3>

      <div className="flex flex-col gap-3">
        {sample.map((x, i) => (
          <div key={i} className="flex justify-between">
            <span className="font-medium">{x.city}</span>
            <span className="text-ti-teal">{x.count} tours</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
