import Card from "../components/common/Card";

export default function FollowupsTable() {
  const followups = [
    { guest: "Jackson Family", due: "Today", status: "Urgent" },
    { guest: "Lisa Morgan", due: "Tomorrow", status: "Pending" },
    { guest: "Michael Lee", due: "12 Feb", status: "Pending" },
  ];

  return (
    <Card>
      <h3 className="font-serif text-xl mb-4 text-ti-forest">Upcoming Follow-ups</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Guest</th>
            <th className="py-2 text-left">Due</th>
            <th className="py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {followups.map((f, i) => (
            <tr key={i} className="border-b">
              <td className="py-3">{f.guest}</td>
              <td>{f.due}</td>
              <td>
                {f.status === "Urgent" ? (
                  <span className="px-2 py-1 bg-ti-red/20 text-ti-red text-sm rounded">
                    Urgent
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-ti-mint/20 text-ti-forest text-sm rounded">
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
