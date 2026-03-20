import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildImageUrl } from "@/utils/urls";

export default function StandardDescriptionPreviewCard({
  description,
  onEdit,
}) {
  if (!description) return null;

  return (
    <Card className="mt-4 overflow-hidden">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between">
          <div className="font-semibold">
            {description.start_city?.name}
            {" → "}
            {description.end_city?.name}
          </div>

          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
        </div>

        {description.title && (
          <div className="text-sm font-medium text-muted-foreground">
            {description.title}
          </div>
        )}

        {(description.featured_image || description.gallery?.length > 0) && (
          <div className="space-y-2">
            {description.featured_image && (
              <img
                src={buildImageUrl(description.featured_image)}
                alt={description.title || "Standard description"}
                className="h-48 w-full rounded-lg border object-cover"
              />
            )}

            {description.gallery?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {description.gallery.map((img, index) => (
                  <img
                    key={`${img}-${index}`}
                    src={buildImageUrl(img)}
                    alt={`Gallery ${index + 1}`}
                    className="h-24 w-full rounded-md border object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {description.starting_paragraph && (
          <div
            className="prose prose-sm max-w-none text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: description.starting_paragraph,
            }}
          />
        )}

        {description.description && (
          <div
            className="prose prose-sm max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: description.description,
            }}
          />
        )}

        {description.excursions?.length > 0 && (
          <div className="pt-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Included Excursions
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {description.excursions.map((e) => (
                <Badge key={e.excursion_id}>{e.name}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}