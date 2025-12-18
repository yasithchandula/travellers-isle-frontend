const quotations = [
  { ref: "Q-1021", client: "John Smith", status: "Pending" },
  { ref: "Q-1020", client: "Emma Brown", status: "Confirmed" },
  { ref: "Q-1019", client: "Liam Wilson", status: "Rejected" },
];

export default function RecentQuotations() {
  return (
    <div className="space-y-2">
      {quotations.map((q) => (
        <div
          key={q.ref}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <p className="font-medium text-ti-forest">{q.ref}</p>
            <p className="text-sm text-muted-foreground">{q.client}</p>
          </div>

          <span
            className={`text-sm font-medium ${
              q.status === "Confirmed"
                ? "text-emerald-600"
                : q.status === "Pending"
                ? "text-amber-600"
                : "text-red-500"
            }`}
          >
            {q.status}
          </span>
        </div>
      ))}
    </div>
  );
}
