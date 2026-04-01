// components/drive/DriveInquiryGrid.jsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmptyState from "../EmptyState";

export default function DriveInquiryGrid({ inquiries, onOpenInquiry }) {
  if (!inquiries?.length) {
    return (
      <EmptyState
        title="No inquiries"
        description="No inquiries available in this month."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {inquiries.map((inq) => (
        <button
          key={inq.inquiry_id}
          onClick={() => onOpenInquiry(inq)}
          className="text-left"
        >
          <Card className="rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-2xl border bg-blue-50 p-3">
                  <Folder className="h-6 w-6 text-blue-600" />
                </div>

                <Badge variant="secondary">
                  {inq.quotations.length} files
                </Badge>
              </div>

              <div>
                <div className="font-semibold">{inq.inquiry_number}</div>
                <div className="text-sm text-muted-foreground">
                  {inq.guest_name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {inq.arrival_date}
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}