import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Pencil,
  Route,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { fetchDistance } from "@/app/slices/standardDescriptionSlice";
import { cn } from "@/lib/utils";
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
import ExcursionSelector from "@/components/ui/excursion-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StandardDescriptionSelector from "@/components/ui/standard-description-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import StandardDescriptionPreviewCard from "./StandardDescriptionPreviewCard";
import StopsMultiSelect from "./StopsMultiSelect";

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
  onSetEditingDescription,
  onOpenEditDialog,
  onExcursionSearch,
}) {
  const [expandedDayIndex, setExpandedDayIndex] = useState(null);
  const [savingDayIndex, setSavingDayIndex] = useState(null);
  const [distanceDayIndex, setDistanceDayIndex] = useState(null);
  const [previewDescription, setPreviewDescription] = useState(null);

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

  const getCityName = (id) => cityNameById[String(id)] || "";

  async function handleSaveDay(index) {
    if (!onSaveDay) return;

    setSavingDayIndex(index);
    await onSaveDay(days[index]);
    setSavingDayIndex(null);
  }

  async function handleFetchDistance(index) {
    const day = days[index];

    if (!day?.starting_city_id || !day?.destination_city_id) {
      toast.error("Select the day route first");
      return;
    }

    const originCity = getCityName(day.starting_city_id);
    const destinationCity = getCityName(day.destination_city_id);

    if (!originCity || !destinationCity) {
      toast.error("Selected cities could not be found");
      return;
    }

    try {
      setDistanceDayIndex(index);

      const stops = (day.stop_ids || [])
        .map((id) => getCityName(id))
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

      onUpdateDay(index, {
        mileage: Math.round(result.Distance / 1000),
        travel_time_minutes: Math.round(result.Duration / 1e9 / 60),
      });

      toast.success("Travel details calculated");
    } catch (error) {
      console.error(error);
      toast.error(error || "Failed to calculate travel details");
    } finally {
      setDistanceDayIndex(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Daily Schedule</h3>
          <p className="text-sm text-muted-foreground">
            Set each route, then open the day plan only when more detail is needed.
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

      <div className="overflow-hidden rounded-md border bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[120px]">Day</TableHead>
                <TableHead className="min-w-[420px]">Route</TableHead>
                <TableHead className="min-w-[210px]">Day Plan</TableHead>
                <TableHead className="min-w-[250px]">Internal Note</TableHead>
                <TableHead className="w-[155px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {days.map((day, index) => {
                const isExpanded = expandedDayIndex === index;
                const isSavingThisDay =
                  isSavingDay && savingDayIndex === index;
                const origin = getCityName(day.starting_city_id);
                const destination = getCityName(day.destination_city_id);
                const isRouteReady = Boolean(origin && destination);

                return (
                  <React.Fragment key={day.id || day.date}>
                    <TableRow className="align-top hover:bg-muted/20">
                      <TableCell className="py-4">
                        <div className="flex items-start gap-2">
                          <div
                            className={cn(
                              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                              isRouteReady
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {day.day_number || index + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium">
                              Day {day.day_number || index + 1}
                            </div>
                            <div className="whitespace-nowrap text-xs text-muted-foreground">
                              {day.date}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] items-center gap-2">
                          {index === 0 ? (
                            <CityCombobox
                              cities={cities}
                              value={day.starting_city_id || ""}
                              placeholder="Search start city"
                              onChange={(value) =>
                                onUpdateDay(index, { starting_city_id: value })
                              }
                            />
                          ) : (
                            <div className="flex h-9 min-w-0 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
                              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
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
                            placeholder="Search destination"
                            onChange={(value) =>
                              onUpdateDay(index, {
                                destination_city_id: value,
                              })
                            }
                          />
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          {isRouteReady ? (
                            <>
                              <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="truncate">
                                {origin} to {destination}
                                {day.stop_ids?.length
                                  ? `, ${day.stop_ids.length} stop${day.stop_ids.length === 1 ? "" : "s"}`
                                  : ""}
                              </span>
                            </>
                          ) : (
                            <span>Complete the route to continue planning.</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {day.excursions?.length || 0} excursion
                              {(day.excursions?.length || 0) === 1 ? "" : "s"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">
                              {day.standard_description
                                ? "Description selected"
                                : "No description"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <Input
                          className="h-9 bg-background"
                          value={day.note || ""}
                          onChange={(event) =>
                            onUpdateDay(index, { note: event.target.value })
                          }
                          placeholder="Optional note"
                        />
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5"
                            onClick={() =>
                              setExpandedDayIndex(isExpanded ? null : index)
                            }
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            Plan
                          </Button>

                          <Button
                            type="button"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleSaveDay(index)}
                            disabled={isSavingDay}
                            title={`Save day ${day.day_number || index + 1}`}
                          >
                            {isSavingThisDay ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={5} className="p-0">
                          <DayPlanWorkspace
                            day={day}
                            index={index}
                            cities={cities}
                            excursions={excursions}
                            standardDescriptions={standardDescriptions}
                            dispatch={dispatch}
                            setStandardDescriptionSearchAction={
                              setStandardDescriptionSearchAction
                            }
                            distanceLoading={distanceDayIndex === index}
                            onUpdateDay={onUpdateDay}
                            onExcursionSearch={onExcursionSearch}
                            onCalculateDistance={() =>
                              handleFetchDistance(index)
                            }
                            onPreviewDescription={setPreviewDescription}
                            onEditDescription={(description) => {
                              onSetEditingDescription(description);
                              onOpenEditDialog(true);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}

              {!days.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No schedule days are available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={Boolean(previewDescription)}
        onOpenChange={(open) => {
          if (!open) setPreviewDescription(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Standard Description Preview</DialogTitle>
          </DialogHeader>

          <StandardDescriptionPreviewCard
            description={previewDescription}
            onEdit={() => {
              onSetEditingDescription(previewDescription);
              setPreviewDescription(null);
              onOpenEditDialog(true);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DayPlanWorkspace({
  day,
  index,
  cities,
  excursions,
  standardDescriptions,
  dispatch,
  setStandardDescriptionSearchAction,
  distanceLoading,
  onUpdateDay,
  onExcursionSearch,
  onCalculateDistance,
  onPreviewDescription,
  onEditDescription,
}) {
  return (
    <div className="border-l-4 border-l-primary/40">
      <div className="flex flex-col gap-1 border-b bg-background px-5 py-3">
        <div className="text-sm font-semibold">
          Day {day.day_number || index + 1} Plan
        </div>
        <div className="text-xs text-muted-foreground">
          Add optional route detail, experiences, and customer-facing content.
        </div>
      </div>

      <div className="grid bg-background xl:grid-cols-3">
        <section className="space-y-4 border-b p-5 xl:border-b-0 xl:border-r">
          <SectionHeading
            icon={Route}
            title="Travel"
            description="Stops and route calculations"
          />

          <StopsMultiSelect
            cities={cities}
            selectedIds={day.stop_ids || []}
            onChange={(value) => onUpdateDay(index, { stop_ids: value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Mileage"
              value={day.mileage || ""}
              placeholder="KM"
              onChange={(value) => onUpdateDay(index, { mileage: value })}
            />
            <Field
              label="Buffer"
              value={day.buffer_mileage || ""}
              placeholder="KM"
              onChange={(value) =>
                onUpdateDay(index, { buffer_mileage: value })
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2">
            <div className="text-xs">
              <div className="text-muted-foreground">Travel time</div>
              <div className="font-medium">
                {day.travel_time_minutes
                  ? `${day.travel_time_minutes} minutes`
                  : "Not calculated"}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onCalculateDistance}
              disabled={distanceLoading}
            >
              {distanceLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Route className="h-4 w-4" />
              )}
              Calculate
            </Button>
          </div>
        </section>

        <section className="space-y-4 border-b p-5 xl:border-b-0 xl:border-r">
          <SectionHeading
            icon={Sparkles}
            title="Excursions"
            description="Experiences included on this day"
          />

          <ExcursionSelector
            items={excursions}
            selected={day.excursions || []}
            setSelected={(updater) => {
              const current = day.excursions || [];
              const next =
                typeof updater === "function" ? updater(current) : updater;

              onUpdateDay(index, { excursions: next });
            }}
            onSearch={onExcursionSearch}
          />
        </section>

        <section className="space-y-4 p-5">
          <SectionHeading
            icon={FileText}
            title="Description"
            description="Customer-facing itinerary content"
          />

          <StandardDescriptionSelector
            items={standardDescriptions}
            selected={day.standard_description}
            setSelected={(item) =>
              onUpdateDay(index, {
                standard_description: item,
                standard_description_id: item?.id || null,
              })
            }
            onSearch={(value) =>
              dispatch(setStandardDescriptionSearchAction(value))
            }
          />

          {day.standard_description ? (
            <div className="space-y-3 rounded-md border bg-muted/20 p-3">
              <div>
                <div className="truncate text-sm font-medium">
                  {day.standard_description.title ||
                    `${day.standard_description.start_city?.name || "Start"} to ${day.standard_description.end_city?.name || "End"}`}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Description attached to this day.
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    onPreviewDescription(day.standard_description)
                  }
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => onEditDescription(day.standard_description)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              No description selected.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        {React.createElement(icon, {
          className: "h-4 w-4 text-muted-foreground",
        })}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

function Field({ label, value, placeholder, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        className="h-9"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
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
          className="h-9 w-full justify-between bg-background px-3 font-normal"
        >
          <span
            className={cn(
              "truncate",
              !selectedCity && "text-muted-foreground"
            )}
          >
            {selectedCity?.name || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
