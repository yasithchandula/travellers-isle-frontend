import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ title, value, icon: Icon, hint }) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}