import Card from "../components/common/Card";

export default function RecentQuotations() {
  const data = [
    { id: "Q102", guest: "John Doe", amount: "$1,250", status: "Pending" },
    { id: "Q101", guest: "Emily Rose", amount: "$3,450", status: "Confirmed" },
    { id: "Q099", guest: "Smith Family", amount: "$2,900", status: "Pending" },
  ];

  return (
    <Card>
      <h3 className="font-serif text-xl mb-4 text-ti-forest">Recent Quotations</h3>

      <div className="flex flex-col gap-3">
        {data.map((q) => (
          <div key={q.id} className="p-3 bg-ti-sky/60 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">{q.id}</span>
              <span>{q.amount}</span>
            </div>
            <div className="text-sm text-ti-forest/70">{q.guest}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
