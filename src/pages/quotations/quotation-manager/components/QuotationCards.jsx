import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPinned, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState";
import MiniInfo from "./MiniInfo";
import QuotationActions from "./QuotationActions";
import { formatMoney, getStatusBadgeClass } from "../utils/quotationManager.helpers";

export default function QuotationCards({ items, showTimeline = true }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No quotations found"
        description="Try changing the search or status filter."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group rounded-2xl border shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <CardContent className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{item.quote_no}</div>
                <div className="mt-1 text-xs text-muted-foreground">ID #{item.id}</div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("rounded-md font-medium", getStatusBadgeClass(item.status))}
                >
                  {item.status}
                </Badge>
                <QuotationActions />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-base font-semibold">{item.customer_name}</div>
                <div className="text-sm text-muted-foreground">{item.company}</div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <MapPinned className="h-3.5 w-3.5" />
                  Route
                </div>
                <div className="font-medium">
                  {item.start_city} → {item.end_city}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <MiniInfo icon={Users} label="Pax" value={item.pax} />
                <MiniInfo icon={CalendarDays} label="Nights" value={item.nights} />
                <MiniInfo icon={TrendingUp} label="Value" value={formatMoney(item.value, item.currency)} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
                {showTimeline ? (
                  <div className="rounded-md border bg-background px-2 py-1">
                    {item.month} {item.year}
                  </div>
                ) : (
                  <div className="rounded-md border bg-background px-2 py-1">
                    {item.created_at}
                  </div>
                )}

                <div>Updated: {item.updated_at}</div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" className="rounded-lg">
                  Open
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg">
                  Duplicate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}