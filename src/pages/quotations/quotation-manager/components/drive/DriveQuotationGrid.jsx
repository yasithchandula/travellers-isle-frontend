import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "../EmptyState";
import QuotationActions from "../QuotationActions";
import { formatMoney, getStatusBadgeClass } from "../../utils/quotationManager.helpers";

export default function DriveQuotationGrid({ items }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No quotation files"
        description="Try changing the search or status filter."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <CardContent className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-2xl border bg-muted/40 p-3">
                  <FileText className="h-5 w-5 text-foreground" />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{item.quote_no}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.customer_name}</div>
                </div>
              </div>

              <QuotationActions />
            </div>

            <div className="space-y-3">
              <Badge
                variant="outline"
                className={cn("rounded-md font-medium", getStatusBadgeClass(item.status))}
              >
                {item.status}
              </Badge>

              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Route
                </div>
                <div className="text-sm font-medium">
                  {item.start_city} → {item.end_city}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">Pax</div>
                  <div className="font-semibold">{item.pax}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">Nights</div>
                  <div className="font-semibold">{item.nights}</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span>{formatMoney(item.value, item.currency)}</span>
                <span>Updated {item.updated_at}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}