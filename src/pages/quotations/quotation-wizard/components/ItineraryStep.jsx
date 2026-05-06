"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapPinned, NotebookPen, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { fetchDistance } from "@/app/slices/standardDescriptionSlice";

import ExcursionSelector from "@/components/ui/excursion-selector";
import StandardDescriptionSelector from "@/components/ui/standard-description-selector";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import SummaryBadge from "./SummaryBadge";
import StopsMultiSelect from "./StopsMultiSelect";
import StandardDescriptionPreviewCard from "./StandardDescriptionPreviewCard";
import DayNavigation from "./DayNavigation";

export default function ItineraryStep({
  day,
  dayIndex,
  daysLength,
  cities,
  excursions,
  standardDescriptions,
  dispatch,
  setStandardDescriptionSearchAction,
  onUpdateDay,
  onSetEditingDescription,
  onOpenEditDialog,
  onExcursionSearch,
  onPrevDay,
  onNextDay,
  isSavingDay,
}) {
  const [distanceLoading, setDistanceLoading] = useState(false);

  if (!day) return null;

  // ===== Helpers =====
  const getCityName = (id) => {
    return cities.find((c) => String(c.id) === String(id))?.name || "";
  };

  const stopsKey = useMemo(() => {
    return (day.stop_ids || []).map(String).join(",");
  }, [day.stop_ids]);

  // ===== Distance Fetch =====
  async function handleFetchDistance({ silent = false } = {}) {
    try {
      if (!day.starting_city_id || !day.destination_city_id) {
        return;
      }

      const originCity = getCityName(day.starting_city_id);
      const destinationCity = getCityName(day.destination_city_id);

      if (!originCity || !destinationCity) {
        return;
      }

      setDistanceLoading(true);

      const origin = `${originCity}, Sri Lanka`;
      const destination = `${destinationCity}, Sri Lanka`;

      const stops = (day.stop_ids || [])
        .map((id) => getCityName(id))
        .filter(Boolean)
        .map((name) => `${name}, Sri Lanka`);

      const payload = {
        origin,
        destination,
        stops,
        travel_mode: "driving",
      };

      const res = await dispatch(fetchDistance(payload)).unwrap();

      const km = Math.round(res.Distance / 1000);
      const minutes = Math.round(res.Duration / 1e9 / 60);

      onUpdateDay(dayIndex, {
        mileage: km,
        travel_time_minutes: minutes,
      });

      if (!silent) {
        toast.success("Distance calculated 🚗");
      }
    } catch (err) {
      console.error(err);

      if (!silent) {
        toast.error(err || "Failed to fetch distance");
      }
    } finally {
      setDistanceLoading(false);
    }
  }

  // ===== Auto Fetch Distance =====
  useEffect(() => {
    if (!day.starting_city_id || !day.destination_city_id) return;

    const timer = setTimeout(() => {
      handleFetchDistance({ silent: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    day.starting_city_id,
    day.destination_city_id,
    stopsKey,
    cities,
    dayIndex,
  ]);

  return (
    <Card className="overflow-hidden border-border/60 shadow-none">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl">Day {dayIndex + 1}</CardTitle>
            <CardDescription>{day.date}</CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <SummaryBadge>
              {day.excursions?.length || 0} selected excursion
              {(day.excursions?.length || 0) === 1 ? "" : "s"}
            </SummaryBadge>

            <SummaryBadge>
              {day.standard_description ? 1 : 0} standard description
            </SummaryBadge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4 md:p-6">
        {/* ===== Cities + Stops ===== */}
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Start City */}
            <div className="space-y-2">
              <Label className="inline-flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-muted-foreground" />
                Starting City
              </Label>

              <Select
                value={day.starting_city_id || ""}
                onValueChange={(value) =>
                  onUpdateDay(dayIndex, { starting_city_id: value })
                }
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Starting city" />
                </SelectTrigger>

                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination City */}
            <div className="space-y-2">
              <Label className="inline-flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-muted-foreground" />
                Destination City
              </Label>

              <Select
                value={day.destination_city_id || ""}
                onValueChange={(value) =>
                  onUpdateDay(dayIndex, { destination_city_id: value })
                }
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Destination city" />
                </SelectTrigger>

                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stops */}
            <StopsMultiSelect
              cities={cities}
              selectedIds={day.stop_ids || []}
              onChange={(value) => onUpdateDay(dayIndex, { stop_ids: value })}
            />
          </div>

          {/* ===== Distance Calculator ===== */}
          <div className="rounded-xl border bg-background p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  🚗 Distance & Travel
                </Label>
                <p className="text-xs text-muted-foreground">
                  Auto calculate route distance and duration
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
              {/* Mileage */}
              <div>
                <Label className="text-xs">Mileage (KM)</Label>
                <Input
                  value={day.mileage || ""}
                  onChange={(e) =>
                    onUpdateDay(dayIndex, {
                      mileage: e.target.value,
                    })
                  }
                  placeholder="Auto / manual"
                />
              </div>

              {/* Buffer */}
              <div>
                <Label className="text-xs">Buffer (KM)</Label>
                <Input
                  value={day.buffer_mileage || ""}
                  onChange={(e) =>
                    onUpdateDay(dayIndex, {
                      buffer_mileage: e.target.value,
                    })
                  }
                  placeholder="Optional buffer"
                />
              </div>
            </div>

            {/* Travel Time Display */}
            {day.travel_time_minutes && (
              <div className="text-xs text-muted-foreground">
                Travel Time:{" "}
                <span className="font-medium text-foreground">
                  {day.travel_time_minutes} minutes
                </span>
              </div>
            )}

            {/* Hint */}
            {!day.mileage && !distanceLoading && (
              <p className="text-xs text-amber-500">
                Tip: Select start and destination cities to auto-calculate route
              </p>
            )}

            {/* Loading */}
            {distanceLoading && (
              <p className="text-xs text-muted-foreground">
                Calculating route...
              </p>
            )}
          </div>

          {/* ===== Note ===== */}
          <div className="space-y-2">
            <Label className="inline-flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-muted-foreground" />
              Day Note
            </Label>

            <Textarea
              value={day.note || ""}
              onChange={(e) =>
                onUpdateDay(dayIndex, {
                  note: e.target.value,
                })
              }
              className="min-h-[90px] resize-none bg-background"
              placeholder="Add detailed note for this day"
            />
          </div>
        </div>

        {/* ===== Excursions ===== */}
        <div className="rounded-xl border bg-background p-4">
          <div className="mb-3 space-y-1">
            <Label>Excursions</Label>
            <p className="text-sm text-muted-foreground">
              Select excursions for this day.
            </p>
          </div>

          <ExcursionSelector
            items={excursions}
            selected={day.excursions || []}
            setSelected={(updater) => {
              const current = day.excursions || [];
              const next =
                typeof updater === "function" ? updater(current) : updater;

              onUpdateDay(dayIndex, { excursions: next });
            }}
            onSearch={onExcursionSearch}
          />
        </div>

        {/* ===== Standard Descriptions ===== */}
        <div className="rounded-xl border bg-background p-4">
          <div className="mb-3 space-y-1">
            <Label className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Standard Descriptions
            </Label>

            <p className="text-sm text-muted-foreground">
              Select standard descriptions for this day.
            </p>
          </div>

          <StandardDescriptionSelector
            items={standardDescriptions}
            selected={day.standard_description}
            setSelected={(item) =>
              onUpdateDay(dayIndex, {
                standard_description: item,
                standard_description_id: item?.id || null,
              })
            }
            onSearch={(value) =>
              dispatch(setStandardDescriptionSearchAction(value))
            }
          />

          <StandardDescriptionPreviewCard
            description={day.standard_description}
            onEdit={() => {
              onSetEditingDescription(day.standard_description);
              onOpenEditDialog(true);
            }}
          />
        </div>
      </CardContent>

      <DayNavigation
        dayIndex={dayIndex}
        daysLength={daysLength}
        isSavingDay={isSavingDay}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
      />
    </Card>
  );
}