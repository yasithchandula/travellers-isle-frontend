"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { fetchExcursions } from "@/app/slices/excursionSlice";
import {
  fetchStandardDescriptions,
  setStandardDescriptionSearch,
} from "@/app/slices/standardDescriptionSlice";
import { updateQuotationDay, fetchQuotationFullDetails } from "@/app/slices/quotationSlice";

import ExcursionSelector from "@/components/ui/excursion-selector";
import StandardDescriptionSelector from "@/components/ui/standard-description-selector";

import { cn } from "@/lib/utils";
import { Check, Loader2, MapPinned, NotebookPen, Sparkles } from "lucide-react";

import { fetchCities } from "../../app/slices/citySlice";
import { Badge } from "@/components/ui/badge";
import { buildImageUrl } from "../../utils/urls";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import StandardDescriptionForm from "../../components/forms/StandardDescriptionForm";

import { createStandardDescription } from "../../api/mock/standardDescriptionMock";

import { useParams } from "react-router-dom";

/* ======================
   DATE HELPERS
====================== */

function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function generateTourDates(startDateISO, daysCount) {
  const dates = [];
  const base = new Date(`${startDateISO}T00:00:00`);

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    dates.push(toISODate(d));
  }

  return dates;
}

function formatNotes(days) {
  return days
    .filter((d) => d.note?.trim())
    .map((d) => `${d.date}: ${d.note.trim()}`)
    .join("\n");
}

/* ======================
   STEPPER
====================== */

function ModernStepper({ steps, currentStep, onStepChange }) {
  return (
    <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-4">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isDone = currentStep > index;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(index)}
              className={cn(
                "group flex min-w-fit items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all",
                isActive &&
                "border-ti-forest bg-ti-forest text-white shadow-sm",
                isDone &&
                "border-ti-forest/20 bg-ti-forest/10 text-ti-forest hover:bg-ti-forest/15",
                !isActive &&
                !isDone &&
                "border-border bg-card text-muted-foreground hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isActive && "bg-white/20 text-white",
                  isDone && "bg-ti-forest text-white",
                  !isActive && !isDone && "bg-muted text-foreground"
                )}
              >
                {isDone ? <Check size={14} /> : index + 1}
              </div>

              <div className="text-left">
                <div className="font-medium">{step.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ======================
   SMALL SUMMARY CHIP
====================== */

function SummaryBadge({ children }) {
  return (
    <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
      {children}
    </div>
  );
}

/* ======================
   MAIN PAGE
====================== */

export default function QuotationWizardModernPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const excursions = useSelector((s) => s.excursions?.items || []);
  const quotationShell = useSelector((s) => s.quotations?.quotationShell);

  const {
    items: standardDescriptions = [],
    search: descriptionSearch = "",
  } = useSelector((s) => s.standardDescriptions || {});

  const [excursionSearch, setExcursionSearch] = useState("");
  const [step, setStep] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [CITIES, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isSavingDay, setIsSavingDay] = useState(false);
  const [isSavingQuotation, setIsSavingQuotation] = useState(false);

  const [editingDescription, setEditingDescription] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const loadAllCities = async () => {
      try {
        setIsLoadingCities(true);

        let page = 1;
        const limit = 50;
        let allCities = [];
        let totalPages = 1;

        do {
          const res = await dispatch(
            fetchCities({ search: "", page, limit })
          ).unwrap();

          const data = res?.data || res;

          if (!data?.items) {
            throw new Error("Invalid city response");
          }

          allCities = [...allCities, ...data.items];
          totalPages = data.total_pages || 1;

          page++;
        } while (page <= totalPages);

        const formatted = allCities.map((c) => ({
          id: String(c.id),
          name: c.city,
        }));

        setCities(formatted);
      } catch (err) {
        console.error("Failed to load cities:", err);
        toast.error("Failed to load cities");
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadAllCities();
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchQuotationFullDetails(id));
  }, [id, dispatch]);

  /* ======================
     INFO FROM SHELL
  ====================== */

  const info = {
    startDate: quotationShell?.start_date,
    daysCount: quotationShell?.days_count,
  };

  const [days, setDays] = useState([]);

  /* ======================
     LOAD DATA
  ====================== */

  useEffect(() => {
    dispatch(fetchExcursions());
  }, [dispatch]);

  useEffect(() => {
    if (excursionSearch.length < 2) return;
    dispatch(fetchExcursions({ search: excursionSearch }));
  }, [dispatch, excursionSearch]);

  useEffect(() => {
    dispatch(
      fetchStandardDescriptions({
        search: descriptionSearch,
        page: 1,
        limit: 20,
      })
    );
  }, [dispatch, descriptionSearch]);

  /* ======================
     INIT DAYS FROM SHELL
  ====================== */

  useEffect(() => {
    if (!quotationShell) return;

    if (!quotationShell.start_date || !quotationShell.days_count) return;

    const dates = generateTourDates(
      quotationShell.start_date,
      quotationShell.days_count
    );

    const apiDays = quotationShell.itinerary || [];

    const mappedDays = dates.map((date, i) => {
      const apiDay = apiDays[i] || {};

      return {
        id: apiDay.id || null,
        day_number: apiDay.day_number || i + 1,
        date,

        // 👇 IMPORTANT (handle 0 properly)
        starting_city_id:
          apiDay.start_city_id && apiDay.start_city_id !== 0
            ? String(apiDay.start_city_id)
            : "",

        destination_city_id:
          apiDay.end_city_id && apiDay.end_city_id !== 0
            ? String(apiDay.end_city_id)
            : "",

        stop_ids: (apiDay.stop_ids || []).map(String),

        excursions: apiDay.excursions || [],

        standard_description:
          apiDay.standard_description || null,

        standard_description_id:
          apiDay.standard_description_id || null,

        note: apiDay.note || "",
      };
    });

    setDays(mappedDays);
  }, [quotationShell]);

  /* ======================
     UPDATE DAY
  ====================== */

  function updateDay(idx, patch) {
    setDays((prev) => {
      const updated = [...prev];

      updated[idx] = { ...updated[idx], ...patch };

      // if destination city changes → next day's starting city
      if (patch.destination_city_id && updated[idx + 1]) {
        updated[idx + 1] = {
          ...updated[idx + 1],
          starting_city_id: patch.destination_city_id,
        };
      }

      return updated;
    });
  }

  /* ======================
     SAVE DAY TO API
  ====================== */

  async function saveDayToApi(dayData, showSuccessToast = true) {
    if (!dayData?.id) return true;

    const payload = {
      id: dayData.id,

      start_city_id: dayData.starting_city_id
        ? Number(dayData.starting_city_id)
        : null,

      end_city_id: dayData.destination_city_id
        ? Number(dayData.destination_city_id)
        : null,

      staying_city_id: dayData.destination_city_id
        ? Number(dayData.destination_city_id)
        : null,

      stop_ids: (dayData.stop_ids || []).map((id) => Number(id)),

      standard_description_id: dayData.standard_description?.id || null,

      note: dayData.note || "",
    };

    try {
      setIsSavingDay(true);
      await dispatch(updateQuotationDay(payload)).unwrap();

      if (showSuccessToast) {
        toast.success(`Day ${dayData.day_number || dayIndex + 1} saved`);
      }

      return true;
    } catch (err) {
      console.error("Failed to update day:", err);
      toast.error("Failed to save day");
      return false;
    } finally {
      setIsSavingDay(false);
    }
  }

  /* ======================
     NAVIGATION
  ====================== */

  function nextStep() {
    setStep((s) => Math.min(2, s + 1));
  }

  function prevStep() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function nextDay() {
    const currentDay = days[dayIndex];
    const ok = await saveDayToApi(currentDay);

    if (!ok) return;

    setDayIndex((d) => Math.min(days.length - 1, d + 1));
  }

  async function prevDay() {
    setDayIndex((d) => Math.max(0, d - 1));
  }

  const formattedNotes = useMemo(() => formatNotes(days), [days]);

  const steps = [
    { id: "schedule", label: "Schedule" },
    { id: "itinerary", label: "Itinerary" },
    { id: "review", label: "Review" },
  ];

  const day = days[dayIndex];

  const totalExcursions = days.reduce(
    (sum, d) => sum + (d.excursions?.length || 0),
    0
  );

  const totalDescriptions = days.reduce(
    (sum, d) => sum + (d.standard_descriptions?.length || 0),
    0
  );

  async function handleSaveQuotation() {
    try {
      setIsSavingQuotation(true);

      if (days[dayIndex]) {
        await saveDayToApi(days[dayIndex], false);
      }

      const payload = {
        info,
        days,
        formattedNotes,
      };

      console.log(payload);

      toast.success("Quotation saved");
      alert("Quotation Saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save quotation");
    } finally {
      setIsSavingQuotation(false);
    }
  }

  async function handleCreateFromEdit(payload) {
    try {

      const res = await dispatch(createStandardDescription(payload)).unwrap();

      const newDescription = res?.data || res;

      if (!newDescription?.id) {
        throw new Error("Invalid response");
      }

      // replace current selected description
      updateDay(dayIndex, {
        standard_description: newDescription,
      });

      // refresh list
      dispatch(
        fetchStandardDescriptions({
          search: "",
          page: 1,
          limit: 20,
        })
      );

      toast.success("New description created from edit");

      setOpenEditDialog(false);
      setEditingDescription(null);

    } catch (err) {
      console.error(err);
      toast.error("Failed to create description");
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ModernStepper
        steps={steps}
        currentStep={step}
        onStepChange={setStep}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="border-b bg-card/80">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Quotation Builder
                </CardTitle>
                <CardDescription className="text-sm">
                  Build the schedule, itinerary, and notes for this quotation.
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <SummaryBadge>
                  {days.length || 0} {days.length === 1 ? "day" : "days"}
                </SummaryBadge>
                <SummaryBadge>
                  {totalExcursions} excursion{totalExcursions === 1 ? "" : "s"}
                </SummaryBadge>
                <SummaryBadge>
                  {totalDescriptions} description
                  {totalDescriptions === 1 ? "" : "s"}
                </SummaryBadge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-4 md:p-6">
            {/* ======================
                STEP 1
            ====================== */}

            {step === 0 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Schedule Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Assign cities, excursions, and notes for each day.
                    </p>
                  </div>

                  {isLoadingCities && (
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading cities...
                    </div>
                  )}
                </div>

                <div className="overflow-hidden rounded-xl border bg-background">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="min-w-[130px]">Date</TableHead>
                          <TableHead className="min-w-[220px]">City</TableHead>
                          <TableHead className="min-w-[320px]">
                            Excursions
                          </TableHead>
                          <TableHead className="min-w-[220px]">Note</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {days.map((d, idx) => (
                          <TableRow
                            key={d.date}
                            className="align-top transition-colors hover:bg-muted/30"
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col gap-1">
                                <span>{d.date}</span>
                                <span className="text-xs text-muted-foreground">
                                  Day {d.day_number || idx + 1}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Select
                                value={d.destination_city_id}
                                onValueChange={(v) =>
                                  updateDay(idx, { destination_city_id: v })
                                }
                              >
                                <SelectTrigger className="w-[220px] bg-background">
                                  <SelectValue placeholder="City" />
                                </SelectTrigger>

                                <SelectContent>
                                  {CITIES.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                      {c.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell className="min-w-[320px]">
                              <ExcursionSelector
                                items={excursions}
                                selected={d.excursions}
                                setSelected={(updater) => {
                                  updateDay(idx, {
                                    excursions:
                                      typeof updater === "function"
                                        ? updater(days[idx].excursions || [])
                                        : updater,
                                  });
                                }}
                                onSearch={(v) => setExcursionSearch(v)}
                              />
                            </TableCell>

                            <TableCell>
                              <Input
                                className="max-w-[260px] bg-background"
                                value={d.note}
                                onChange={(e) =>
                                  updateDay(idx, {
                                    note: e.target.value,
                                  })
                                }
                                placeholder="Add quick note"
                              />
                            </TableCell>
                          </TableRow>
                        ))}

                        {!days.length && (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="py-10 text-center text-sm text-muted-foreground"
                            >
                              No days available yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================
                STEP 2
            ====================== */}

            {step === 1 && day && (
              <Card className="overflow-hidden border-border/60 shadow-none">
                <CardHeader className="border-b bg-muted/20">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Day {dayIndex + 1}
                      </CardTitle>
                      <CardDescription>{day.date}</CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <SummaryBadge>
                        {day.excursions?.length || 0} selected excursion
                        {(day.excursions?.length || 0) === 1 ? "" : "s"}
                      </SummaryBadge>
                      <SummaryBadge>
                        {day.standard_descriptions?.length || 0} standard
                        description
                        {(day.standard_descriptions?.length || 0) === 1
                          ? ""
                          : "s"}
                      </SummaryBadge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-4 md:p-6">
                  <div className="space-y-6">

                    {/* ROW 1 */}
                    <div className="grid gap-6 lg:grid-cols-3">

                      {/* Starting City */}
                      <div className="space-y-2">
                        <Label className="inline-flex items-center gap-2">
                          <MapPinned className="h-4 w-4 text-muted-foreground" />
                          Starting City
                        </Label>

                        <Select
                          value={day.starting_city_id}
                          onValueChange={(v) =>
                            updateDay(dayIndex, { starting_city_id: v })
                          }
                        >
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Starting city" />
                          </SelectTrigger>

                          <SelectContent>
                            {CITIES.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
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
                          value={day.destination_city_id}
                          onValueChange={(v) =>
                            updateDay(dayIndex, { destination_city_id: v })
                          }
                        >
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Destination city" />
                          </SelectTrigger>

                          <SelectContent>
                            {CITIES.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Stops */}
                      <div className="space-y-2">
                        <Label className="inline-flex items-center gap-2">
                          <MapPinned className="h-4 w-4 text-muted-foreground" />
                          Stops
                        </Label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between bg-background"
                            >
                              {day.stop_ids?.length
                                ? `${day.stop_ids.length} stop${day.stop_ids.length > 1 ? "s" : ""} selected`
                                : "Select stops"}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-[320px] p-0">
                            <Command>
                              <CommandInput placeholder="Search city..." />

                              <CommandList>
                                <CommandEmpty>No city found.</CommandEmpty>

                                <CommandGroup>
                                  {CITIES.map((city) => {
                                    const selected = day.stop_ids?.includes(city.id);

                                    return (
                                      <CommandItem
                                        key={city.id}
                                        value={city.name}
                                        onSelect={() => {
                                          const current = day.stop_ids || [];

                                          const updated = selected
                                            ? current.filter((id) => id !== city.id)
                                            : [...current, city.id];

                                          updateDay(dayIndex, {
                                            stop_ids: updated,
                                          });
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selected ? "opacity-100" : "opacity-0"
                                          )}
                                        />

                                        {city.name}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {day.stop_ids?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {day.stop_ids.map((id) => {
                              const city = CITIES.find((c) => c.id === id);

                              return (
                                <Badge key={id} variant="secondary">
                                  {city?.name}
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* ROW 2 — FULL WIDTH NOTE */}
                    <div className="space-y-2">
                      <Label className="inline-flex items-center gap-2">
                        <NotebookPen className="h-4 w-4 text-muted-foreground" />
                        Day Note
                      </Label>

                      <Textarea
                        value={day.note}
                        onChange={(e) =>
                          updateDay(dayIndex, {
                            note: e.target.value,
                          })
                        }
                        className="min-h-[90px] resize-none bg-background"
                        placeholder="Add detailed note for this day"
                      />
                    </div>

                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <div className="mb-3 space-y-1">
                      <Label>Excursions</Label>
                      <p className="text-sm text-muted-foreground">
                        Select excursions for this day.
                      </p>
                    </div>

                    <ExcursionSelector
                      items={excursions}
                      selected={day.excursions}
                      setSelected={(updater) => {
                        updateDay(dayIndex, {
                          excursions:
                            typeof updater === "function"
                              ? updater(days[dayIndex].excursions || [])
                              : updater,
                        });
                      }}
                      onSearch={(v) => setExcursionSearch(v)}
                    />
                  </div>

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
                        updateDay(dayIndex, {
                          standard_description: item
                        })
                      }
                      onSearch={(val) =>
                        dispatch(setStandardDescriptionSearch(val))
                      }
                    />

                    {day.standard_description && (
                      <Card className="mt-4 overflow-hidden">
                        <CardContent className="space-y-4 p-4">
                          <div className="flex justify-between items-start">
                            <div className="font-semibold">
                              {day.standard_description.start_city?.name}
                              {" → "}
                              {day.standard_description.end_city?.name}
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDescription(day.standard_description);
                                setOpenEditDialog(true);
                              }}
                            >
                              Edit
                            </Button>
                          </div>

                          {day.standard_description.title && (
                            <div className="text-sm font-medium text-muted-foreground">
                              {day.standard_description.title}
                            </div>
                          )}

                          {/* image preview */}
                          {(day.standard_description.featured_image ||
                            day.standard_description.gallery?.length > 0) && (
                              <div className="space-y-2">
                                {day.standard_description.featured_image && (
                                  <img
                                    src={buildImageUrl(day.standard_description.featured_image)}
                                    alt={day.standard_description.title || "Standard description"}
                                    className="h-48 w-full rounded-lg object-cover border"
                                  />
                                )}

                                {day.standard_description.gallery?.length > 0 && (
                                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {day.standard_description.gallery.map((img, index) => (
                                      <img
                                        key={`${img}-${index}`}
                                        src={buildImageUrl(img)}
                                        alt={`Gallery ${index + 1}`}
                                        className="h-24 w-full rounded-md object-cover border"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                          {day.standard_description.starting_paragraph && (
                            <div
                              className="text-sm text-muted-foreground prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: day.standard_description.starting_paragraph,
                              }}
                            />
                          )}

                          {day.standard_description.description && (
                            <div
                              className="text-sm prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: day.standard_description.description,
                              }}
                            />
                          )}

                          {day.standard_description.excursions?.length > 0 && (
                            <div className="pt-2">
                              <div className="text-xs font-semibold text-muted-foreground">
                                Included Excursions
                              </div>

                              <div className="flex flex-wrap gap-2 pt-1">
                                {day.standard_description.excursions.map((e) => (
                                  <Badge key={e.excursion_id}>{e.name}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>

                <div className="flex flex-col gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={prevDay}
                    disabled={dayIndex === 0 || isSavingDay}
                    className="min-w-[130px]"
                  >
                    Prev Day
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Day {dayIndex + 1} of {days.length}
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextDay}
                    disabled={dayIndex === days.length - 1 || isSavingDay}
                    className="min-w-[130px]"
                  >
                    {isSavingDay ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Next Day"
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {/* ======================
                STEP 3
            ====================== */}

            {step === 2 && (
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
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 0 || isSavingQuotation}
            className="min-w-[120px]"
          >
            Back
          </Button>

          {step < 2 ? (
            <Button onClick={nextStep} className="min-w-[140px]">
              Continue
            </Button>
          ) : (
            <Button
              size="lg"
              className="min-w-[180px] bg-ti-forest text-white hover:bg-ti-forest/90"
              onClick={handleSaveQuotation}
              disabled={isSavingQuotation}
            >
              {isSavingQuotation ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Quotation"
              )}
            </Button>
          )}
        </div>
      </div>
      <Dialog
        open={openEditDialog}
        onOpenChange={(v) => {
          if (!v) {
            setEditingDescription(null);
          }
          setOpenEditDialog(v);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit & Create New Standard Description</DialogTitle>
          </DialogHeader>

          <StandardDescriptionForm
            initial={editingDescription}
            onSubmit={handleCreateFromEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}