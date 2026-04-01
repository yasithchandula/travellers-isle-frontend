// components/drive/DriveInquiryList.jsx

import React from "react";
import { Folder } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import EmptyState from "../EmptyState";

export default function DriveInquiryList({ inquiries, onOpenInquiry }) {
  if (!inquiries?.length) {
    return (
      <EmptyState
        title="No inquiries"
        description="No inquiries found in this month."
      />
    );
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">Inquiry Folders</CardTitle>
        <CardDescription>
          Each inquiry contains its related quotation files.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {inquiries.map((inq) => (
            <button
              key={inq.inquiry_id}
              type="button"
              onClick={() => onOpenInquiry(inq)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-muted/30"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-blue-600" />

                <div>
                  <div className="font-medium">
                    {inq.inquiry_number}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {inq.guest_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {inq.arrival_date}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-sm text-muted-foreground">
                {inq.quotations?.length || 0} file
                {(inq.quotations?.length || 0) === 1 ? "" : "s"}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}