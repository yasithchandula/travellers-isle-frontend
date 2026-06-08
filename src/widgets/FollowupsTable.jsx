import Card from "../components/common/Card";

export default function FollowupsTable() {
  const followups = [
    { guest: "Jackson Family", due: "Today", status: "Urgent" },
    { guest: "Lisa Morgan", due: "Tomorrow", status: "Pending" },
    { guest: "Michael Lee", due: "12 Feb", status: "Pending" },
  ];

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-foreground">Upcoming Follow-ups</h3>

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
                  <span className="rounded bg-destructive/10 px-2 py-1 text-sm text-destructive">
                    Urgent
                  </span>
                ) : (
                  <span className="rounded bg-accent px-2 py-1 text-sm text-accent-foreground">
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
