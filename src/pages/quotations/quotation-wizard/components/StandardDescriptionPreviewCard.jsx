import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildImageUrl } from "@/utils/urls";
import {
  MapPin,
  Image as ImageIcon,
  Pencil,
  Sparkles,
} from "lucide-react";

export default function StandardDescriptionPreviewCard({
  description,
  onEdit,
}) {
  if (!description) return null;

  const hasImages =
    description.featured_image || description.gallery?.length > 0;

  return (
    <Card className="mt-6 overflow-hidden border border-border/60 shadow-sm">
      {/* =========================
          HERO / HEADER
      ========================= */}
      <div className="relative">
        {description.featured_image ? (
          <img
            src={buildImageUrl(description.featured_image)}
            alt={description.title || "Standard description"}
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 items-center justify-center bg-muted text-muted-foreground">
            <ImageIcon className="h-6 w-6 opacity-60" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Header Content */}
        <div className="absolute bottom-0 w-full p-4 text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm opacity-90">
                <MapPin className="h-4 w-4" />
                {description.start_city?.name} →{" "}
                {description.end_city?.name}
              </div>

              {description.title && (
                <div className="text-lg font-semibold leading-tight">
                  {description.title}
                </div>
              )}
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="gap-1 bg-white/90 text-black hover:bg-white"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* =========================
          CONTENT
      ========================= */}
      <div className="space-y-6 p-5">
        {/* =========================
            GALLERY
        ========================= */}
        {description.gallery?.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-muted-foreground">
                Gallery
              </div>

              <Badge variant="secondary" className="text-xs">
                {description.gallery.length} photos
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {description.gallery.slice(0, 4).map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  className="group relative overflow-hidden rounded-md border"
                >
                  <img
                    src={buildImageUrl(img)}
                    alt={`Gallery ${index + 1}`}
                    className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================
            INTRO
        ========================= */}
        {description.starting_paragraph && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Overview
            </div>

            <div
              className="prose prose-sm max-w-none text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: description.starting_paragraph,
              }}
            />
          </div>
        )}

        {/* =========================
            MAIN DESCRIPTION
        ========================= */}
        {description.description && (
          <div>
            <div className="mb-2 text-xs font-semibold text-muted-foreground">
              Description
            </div>

            <div
              className="prose prose-sm max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: description.description,
              }}
            />
          </div>
        )}

        {/* =========================
            EXCURSIONS
        ========================= */}
        {description.excursions?.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold text-muted-foreground">
              Included Experiences
            </div>

            <div className="flex flex-wrap gap-2">
              {description.excursions.map((e) => (
                <div
                  key={e.excursion_id}
                  className="flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs shadow-sm transition hover:bg-muted"
                >
                  <span className="font-medium">{e.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}