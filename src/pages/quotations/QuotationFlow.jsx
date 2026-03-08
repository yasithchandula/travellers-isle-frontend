"use client";

import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Pencil, Trash2 } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

/* =======================
   MOCK DATA (replace API)
======================= */
const CITIES = [
  { id: "1", name: "Dambulla" },
  { id: "2", name: "Kandy" },
  { id: "3", name: "Nuwara Eliya" },
  { id: "4", name: "Ella" },
  { id: "5", name: "Galle" },
];

const EXCURSIONS = [
  { id: "e1", name: "Sigiriya Rock Fortress" },
  { id: "e2", name: "Dambulla Cave Temple" },
  { id: "e3", name: "Village Tour" },
  { id: "e4", name: "Kandy Temple of the Tooth" },
  { id: "e5", name: "Tea Factory Visit" },
  { id: "e6", name: "Train Ride Scenic" },
  { id: "e7", name: "Whale Watching" },
];

const STANDARD_DESCRIPTIONS = [
  {
    id: "sd1",
    title: "Classic Sri Lanka Highlights",
    content:
      "A balanced itinerary covering cultural triangle, hill country, and a beach stay.",
  },
  {
    id: "sd2",
    title: "Family Friendly Journey",
    content:
      "Easy-paced route with kid-friendly stops, shorter drives, and flexible activities.",
  },
  {
    id: "sd3",
    title: "Honeymoon Escape",
    content:
      "Romantic experiences, scenic stays, and optional private excursions for couples.",
  },
];

/* =======================
   HELPERS
======================= */
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

function parseChildrenAges(raw) {
  const cleaned = (raw || "").trim();
  if (!cleaned) return [];
  return cleaned
    .split(/[,\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 17);
}

function formatNotes(days) {
  return days
    .filter((d) => (d.note || "").trim())
    .map((d) => `${d.date}: ${(d.note || "").trim()}`)
    .join("\n");
}

/* =======================
   MODERN STEPPER HEADER
   - clickable previous steps
   - sticky + blurred background
   - completed/active/pending states
======================= */
function ModernStepper({ steps, currentStep, onStepChange }) {
  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
        <div>
          <div className="text-lg font-semibold">Quotation Builder</div>
          <div className="text-sm text-muted-foreground">
            Create itinerary step by step
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isFuture = index > currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (index <= currentStep) onStepChange(index);
                  }}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-2 transition-all whitespace-nowrap",
                    isActive && "bg-ti-forest text-white shadow-md",
                    isCompleted &&
                      "bg-ti-forest/10 text-ti-forest hover:bg-ti-forest/20",
                    isFuture && "text-muted-foreground hover:bg-muted"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition",
                      isActive && "bg-white text-ti-forest",
                      isCompleted && "bg-ti-forest text-white",
                      isFuture && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check size={14} /> : index + 1}
                  </div>

                  <span className="text-sm font-medium">{step.label}</span>

                  {typeof step.badge === "string" && step.badge.length > 0 && (
                    <span
                      className={cn(
                        "ml-1 rounded-full px-2 py-[2px] text-xs",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step.badge}
                    </span>
                  )}
                </button>

                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-[2px] w-10 transition-all",
                      index < currentStep ? "bg-ti-forest" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-ti-forest transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* =======================
   MULTI SELECT (Excursions)
======================= */
function ExcursionsMultiSelect({ allExcursions, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedIds = useMemo(() => new Set(value.map((v) => v.id)), [value]);

  function togglePick(exc) {
    if (selectedIds.has(exc.id)) {
      onChange(value.filter((v) => v.id !== exc.id));
    } else {
      onChange([...value, { id: exc.id, name: exc.name, optional: false }]);
    }
  }

  function setOptional(id, optional) {
    onChange(value.map((v) => (v.id === id ? { ...v, optional } : v)));
  }

  function remove(id) {
    onChange(value.filter((v) => v.id !== id));
  }

  const summary = value.length ? `${value.length} selected` : "Select excursions";

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">{summary}</span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[360px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search excursions..." />
            <CommandList>
              <CommandEmpty>No excursions found.</CommandEmpty>
              <CommandGroup heading="Excursions">
                {allExcursions.map((exc) => {
                  const isSelected = selectedIds.has(exc.id);
                  return (
                    <CommandItem
                      key={exc.id}
                      onSelect={() => togglePick(exc)}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">{exc.name}</span>
                      {isSelected ? <Check className="h-4 w-4" /> : <span className="h-4 w-4" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{v.name}</div>
                <div className="text-xs text-muted-foreground">
                  {v.optional ? "Optional" : "Included"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={v.optional ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setOptional(v.id, !v.optional)}
                >
                  {v.optional ? "Optional ✓" : "Mark Optional"}
                </Button>

                <Button type="button" variant="ghost" size="icon" onClick={() => remove(v.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =======================
   STANDARD DESCRIPTION PICKER + EDIT
======================= */
function StandardDescriptionPicker({
  value, // {id,title,content,edited:boolean} | null
  onChange,
  markQuotationCustom,
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState("");

  function handleSelect(id) {
    const sd = STANDARD_DESCRIPTIONS.find((x) => x.id === id);
    if (!sd) return;

    onChange({
      id: sd.id,
      title: sd.title,
      content: sd.content,
      edited: false,
    });
  }

  function openEdit() {
    setDraft(value?.content || "");
    setEditOpen(true);
  }

  function saveEdit() {
    onChange({
      ...value,
      content: draft,
      edited: true,
    });
    markQuotationCustom(true);
    setEditOpen(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>Standard Description</Label>
          <Select value={value?.id || ""} onValueChange={handleSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select standard description" />
            </SelectTrigger>
            <SelectContent>
              {STANDARD_DESCRIPTIONS.map((sd) => (
                <SelectItem key={sd.id} value={sd.id}>
                  {sd.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={!value}
          onClick={openEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      {value && (
        <div className="rounded-md border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold truncate">{value.title}</div>
            {value.edited && <Badge variant="destructive">Edited</Badge>}
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {value.content}
          </p>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Standard Description</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[220px]"
            />
            <p className="text-xs text-muted-foreground">
              Saving changes will mark SD as edited and quotation as “Custom SD included”
              (approval required).
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =======================
   SMALL UI HELPERS
======================= */
function Field({ label, error, hint, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && !error && <div className="text-xs text-muted-foreground">{hint}</div>}
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-muted-foreground">{k}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}

/* =======================
   MAIN PAGE: Quotation Wizard
======================= */
export default function QuotationWizardModernPage() {
  const [step, setStep] = useState(0);

  const [info, setInfo] = useState({
    startDate: "",
    daysCount: 5,
    totalPax: 10,
    adultCount: 5,
    childrenAgesRaw: "3, 7, 12, 9, 5",
  });

  const [days, setDays] = useState([]); // built after step 1
  const [quotationCustomSD, setQuotationCustomSD] = useState(false);

  // Optional: keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, days, info]);

  const childrenAges = useMemo(
    () => parseChildrenAges(info.childrenAgesRaw),
    [info.childrenAgesRaw]
  );

  const childrenCount = childrenAges.length;

  const infoErrors = useMemo(() => {
    const errs = {};
    if (!info.startDate) errs.startDate = "Start date is required";
    if (!Number.isFinite(Number(info.daysCount)) || Number(info.daysCount) < 1)
      errs.daysCount = "Days must be at least 1";
    if (!Number.isFinite(Number(info.totalPax)) || Number(info.totalPax) < 1)
      errs.totalPax = "Total pax must be at least 1";
    if (!Number.isFinite(Number(info.adultCount)) || Number(info.adultCount) < 0)
      errs.adultCount = "Adult count must be 0 or more";

    const sum = Number(info.adultCount || 0) + childrenCount;
    if (Number(info.totalPax || 0) !== sum) {
      errs.paxMismatch = `Total pax must equal Adult (${info.adultCount}) + Children (${childrenCount}). Current sum = ${sum}`;
    }

    return errs;
  }, [info, childrenCount]);

  const canGoNextFromStep1 = Object.keys(infoErrors).length === 0;

  function buildInitialDays() {
    const dates = generateTourDates(info.startDate, Number(info.daysCount));
    const built = dates.map((date, i) => ({
      date,
      city_id: i === 0 ? "1" : "",
      excursions: [],
      note: "",
      standard_description: null,
      dayIndex: i + 1,
    }));
    setDays(built);
  }

  function next() {
    if (step === 0) {
      if (!canGoNextFromStep1) return;
      buildInitialDays();
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function updateDay(idx, patch) {
    setDays((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  }

  function copyPrevCity(idx) {
    if (idx <= 0) return;
    const prevCity = days[idx - 1]?.city_id || "";
    if (!prevCity) return;
    updateDay(idx, { city_id: prevCity });
  }

  const scheduleRows = useMemo(() => {
    return days.map((d) => {
      const cityName = CITIES.find((c) => c.id === d.city_id)?.name || "";
      const excNames = (d.excursions || []).map((x) => x.name).join(", ");
      return { ...d, cityName, excNames };
    });
  }, [days]);

  const formattedNotesText = useMemo(() => formatNotes(days), [days]);

  const stepMeta = useMemo(() => {
    const created = days.length;
    const scheduleDone = created > 0 && days.every((d) => !!d.date);
    const itineraryDone =
      created > 0 &&
      days.every((d) => d.city_id && (d.excursions || []).length >= 0);

    return [
      { id: "info", label: "Tour Info", badge: info.startDate ? "ready" : "" },
      { id: "schedule", label: "Schedule", badge: scheduleDone ? `${created} days` : "" },
      {
        id: "itinerary",
        label: "Itinerary",
        badge: itineraryDone ? "ok" : created ? "in progress" : "",
      },
      { id: "review", label: "Review", badge: quotationCustomSD ? "custom SD" : "" },
    ];
  }, [days, info.startDate, quotationCustomSD]);

  return (
    <div className="min-h-screen bg-background">
      <ModernStepper steps={stepMeta} currentStep={step} onStepChange={setStep} />

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Quotation Preparation</CardTitle>
                <CardDescription>{stepMeta[step]?.label}</CardDescription>
              </div>

              <div className="flex items-center gap-2">
                {quotationCustomSD && (
                  <Badge variant="destructive">Custom SD Included (Approval)</Badge>
                )}
                <Badge variant="secondary">
                  Pax: {info.totalPax} (A:{info.adultCount}, C:{childrenCount})
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* STEP 1 */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Start Date" error={infoErrors.startDate} hint="Example: 2026-02-01">
                    <Input
                      type="date"
                      value={info.startDate}
                      onChange={(e) => setInfo((p) => ({ ...p, startDate: e.target.value }))}
                    />
                  </Field>

                  <Field label="Days Count" error={infoErrors.daysCount}>
                    <Input
                      type="number"
                      min={1}
                      value={info.daysCount}
                      onChange={(e) => setInfo((p) => ({ ...p, daysCount: Number(e.target.value) }))}
                    />
                  </Field>

                  <Field label="Total Pax" error={infoErrors.totalPax}>
                    <Input
                      type="number"
                      min={1}
                      value={info.totalPax}
                      onChange={(e) => setInfo((p) => ({ ...p, totalPax: Number(e.target.value) }))}
                    />
                  </Field>

                  <Field label="Adult Count" error={infoErrors.adultCount}>
                    <Input
                      type="number"
                      min={0}
                      value={info.adultCount}
                      onChange={(e) => setInfo((p) => ({ ...p, adultCount: Number(e.target.value) }))}
                    />
                  </Field>

                  <Field label="Children Ages" hint='Enter: "3, 7, 12, 9, 5"'>
                    <Input
                      value={info.childrenAgesRaw}
                      onChange={(e) => setInfo((p) => ({ ...p, childrenAgesRaw: e.target.value }))}
                      placeholder="3, 7, 12, 9, 5"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Parsed children count: <b>{childrenCount}</b>{" "}
                      {childrenCount ? `(${childrenAges.join(", ")})` : ""}
                    </div>
                  </Field>
                </div>

                {infoErrors.paxMismatch && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
                    <div className="font-semibold text-destructive">Pax mismatch</div>
                    <div className="text-muted-foreground mt-1">{infoErrors.paxMismatch}</div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-md border p-3 text-sm text-muted-foreground">
                  Generated dates — choose staying city and notes. (Excursions & SD in next step.)
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Date</TableHead>
                      <TableHead>Staying City</TableHead>
                      <TableHead>Excursions</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="w-[160px]">Quick Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleRows.map((d, idx) => (
                      <TableRow key={d.date}>
                        <TableCell className="font-medium">{d.date}</TableCell>

                        <TableCell>
                          <Select
                            value={d.city_id || ""}
                            onValueChange={(v) => updateDay(idx, { city_id: v })}
                          >
                            <SelectTrigger className="w-[220px]">
                              <SelectValue placeholder="Select city" />
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

                        <TableCell className="text-muted-foreground">{d.excNames || "—"}</TableCell>

                        <TableCell className="min-w-[240px]">
                          <Input
                            value={d.note || ""}
                            onChange={(e) => updateDay(idx, { note: e.target.value })}
                            placeholder="Add note..."
                          />
                        </TableCell>

                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => copyPrevCity(idx)}
                            disabled={idx === 0}
                          >
                            Copy Prev City
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* STEP 3 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-md border p-3 text-sm text-muted-foreground">
                  Edit each day: excursions (optional supported), SD, and notes.
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {days.map((d, idx) => {
                    const cityName = CITIES.find((c) => c.id === d.city_id)?.name || "No city";
                    const optionalCount = (d.excursions || []).filter((x) => x.optional).length;

                    return (
                      <Card key={d.date} className="overflow-hidden">
                        <CardHeader className="bg-muted/30">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <CardTitle className="text-base truncate">
                                Day {idx + 1} — {d.date}
                              </CardTitle>
                              <CardDescription className="truncate">
                                Staying: <b>{cityName}</b>
                              </CardDescription>
                            </div>

                            <div className="flex items-center gap-2">
                              {d.standard_description?.edited && (
                                <Badge variant="destructive">SD Edited</Badge>
                              )}
                              {optionalCount > 0 && (
                                <Badge variant="secondary">Optional: {optionalCount}</Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label>Staying City</Label>
                            <Select
                              value={d.city_id || ""}
                              onValueChange={(v) => updateDay(idx, { city_id: v })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
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

                          <div className="space-y-2">
                            <Label>Excursions</Label>
                            <ExcursionsMultiSelect
                              allExcursions={EXCURSIONS}
                              value={d.excursions || []}
                              onChange={(v) => updateDay(idx, { excursions: v })}
                            />
                          </div>

                          <StandardDescriptionPicker
                            value={d.standard_description}
                            onChange={(sd) => updateDay(idx, { standard_description: sd })}
                            markQuotationCustom={setQuotationCustomSD}
                          />

                          <div className="space-y-2">
                            <Label>Note</Label>
                            <Textarea
                              value={d.note || ""}
                              onChange={(e) => updateDay(idx, { note: e.target.value })}
                              placeholder="Add notes for this day..."
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 3 && (
              <div className="space-y-6">
                {quotationCustomSD && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
                    <div className="font-semibold text-destructive">
                      Custom Standard Description included — approval required
                    </div>
                    <div className="text-muted-foreground mt-1">
                      At least one day’s SD was edited. Admin must approve before sending.
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Summary</CardTitle>
                      <CardDescription>Tour information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <Row k="Start Date" v={info.startDate || "—"} />
                      <Row k="Days" v={String(info.daysCount)} />
                      <Row k="Total Pax" v={String(info.totalPax)} />
                      <Row k="Adults" v={String(info.adultCount)} />
                      <Row k="Children" v={`${childrenCount} (${childrenAges.join(", ")})`} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Formatted Notes</CardTitle>
                      <CardDescription>Saved as requested</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        readOnly
                        value={formattedNotesText || ""}
                        placeholder="No notes added."
                        className="min-h-[220px]"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MODERN STICKY FOOTER NAV */}
        <div className="sticky bottom-0 z-20 bg-background/80 backdrop-blur border-t">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <Button variant="outline" onClick={back} disabled={step === 0}>
              Back
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">
                Tip: Use ← → arrow keys to navigate
              </span>

              {step < 3 ? (
                <Button
                  onClick={next}
                  disabled={step === 0 && !canGoNextFromStep1}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const payload = {
                      info: { ...info, childrenAges, childrenCount },
                      days,
                      formattedNotes: formattedNotesText,
                      custom_sd: quotationCustomSD,
                    };
                    console.log("SAVE QUOTATION PAYLOAD:", payload);
                    alert("Saved (check console for payload).");
                  }}
                >
                  Save Quotation
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}