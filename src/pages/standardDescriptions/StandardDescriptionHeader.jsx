// components/forms/StandardDescriptionHeader.jsx

import { Sparkles, GalleryHorizontal, Mountain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StandardDescriptionHeader({
  initial,
  uploadedImages = 0,
  totalImages = 0,
  excursionCount = 0,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      
      {/* Left */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Standard Description Studio
        </div>

        <div className="text-sm font-semibold">
          {initial
            ? "Editing Standard Description"
            : "Creating Standard Description"}
        </div>
      </div>

      {/* Right Stats */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-lg">
          <GalleryHorizontal className="mr-1 h-3.5 w-3.5" />
          {uploadedImages}/{totalImages || 0}
        </Badge>

        <Badge variant="secondary" className="rounded-lg">
          <Mountain className="mr-1 h-3.5 w-3.5" />
          {excursionCount}
        </Badge>
      </div>
    </div>
  );
}