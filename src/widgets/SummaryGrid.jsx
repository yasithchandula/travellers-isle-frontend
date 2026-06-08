import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "New Inquiries", value: 42, trend: "+12%", up: true },
  { label: "Active Quotations", value: 18, trend: "+5%", up: true },
  { label: "Confirmed Tours", value: 9, trend: "-2%", up: false },
  { label: "Revenue (LKR)", value: "1.2M", trend: "+18%", up: true },
];

export default function SummaryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>

            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-foreground">
                {s.value}
              </h3>

              <span
                className={`flex items-center text-sm ${
                  s.up ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {s.up ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {s.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
