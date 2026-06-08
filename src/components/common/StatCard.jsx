import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ title, value, icon: Icon, subtle }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {value}
          </p>

          {subtle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtle}</p>
          )}
        </div>

        <div className="rounded-md border bg-accent p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
