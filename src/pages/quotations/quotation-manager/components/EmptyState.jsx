import React from "react";
import { FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState({ title, description }) {
  return (
    <Card className="rounded-2xl border border-dashed shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 rounded-2xl border bg-muted/40 p-4">
          <FolderOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}