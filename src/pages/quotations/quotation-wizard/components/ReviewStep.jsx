import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewStep({ formattedNotes }) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-none">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle>Notes Preview</CardTitle>
        <CardDescription>
          Review all day notes before saving the quotation.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <Textarea
          value={formattedNotes}
          readOnly
          className="min-h-[240px] resize-none bg-background"
          placeholder="No notes added yet"
        />
      </CardContent>
    </Card>
  );
}