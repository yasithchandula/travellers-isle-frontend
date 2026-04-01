import React from "react";

export default function MiniInfo({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="truncate text-sm font-semibold">{value}</div>
    </div>
  );
}