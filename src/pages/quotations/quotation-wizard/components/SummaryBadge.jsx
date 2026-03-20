import React from "react";

export default function SummaryBadge({ children }) {
  return (
    <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
      {children}
    </div>
  );
}