
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "../EmptyState";
import QuotationActions from "../QuotationActions";
import { formatMoney, getStatusBadgeClass } from "../../utils/quotationManager.helpers";

export default function DriveQuotationList({ items }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No quotation files"
        description="Try changing the search or status filter."
      />
    );
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">Quotation Files</CardTitle>
        <CardDescription>
          Drive-style file listing inside the selected month folder.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead className="w-[70px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.quote_no}</div>
                        <div className="text-xs text-muted-foreground">ID #{item.id}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">{item.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{item.company}</div>
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

                  <TableCell>
                    {item.start_city} → {item.end_city}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatMoney(item.value, item.currency)}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {item.updated_at}
                  </TableCell>

                  <TableCell className="text-right">
                    <QuotationActions />
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