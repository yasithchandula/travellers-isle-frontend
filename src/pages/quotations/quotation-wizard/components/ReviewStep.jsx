import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BedDouble, MapPin, Wallet, Calendar } from "lucide-react";

export default function ReviewStep({
  formattedNotes,
  quotationShell,
  cities,
  days: wizardDays = [],
}) {
  const days = useMemo(() => {
    if (!wizardDays.length) return quotationShell?.itinerary || [];

    return wizardDays.map((day) => ({
      ...day,
      start_city_id: day.start_city_id ?? day.starting_city_id,
      end_city_id: day.end_city_id ?? day.destination_city_id,
      options: day.options || [],
    }));
  }, [quotationShell, wizardDays]);

  /** =========================
   * CALCULATIONS
   ========================== */
  const totalCost = useMemo(() => {
    return days.reduce((sum, d) => {
      const dayCost = (d.options || []).reduce(
        (s, o) => s + (o.total_day_cost || 0),
        0
      );
      return sum + dayCost;
    }, 0);
  }, [days]);

  return (
    <div className="space-y-6">
      {/* =========================
       * SUMMARY BAR
       ========================== */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Days</div>
              <div className="font-semibold">
                {quotationShell?.days_count}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Adults</div>
            <div className="font-semibold">
              {quotationShell?.pax_adults}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Options</div>
            <div className="font-semibold">
              {days.reduce((c, d) => c + (d.options?.length || 0), 0)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">
                Estimated Total
              </div>
              <div className="font-semibold text-primary">
                ${totalCost}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================
       * DAY BY DAY VIEW
       ========================== */}
      {days.map((day) => {
        const dayCost = (day.options || []).reduce(
          (s, o) => s + (o.total_day_cost || 0),
          0
        );

        const startCity = cities.find(c => Number(c.id) === Number(day.start_city_id))?.name
          || day.start_city_id
          || "-";

        const endCity = cities.find(c => Number(c.id) === Number(day.end_city_id))?.name
          || day.end_city_id
          || "-";

        return (
          <Card key={day.id} className="border-border/60">
            <CardHeader className="bg-muted/20 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Day {day.day_number}
                </CardTitle>

                <Badge variant="outline">
                  ${dayCost}
                </Badge>
              </div>

              <CardDescription className="flex items-center gap-2 text-xs">
                <MapPin className="w-3 h-3" />
                {startCity} → {endCity}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-4">
              {/* NOTE */}
              {day.note && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Note
                  </div>
                  <div className="text-sm">{day.note}</div>
                </div>
              )}

              {/* EXCURSIONS */}
              {!!day.excursions?.length && (
                <div className="flex flex-wrap gap-2">
                  {day.excursions.map((ex) => (
                    <Badge key={ex.excursion_id} variant="secondary">
                      {ex.name}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />

              {/* OPTIONS */}
              <div className="space-y-3">
                {day.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className="border rounded-lg p-3 bg-background"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm">
                        {opt.option_name}
                      </div>
                      <Badge variant="outline">
                        ${opt.total_day_cost}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      {opt.hotel_name} • {opt.meal_plan}
                    </div>

                    {/* ROOMS */}
                    {!!opt.rooms?.length && (
                      <div className="mt-2 space-y-1">
                        {opt.rooms.map((r) => (
                          <div
                            key={r.id}
                            className="flex justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <BedDouble className="w-3 h-3" />
                              {r.room_category} ({r.room_type})
                            </div>

                            <div>
                              {r.room_count} × ${r.unit_price}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* =========================
       * NOTES TEXTAREA (KEEP EXISTING)
       ========================== */}
      <Card className="border-border/60 shadow-none">
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
    </div>
  );
}
