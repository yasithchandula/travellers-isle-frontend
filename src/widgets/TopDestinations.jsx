const destinations = [
  { name: "Sigiriya", count: 14 },
  { name: "Ella", count: 11 },
  { name: "Galle", count: 9 },
  { name: "Nuwara Eliya", count: 7 },
];

export default function TopDestinations() {
  return (
    <ul className="space-y-3">
      {destinations.map((d) => (
        <li
          key={d.name}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <span className="font-medium text-ti-forest">
            {d.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {d.count} tours
          </span>
        </li>
      ))}
    </ul>
  );
}
