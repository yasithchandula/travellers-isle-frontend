import AppLayout from "../../components/layout/AppLayout";

function StatCard({ label, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
      {subtitle && (
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppLayout>
      {/* Stat Cards */}
      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Inquiries" value="128" subtitle="+12 this week" />
        <StatCard label="Active Quotations" value="34" subtitle="7 pending" />
        <StatCard label="Upcoming Tours" value="9" subtitle="Next 30 days" />
        <StatCard label="New Customers" value="22" subtitle="This month" />
      </div>

      {/* Main Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-md p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Inquiries</h3>
            <a href="#" className="text-[#0e4b5a] text-sm">
              View all
            </a>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="py-2">Guest</th>
                <th>Dates</th>
                <th>Adults</th>
                <th>Children</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { g: "John Carter", d: "12–19 Dec", a: 2, c: 1, s: "Pending" },
                { g: "Ayesha Perera", d: "03–10 Jan", a: 4, c: 0, s: "Urgent" },
                { g: "Liam Patel", d: "22–28 Nov", a: 2, c: 2, s: "New" },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="py-3">{r.g}</td>
                  <td>{r.d}</td>
                  <td>{r.a}</td>
                  <td>{r.c}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        r.s === "Urgent"
                          ? "bg-red-100 text-red-700"
                          : r.s === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {r.s}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-[#0e4b5a] text-white py-2 rounded-xl hover:opacity-90">
              Create Quotation
            </button>
            <button className="w-full bg-[#c9a66b] text-white py-2 rounded-xl hover:opacity-90">
              Add Customer
            </button>
            <button className="w-full border py-2 rounded-xl">
              Log Inquiry
            </button>
          </div>
          <div className="mt-6">
            <h4 className="font-medium mb-2">Tours this Month</h4>
            <div className="h-24 bg-gray-100 rounded-xl grid place-items-center text-gray-400">
              Chart Placeholder
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
