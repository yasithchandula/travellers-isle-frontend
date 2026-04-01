import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState";
import QuotationActions from "./QuotationActions";
import { formatMoney, getStatusBadgeClass } from "../utils/quotationManager.helpers";

export default function QuotationTable({ items, showTimeline = true }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No quotations found"
        description="Try changing the search or status filter."
      />
    );
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">Quotation List</CardTitle>
        <CardDescription>
          Structured list view for quick scanning, actions, and status tracking.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[150px]">Quotation</TableHead>
                <TableHead className="min-w-[180px]">Customer</TableHead>
                <TableHead className="min-w-[180px]">Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead className="text-right">Value</TableHead>
                {showTimeline && <TableHead>Timeline</TableHead>}
                <TableHead>Updated</TableHead>
                <TableHead className="w-[70px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.quote_no}</div>
                      <div className="text-xs text-muted-foreground">ID #{item.id}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{item.company}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="inline-flex items-center gap-2 text-sm">
                      <MapPinned className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        {item.start_city} → {item.end_city}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("rounded-md font-medium", getStatusBadgeClass(item.status))}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{item.pax}</TableCell>
                  <TableCell>{item.nights}</TableCell>

                  <TableCell className="text-right font-medium">
                    {formatMoney(item.value, item.currency)}
                  </TableCell>

                  {showTimeline && (
                    <TableCell>
                      <div className="text-sm">
                        {item.month} {item.year}
                      </div>
                    </TableCell>
                  )}

                  <TableCell>
                    <div className="text-sm text-muted-foreground">{item.updated_at}</div>
                  </TableCell>

                  <TableCell className="text-right">
                    <QuotationActions quotationId={item.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}