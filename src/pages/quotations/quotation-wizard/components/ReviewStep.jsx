import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  ListChecks,
  MapPin,
  Navigation,
  NotebookText,
  Pencil,
  Route,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const REVIEW_FILTERS = [
  { id: "all", label: "All days" },
  { id: "attention", label: "Needs attention" },
  { id: "ready", label: "Ready" },
];

export default function ReviewStep({
  formattedNotes,
  quotationShell,
  cities = [],
  days: wizardDays = [],
  onEditDay,
}) {
  const [filter, setFilter] = useState("all");

  const days = useMemo(() => {
    const sourceDays = wizardDays.length
      ? wizardDays
      : quotationShell?.itinerary || [];

    return sourceDays.map((day, index) => ({
      ...day,
      _index: index,
      start_city_id: day.start_city_id ?? day.starting_city_id,
      end_city_id: day.end_city_id ?? day.destination_city_id,
    }));
  }, [quotationShell, wizardDays]);

  const reviewedDays = useMemo(
    () =>
      days.map((day) => ({
        day,
        review: getDayReview(day),
      })),
    [days]
  );

  const summary = useMemo(() => {
    const ready = reviewedDays.filter(({ review }) => review.ready).length;

    return {
      ready,
      attention: reviewedDays.length - ready,
      routes: reviewedDays.filter(({ review }) => review.routeReady).length,
      descriptions: reviewedDays.filter(
        ({ review }) => review.descriptionReady
      ).length,
      excursions: days.reduce(
        (total, day) => total + (day.excursions?.length || 0),
        0
      ),
    };
  }, [days, reviewedDays]);

  const visibleDays = reviewedDays.filter(({ review }) => {
    if (filter === "ready") return review.ready;
    if (filter === "attention") return !review.ready;
    return true;
  });

  const completion = days.length
    ? Math.round((summary.ready / days.length) * 100)
    : 0;

  function scrollToDay(day) {
    const element = document.getElementById(getDayElementId(day));
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    element.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-foreground px-5 py-5 text-background shadow-sm md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-background/60">
              <ListChecks className="h-4 w-4" />
              Itinerary quality check
            </div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight">
              Review every day before adding accommodation
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-background/70">
              Confirm routes, travel details, experiences, and descriptions.
              Days with missing essentials are clearly marked for correction.
            </p>
          </div>

          <div className="min-w-[240px] rounded-xl bg-background/10 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-background/70">Itinerary ready</span>
              <span className="font-semibold tabular-nums">
                {summary.ready} of {days.length} days
              </span>
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/15"
              role="progressbar"
              aria-label="Itinerary review completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completion}
            >
              <div
                className="h-full rounded-full bg-background transition-[width] duration-200 motion-reduce:transition-none"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-2 text-right text-xs text-background/60 tabular-nums">
              {completion}% complete
            </div>
          </div>
        </div>
      </section>

      <section
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Itinerary review summary"
      >
        <SummaryCard
          icon={CheckCircle2}
          label="Ready days"
          value={summary.ready}
          detail={`${summary.attention} need attention`}
          tone={summary.attention ? "default" : "success"}
        />
        <SummaryCard
          icon={Route}
          label="Routes planned"
          value={`${summary.routes}/${days.length}`}
          detail="Start and destination set"
        />
        <SummaryCard
          icon={FileText}
          label="Descriptions"
          value={`${summary.descriptions}/${days.length}`}
          detail="Daily narrative coverage"
        />
        <SummaryCard
          icon={Sparkles}
          label="Experiences"
          value={summary.excursions}
          detail="Excursions across the trip"
        />
      </section>

      <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Day-by-day review
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Resolve flagged items now to keep pricing and the final proposal
            accurate.
          </p>
        </div>

        <div
          className="inline-flex w-full rounded-xl bg-muted p-1 sm:w-auto"
          aria-label="Filter reviewed days"
        >
          {REVIEW_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={cn(
                "min-h-10 flex-1 rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-none",
                filter === item.id &&
                  "bg-background text-foreground shadow-sm"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {visibleDays.length ? (
        <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <Card className="hidden border-border/60 shadow-sm lg:sticky lg:top-4 lg:block">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm">Review queue</CardTitle>
              <CardDescription className="text-xs">
                Jump directly to a day.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 p-2 pt-0">
              {visibleDays.map(({ day, review }) => (
                <button
                  key={getDayKey(day)}
                  type="button"
                  onClick={() => scrollToDay(day)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <ReviewStatusIcon ready={review.ready} />
                  <span className="min-w-0 flex-1 truncate">
                    Day {day.day_number || day._index + 1}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {review.completedChecks}/3
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {visibleDays.map(({ day, review }) => (
              <DayReviewCard
                key={getDayKey(day)}
                day={day}
                review={review}
                cities={cities}
                onEdit={() => onEditDay?.(day._index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-3 font-semibold">No days in this view</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try another filter to continue reviewing the itinerary.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border/60">
              <NotebookText className="h-4 w-4 text-muted-foreground" />
            </span>
            <div>
              <CardTitle className="text-base">Internal notes digest</CardTitle>
              <CardDescription className="mt-1">
                A consolidated handover for the operations team.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-5">
          <Textarea
            value={formattedNotes}
            readOnly
            aria-label="Consolidated internal notes"
            className="min-h-36 resize-none bg-muted/20 text-sm leading-6"
            placeholder="No internal notes have been added."
          />
        </CardContent>
      </Card>
    </div>
  );
}

function DayReviewCard({ day, review, cities, onEdit }) {
  const dayNumber = day.day_number || day._index + 1;
  const startCity = getCityName(cities, day.start_city_id);
  const endCity = getCityName(cities, day.end_city_id);
  const description =
    day.standard_description ||
    day.standard_descriptions?.[0] ||
    null;
  const excursions = day.excursions || [];
  const optionalCount = excursions.filter(
    (excursion) => excursion.is_optional === true
  ).length;

  return (
    <article
      id={getDayElementId(day)}
      className="scroll-mt-4 overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70"
    >
      <header className="flex flex-col gap-4 border-b bg-muted/15 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tabular-nums",
              review.ready
                ? "bg-emerald-600 text-white"
                : "bg-amber-100 text-amber-900"
            )}
          >
            {dayNumber}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-balance text-base font-semibold tracking-tight">
                {review.routeReady
                  ? `${startCity} to ${endCity}`
                  : `Plan day ${dayNumber}`}
              </h4>
              <StatusBadge ready={review.ready} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <time dateTime={day.date}>{formatDate(day.date)}</time>
              </span>
              <span>
                {review.completedChecks} of 3 essentials complete
              </span>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="min-h-11 shrink-0 gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit day
        </Button>
      </header>

      <div className="grid divide-y lg:grid-cols-[minmax(0,1fr)_260px] lg:divide-x lg:divide-y-0">
        <div className="space-y-5 p-4 md:p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <ReviewDetail
              icon={Navigation}
              label="Travel"
              value={
                review.travelReady
                  ? `${formatNumber(day.actual_mileage)} km · ${formatTravelTime(
                      day.travel_time_minutes
                    )}`
                  : "Travel details missing"
              }
              muted={!review.travelReady}
            />
            <ReviewDetail
              icon={MapPin}
              label="Stops"
              value={`${day.stop_ids?.length || 0} planned stop${
                day.stop_ids?.length === 1 ? "" : "s"
              }`}
            />
            <ReviewDetail
              icon={FileText}
              label="Description"
              value={description?.title || "Not selected"}
              muted={!description}
            />
          </div>

          <section aria-label={`Day ${dayNumber} excursions`}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h5 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Experiences
              </h5>
              <span className="text-xs tabular-nums text-muted-foreground">
                {excursions.length} selected
                {optionalCount ? ` · ${optionalCount} optional` : ""}
              </span>
            </div>

            {excursions.length ? (
              <div className="flex flex-wrap gap-2">
                {excursions.map((excursion) => (
                  <span
                    key={excursion.id ?? excursion.excursion_id}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                    {getExcursionName(excursion)}
                    {excursion.is_optional && (
                      <span className="text-muted-foreground">· Optional</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                No excursions selected for this day.
              </p>
            )}
          </section>

          {day.note?.trim() && (
            <section
              className="rounded-xl bg-muted/35 p-3.5"
              aria-label={`Day ${dayNumber} internal note`}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <NotebookText className="h-3.5 w-3.5" />
                Internal note
              </div>
              <p className="mt-2 text-sm leading-6">{day.note.trim()}</p>
            </section>
          )}
        </div>

        <aside className="bg-muted/10 p-4 md:p-5">
          <h5 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Daily checklist
          </h5>
          <div className="mt-3 space-y-2">
            <ChecklistItem
              complete={review.routeReady}
              label="Route confirmed"
              detail={
                review.routeReady
                  ? `${startCity} → ${endCity}`
                  : "Start and destination required"
              }
            />
            <ChecklistItem
              complete={review.travelReady}
              label="Travel details"
              detail={
                review.travelReady
                  ? "Distance and drive time added"
                  : "Add mileage and drive time"
              }
            />
            <ChecklistItem
              complete={review.descriptionReady}
              label="Description selected"
              detail={
                review.descriptionReady
                  ? "Daily narrative is covered"
                  : "Choose a standard description"
              }
            />
          </div>

          {!review.ready && (
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-950 ring-1 ring-amber-200">
              <div className="flex gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-xs leading-5">
                  Resolve {review.issues.length} missing essential
                  {review.issues.length === 1 ? "" : "s"} before finalizing
                  this itinerary.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

function SummaryCard({ icon, label, value, detail, tone = "default" }) {
  const SummaryIcon = icon;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            tone === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-muted text-muted-foreground"
          )}
        >
          <SummaryIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-0.5 text-lg font-semibold tabular-nums">
            {value}
          </div>
          <div className="truncate text-xs text-muted-foreground">{detail}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewDetail({ icon, label, value, muted = false }) {
  const DetailIcon = icon;

  return (
    <div className="rounded-xl bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <DetailIcon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div
        className={cn(
          "mt-1.5 truncate text-sm font-medium",
          muted && "text-muted-foreground"
        )}
        title={String(value)}
      >
        {value}
      </div>
    </div>
  );
}

function ChecklistItem({ complete, label, detail }) {
  return (
    <div className="flex gap-2.5 rounded-lg bg-background p-2.5 ring-1 ring-border/60">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          complete
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-800"
        )}
      >
        {complete ? (
          <Check className="h-3 w-3" />
        ) : (
          <AlertCircle className="h-3 w-3" />
        )}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium">{label}</div>
        <div className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
          {detail}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ ready }) {
  return ready ? (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
      Ready
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-amber-200 bg-amber-50 text-amber-800"
    >
      Needs attention
    </Badge>
  );
}

function ReviewStatusIcon({ ready }) {
  return ready ? (
    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
  ) : (
    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
  );
}

function getDayReview(day) {
  const routeReady = Boolean(day.start_city_id && day.end_city_id);
  const travelReady =
    Number(day.actual_mileage) > 0 && Number(day.travel_time_minutes) > 0;
  const descriptionReady = Boolean(
    day.standard_description ||
      day.standard_description_id ||
      day.standard_descriptions?.length
  );

  const checks = [routeReady, travelReady, descriptionReady];

  return {
    routeReady,
    travelReady,
    descriptionReady,
    completedChecks: checks.filter(Boolean).length,
    issues: checks.filter((complete) => !complete),
    ready: checks.every(Boolean),
  };
}

function getCityName(cities, id) {
  if (!id) return "Not set";

  const city = cities.find((item) => String(item.id) === String(id));
  return city?.city || city?.name || `City ${id}`;
}

function getExcursionName(excursion) {
  return (
    excursion.name ||
    excursion.excursion?.name ||
    `Excursion ${excursion.id ?? excursion.excursion_id}`
  );
}

function getDayKey(day) {
  return day.id ?? `${day.date}-${day._index}`;
}

function getDayElementId(day) {
  return `review-day-${getDayKey(day)}`;
}

function formatDate(value) {
  if (!value) return "Date not set";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTravelTime(minutes) {
  const totalMinutes = Number(minutes || 0);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (!hours) return `${remainingMinutes} min`;
  if (!remainingMinutes) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}
