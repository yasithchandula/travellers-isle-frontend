import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  MapPinned,
  Route,
  Save,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";

import { fetchExcursionsByCity } from "@/app/slices/excursionSlice";
import {
  fetchDistance,
  searchStandardDescriptions,
} from "@/app/slices/standardDescriptionSlice";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import StandardDescriptionPreviewCard from "./StandardDescriptionPreviewCard";
import StandardDescriptionMatchSelector from "./StandardDescriptionMatchSelector";
import ExcursionRecommendationSelector from "./ExcursionRecommendationSelector";
import StopsMultiSelect from "./StopsMultiSelect";

const AUTO_DISTANCE_DELAY = 450;
const DESCRIPTION_MATCH_DELAY = 500;

export default function ScheduleTableStep({
  days = [],
  cities = [],
  excursions = [],
  standardDescriptions = [],
  dispatch,
  setStandardDescriptionSearchAction,
  isLoadingCities = false,
  isSavingDay = false,
  onUpdateDay,
  onSaveDay,
  onSetDayIndex,
  onSetEditingDescription,
  onOpenEditDialog,
  onExcursionSearch,
}) {
  const [savingDayIndex, setSavingDayIndex] = useState(null);
  const [calculatingDays, setCalculatingDays] = useState(() => new Set());
  const [descriptionMatches, setDescriptionMatches] = useState({});
  const [excursionMatches, setExcursionMatches] = useState({});
  const [previewContext, setPreviewContext] = useState(null);
  const latestRouteSignatures = useRef(new Map());
  const latestDescriptionSignatures = useRef(new Map());
  const latestExcursionSignatures = useRef(new Map());
  const daysRef = useRef(days);
  const updateDayRef = useRef(onUpdateDay);

  daysRef.current = days;
  updateDayRef.current = onUpdateDay;

  const cityNameById = useMemo(
    () =>
      cities.reduce((result, city) => {
        result[String(city.id)] = city.name;
        return result;
      }, {}),
    [cities]
  );

  const configuredDays = useMemo(
    () =>
      days.filter(
        (day) => day.starting_city_id && day.destination_city_id
      ).length,
    [days]
  );

  const routeSignatureKey = days
    .map((day) =>
      [
        day.starting_city_id || "",
        ...(day.stop_ids || []),
        day.destination_city_id || "",
      ]
        .map(String)
        .join(">")
    )
    .join("|");

  const descriptionSignatureKey = days
    .map((day) => getDescriptionSearchSignature(day))
    .join("|");
  const excursionSignatureKey = days
    .map((day) => getExcursionSearchSignature(day))
    .join("|");

  useEffect(() => {
    const timers = [];

    daysRef.current.forEach((day, index) => {
      const originCity = cityNameById[String(day.starting_city_id)] || "";
      const destinationCity =
        cityNameById[String(day.destination_city_id)] || "";

      if (!originCity || !destinationCity) {
        latestRouteSignatures.current.delete(index);
        setCalculatingDays((current) => {
          if (!current.has(index)) return current;
          const next = new Set(current);
          next.delete(index);
          return next;
        });
        return;
      }

      const routeSignature = [
        day.starting_city_id,
        ...(day.stop_ids || []),
        day.destination_city_id,
      ]
        .map(String)
        .join(">");

      if (latestRouteSignatures.current.get(index) === routeSignature) return;

      latestRouteSignatures.current.set(index, routeSignature);

      timers.push(
        setTimeout(async () => {
          setCalculatingDays((current) => {
            const next = new Set(current);
            next.add(index);
            return next;
          });

          try {
            const stops = (day.stop_ids || [])
              .map((id) => cityNameById[String(id)])
              .filter(Boolean)
              .map((name) => `${name}, Sri Lanka`);

            const result = await dispatch(
              fetchDistance({
                origin: `${originCity}, Sri Lanka`,
                destination: `${destinationCity}, Sri Lanka`,
                stops,
                travel_mode: "driving",
              })
            ).unwrap();

            if (
              latestRouteSignatures.current.get(index) !== routeSignature
            ) {
              return;
            }

            updateDayRef.current(index, {
              actual_mileage: Math.round(result.Distance / 1000),
              travel_time_minutes: Math.round(result.Duration / 1e9 / 60),
            });
          } catch (error) {
            console.error(error);
            toast.error(
              `Could not calculate travel details for day ${
                day.day_number || index + 1
              }`
            );
          } finally {
            if (
              latestRouteSignatures.current.get(index) === routeSignature
            ) {
              setCalculatingDays((current) => {
                const next = new Set(current);
                next.delete(index);
                return next;
              });
            }
          }
        }, AUTO_DISTANCE_DELAY)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [cityNameById, dispatch, routeSignatureKey]);

  useEffect(() => {
    const timers = [];

    daysRef.current.forEach((day, index) => {
      const signature = getDescriptionSearchSignature(day);

      if (latestDescriptionSignatures.current.get(index) === signature) return;

      latestDescriptionSignatures.current.set(index, signature);
      setDescriptionMatches((current) => ({
        ...current,
        [index]: {
          ...(current[index] || {}),
          loading: true,
          error: null,
        },
      }));

      timers.push(
        setTimeout(async () => {
          try {
            const result = await dispatch(
              searchStandardDescriptions(buildDescriptionSearchPayload(day))
            ).unwrap();

            if (
              latestDescriptionSignatures.current.get(index) !== signature
            ) {
              return;
            }

            setDescriptionMatches((current) => ({
              ...current,
              [index]: {
                loading: false,
                error: null,
                exactMatch: result.exact_match || null,
                suggestions: result.suggestions || [],
              },
            }));

            applyExactDescriptionMatch(
              index,
              daysRef.current[index],
              result.exact_match || null,
              updateDayRef.current
            );
          } catch (error) {
            if (
              latestDescriptionSignatures.current.get(index) !== signature
            ) {
              return;
            }

            setDescriptionMatches((current) => ({
              ...current,
              [index]: {
                loading: false,
                error: error || "Failed to find standard descriptions",
                exactMatch: null,
                suggestions: [],
              },
            }));
          }
        }, DESCRIPTION_MATCH_DELAY)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [descriptionSignatureKey, dispatch]);

  useEffect(() => {
    const timers = [];

    daysRef.current.forEach((day, index) => {
      const signature = getExcursionSearchSignature(day);

      if (latestExcursionSignatures.current.get(index) === signature) return;

      latestExcursionSignatures.current.set(index, signature);
      setExcursionMatches((current) => ({
        ...current,
        [index]: {
          ...(current[index] || {}),
          loading: true,
          error: null,
        },
      }));

      timers.push(
        setTimeout(async () => {
          try {
            const stopIds = Array.from(
              new Set((day.stop_ids || []).map(Number).filter(Boolean))
            );
            const responses = await Promise.all(
              stopIds.map((city) =>
                dispatch(fetchExcursionsByCity({ search: "", city })).unwrap()
              )
            );
            const recommended = mergeItemsById(responses.flat());

            if (latestExcursionSignatures.current.get(index) !== signature) {
              return;
            }

            setExcursionMatches((current) => ({
              ...current,
              [index]: {
                loading: false,
                error: null,
                recommended,
              },
            }));

            applyAutoExcursionMatches(
              index,
              daysRef.current[index],
              recommended,
              updateDayRef.current
            );
          } catch (error) {
            if (latestExcursionSignatures.current.get(index) !== signature) {
              return;
            }

            setExcursionMatches((current) => ({
              ...current,
              [index]: {
                loading: false,
                error: error || "Failed to find excursions",
                recommended: [],
              },
            }));
          }
        }, DESCRIPTION_MATCH_DELAY)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [dispatch, excursionSignatureKey]);

  const getCityName = (id) => cityNameById[String(id)] || "";

  async function handleSaveDay(index) {
    if (!onSaveDay) return;

    setSavingDayIndex(index);
    await onSaveDay(days[index]);
    setSavingDayIndex(null);
  }

  function updateExcursions(index, day, updater) {
    const current = day.excursions || [];
    const next = typeof updater === "function" ? updater(current) : updater;
    onUpdateDay(index, { excursions: next });
  }

  function editDescription(description, index) {
    onSetDayIndex?.(index);
    onSetEditingDescription(description);
    onOpenEditDialog(true);
  }

  function updateSelectedDescription(index, selected) {
    onUpdateDay(index, {
      standard_description: selected || null,
      standard_description_id: selected?.id || null,
      auto_standard_description_id: null,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Daily Schedule</h3>
          <p className="text-sm text-muted-foreground">
            Plan each day directly in the row. Distance and travel time update
            automatically.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isLoadingCities && (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading cities
            </span>
          )}
          <span className="font-medium">
            {configuredDays} of {days.length} routes ready
          </span>
        </div>
      </div>

      <div className="space-y-5">
          {days.map((day, index) => {
            const isSavingThisDay = isSavingDay && savingDayIndex === index;
            const isCalculating = calculatingDays.has(index);
            const origin = getCityName(day.starting_city_id);
            const destination = getCityName(day.destination_city_id);
            const isRouteReady = Boolean(origin && destination);
            const dayNumber = day.day_number || index + 1;
            const stopsCount = day.stop_ids?.length || 0;
            const excursionsCount = day.excursions?.length || 0;
            const selectedDescription = day.standard_description || null;
            const descriptionMatch = descriptionMatches[index] || {};
            const excursionMatch = excursionMatches[index] || {};

            return (
              <article
                key={day.id || day.date}
                className={cn(
                  "group relative overflow-hidden rounded-xl border-2 bg-card shadow-sm transition-all hover:border-primary/25 hover:shadow-md",
                  isRouteReady ? "border-border" : "border-dashed"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 w-1",
                    isRouteReady ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />

                <header className="flex flex-col gap-3 border-b bg-muted/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:pl-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg text-primary-foreground shadow-sm",
                        isRouteReady ? "bg-primary" : "bg-muted-foreground"
                      )}
                    >
                      <span className="text-[9px] font-semibold uppercase leading-none tracking-wider">
                        Day
                      </span>
                      <span className="mt-0.5 text-lg font-bold leading-none">
                        {dayNumber}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <h4 className="truncate text-sm font-semibold">
                          {isRouteReady
                            ? `${origin} to ${destination}`
                            : `Plan day ${dayNumber} route`}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0",
                            isRouteReady
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          )}
                        >
                          {isRouteReady ? "Route ready" : "Route needed"}
                        </Badge>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="font-medium">{day.date}</span>
                        <DaySummaryItem
                          icon={MapPinned}
                          label={`${stopsCount} stop${stopsCount === 1 ? "" : "s"}`}
                        />
                        <DaySummaryItem
                          icon={Sparkles}
                          label={`${excursionsCount} excursion${
                            excursionsCount === 1 ? "" : "s"
                          }`}
                        />
                        <DaySummaryItem
                          icon={FileText}
                          label={
                            selectedDescription
                              ? "Description selected"
                              : "No description"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="h-9 w-full gap-2 sm:w-auto"
                    onClick={() => handleSaveDay(index)}
                    disabled={isSavingDay}
                    title={`Save day ${dayNumber}`}
                  >
                    {isSavingThisDay ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Day {dayNumber}
                  </Button>
                </header>

                <div className="grid gap-4 px-4 py-4 sm:pl-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
                  <CompactField icon={Route} label="Day Route">
                    <div className="grid grid-cols-[minmax(0,1fr)_18px_minmax(0,1fr)] items-center gap-2">
                      {index === 0 ? (
                        <CityCombobox
                          cities={cities}
                          value={day.starting_city_id || ""}
                          placeholder="Start city"
                          onChange={(value) =>
                            onUpdateDay(index, { starting_city_id: value })
                          }
                        />
                      ) : (
                        <div className="flex h-9 min-w-0 items-center gap-2 rounded-md border bg-muted/40 px-2.5 text-sm">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span
                            className={cn(
                              "truncate",
                              !origin && "text-muted-foreground"
                            )}
                          >
                            {origin || "Previous destination"}
                          </span>
                        </div>
                      )}

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />

                      <CityCombobox
                        cities={cities}
                        value={day.destination_city_id || ""}
                        placeholder="Destination"
                        onChange={(value) =>
                          onUpdateDay(index, {
                            destination_city_id: value,
                          })
                        }
                      />
                    </div>
                  </CompactField>

                  <CompactField
                    icon={Route}
                    label="Automatic Travel"
                    status={isCalculating ? "Calculating" : null}
                  >
                    <div
                      className={cn(
                        "grid grid-cols-[1fr_1fr_76px] items-center gap-2 rounded-lg border bg-background p-2",
                        isCalculating && "border-primary/30 bg-primary/5"
                      )}
                    >
                      <TravelMetric
                        icon={isCalculating ? Loader2 : Route}
                        iconClassName={isCalculating ? "animate-spin" : ""}
                        label={isCalculating ? "Calculating" : "Distance"}
                        value={
                          day.actual_mileage !== "" &&
                          day.actual_mileage !== null &&
                          day.actual_mileage !== undefined
                            ? `${day.actual_mileage} km`
                            : "—"
                        }
                      />
                      <TravelMetric
                        icon={Clock3}
                        label="Drive time"
                        value={formatTravelTime(day.travel_time_minutes)}
                      />
                      <div className="min-w-0 border-l pl-2">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Buffer
                        </div>
                        <Input
                          className="mt-0.5 h-6 min-w-0 border-0 bg-transparent px-0 text-xs font-semibold shadow-none focus-visible:ring-0"
                          type="number"
                          min="0"
                          value={day.buffer_mileage || ""}
                          onChange={(event) =>
                            onUpdateDay(index, {
                              buffer_mileage: event.target.value,
                            })
                          }
                          placeholder="0 km"
                        />
                      </div>
                    </div>
                  </CompactField>
                </div>

                <div className="border-t bg-muted/25 px-4 py-4 sm:pl-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-foreground">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-background shadow-sm ring-1 ring-border">
                        <CircleCheck className="h-3.5 w-3.5 text-primary" />
                      </span>
                      Day {dayNumber} Details
                    </div>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[0.7fr_0.9fr_1.25fr_1.15fr]">
                    <CompactField icon={MapPinned} label="Stops">
                      <StopsMultiSelect
                        compact
                        cities={cities}
                        selectedIds={day.stop_ids || []}
                        onChange={(value) =>
                          onUpdateDay(index, { stop_ids: value })
                        }
                      />
                    </CompactField>

                    <CompactField
                      icon={Sparkles}
                      label="Excursions"
                      status={
                        excursionsCount ? `${excursionsCount} selected` : null
                      }
                    >
                      <ExcursionRecommendationSelector
                        items={excursions}
                        recommended={excursionMatch.recommended || []}
                        selected={day.excursions || []}
                        loading={excursionMatch.loading}
                        error={excursionMatch.error}
                        stopCount={stopsCount}
                        cities={cities}
                        setSelected={(updater) =>
                          updateExcursions(index, day, updater)
                        }
                        onSearch={onExcursionSearch}
                      />
                    </CompactField>

                    <CompactField
                      icon={FileText}
                      label="Standard Description"
                      status={
                        selectedDescription ? "Selected" : null
                      }
                    >
                      <StandardDescriptionMatchSelector
                        selected={selectedDescription}
                        exactMatch={descriptionMatch.exactMatch}
                        suggestions={descriptionMatch.suggestions}
                        allDescriptions={standardDescriptions}
                        loading={descriptionMatch.loading}
                        error={descriptionMatch.error}
                        onSelect={(selected) =>
                          updateSelectedDescription(index, selected)
                        }
                        onSearchAll={(value) =>
                          dispatch(setStandardDescriptionSearchAction(value))
                        }
                        onPreview={(description) =>
                          setPreviewContext({ description, index })
                        }
                        onEdit={(description) =>
                          editDescription(description, index)
                        }
                      />
                    </CompactField>

                    <CompactField icon={StickyNote} label="Internal Note">
                      <Input
                        className="h-9 bg-background"
                        value={day.note || ""}
                        onChange={(event) =>
                          onUpdateDay(index, { note: event.target.value })
                        }
                        placeholder="Optional note for your team"
                      />
                    </CompactField>
                  </div>
                </div>
              </article>
            );
          })}

          {!days.length && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No schedule days are available.
            </div>
          )}
      </div>

      <Dialog
        open={Boolean(previewContext)}
        onOpenChange={(open) => {
          if (!open) setPreviewContext(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Standard Description Preview</DialogTitle>
          </DialogHeader>

          <StandardDescriptionPreviewCard
            description={previewContext?.description}
            onEdit={() => {
              editDescription(
                previewContext?.description,
                previewContext?.index
              );
              setPreviewContext(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DaySummaryItem({ icon, label }) {
  const Icon = icon;

  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function CompactField({ icon, label, status, children }) {
  return (
    <div className="min-w-0">
      <FieldLabel icon={icon} label={label} status={status} />
      {children}
    </div>
  );
}

function FieldLabel({ icon, label, status, mobileOnly = false }) {
  const Icon = icon;

  return (
    <div
      className={cn(
        "mb-1.5 flex h-4 items-center justify-between gap-2",
        mobileOnly && "lg:hidden"
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      {status && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
          <CircleCheck className="h-3 w-3" />
          {status}
        </span>
      )}
    </div>
  );
}

function TravelMetric({ icon, iconClassName, label, value }) {
  const Icon = icon;

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Icon className={cn("h-3 w-3 shrink-0", iconClassName)} />
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-0.5 truncate text-xs font-semibold">{value}</div>
    </div>
  );
}

function formatTravelTime(minutes) {
  const totalMinutes = Number(minutes || 0);
  if (!totalMinutes) return "—";

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (!hours) return `${remainingMinutes}m`;
  if (!remainingMinutes) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

function buildDescriptionSearchPayload(day) {
  return {
    start_city: day?.starting_city_id
      ? Number(day.starting_city_id)
      : null,
    end_city: day?.destination_city_id
      ? Number(day.destination_city_id)
      : null,
    excursions: (day?.excursions || [])
      .map((excursion) => ({
        excursion_id: Number(excursion.excursion_id ?? excursion.id),
        is_optional: excursion.is_optional === true,
      }))
      .filter((excursion) => Boolean(excursion.excursion_id)),
  };
}

function getDescriptionSearchSignature(day) {
  const payload = buildDescriptionSearchPayload(day);
  const stops = (day?.stop_ids || []).map(String).join(",");
  const excursions = payload.excursions
    .map(
      (excursion) =>
        `${excursion.excursion_id}:${excursion.is_optional ? "1" : "0"}`
    )
    .join(",");

  return `${payload.start_city ?? "null"}>${stops}>${
    payload.end_city ?? "null"
  }|${excursions}`;
}

function applyExactDescriptionMatch(index, day, exactMatch, updateDay) {
  if (!day) return;

  const previousAutoId = day.auto_standard_description_id
    ? String(day.auto_standard_description_id)
    : null;
  const currentIsPreviousAuto =
    previousAutoId &&
    String(day.standard_description?.id) === previousAutoId;
  const selectedDescription = exactMatch
    ? exactMatch
    : currentIsPreviousAuto
      ? null
      : day.standard_description || null;

  updateDay(index, {
    standard_description: selectedDescription,
    standard_description_id: selectedDescription?.id || null,
    auto_standard_description_id: exactMatch?.id || null,
  });
}

function getExcursionSearchSignature(day) {
  return (day?.stop_ids || []).map(String).sort().join(",");
}

function mergeItemsById(items) {
  const result = new Map();

  items.forEach((item) => {
    const id = getExcursionId(item);
    if (!id) return;
    result.set(String(id), { ...item, id });
  });

  return Array.from(result.values());
}

function applyAutoExcursionMatches(index, day, recommended, updateDay) {
  if (!day) return;

  const previousAutoIds = new Set(
    (day.auto_excursion_ids || []).map(String)
  );
  const manualSelections = (day.excursions || []).filter(
    (excursion) => !previousAutoIds.has(String(getExcursionId(excursion)))
  );
  const autoSelections = recommended.map((excursion) => ({
    ...excursion,
    is_optional: false,
  }));
  const excursions = mergeItemsById([...autoSelections, ...manualSelections]);

  updateDay(index, {
    excursions,
    auto_excursion_ids: recommended.map((excursion) => excursion.id),
  });
}

function getExcursionId(excursion) {
  return excursion?.id ?? excursion?.excursion_id ?? null;
}

function CityCombobox({
  cities = [],
  value,
  onChange,
  placeholder = "Search city",
}) {
  const [open, setOpen] = useState(false);
  const selectedCity = cities.find((city) => String(city.id) === String(value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-full justify-between bg-background px-2.5 font-normal"
        >
          <span
            className={cn(
              "truncate",
              !selectedCity && "text-muted-foreground"
            )}
          >
            {selectedCity?.name || placeholder}
          </span>
          <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => {
                const isSelected = String(city.id) === String(value);

                return (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => {
                      onChange?.(String(city.id));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{city.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
