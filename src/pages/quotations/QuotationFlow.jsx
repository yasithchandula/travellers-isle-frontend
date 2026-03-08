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
   MOCK DATA
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

function formatNotes(days) {
  return days
    .filter((d) => d.note?.trim())
    .map((d) => `${d.date}: ${d.note.trim()}`)
    .join("\n");
}

/* =======================
   STEPPER
======================= */

function ModernStepper({ steps, currentStep, onStepChange }) {
  return (
    <div className="sticky top-0 z-30 bg-background border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepChange(index)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
              currentStep === index && "bg-ti-forest text-white",
              currentStep > index && "bg-ti-forest/10 text-ti-forest",
              currentStep < index && "text-muted-foreground"
            )}
          >
            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-muted">
              {currentStep > index ? <Check size={14} /> : index + 1}
            </div>
            {step.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =======================
   MAIN PAGE
======================= */

export default function QuotationWizardModernPage() {
  const [step, setStep] = useState(0);

  const info = {
    startDate: "2026-02-01",
    daysCount: 5,
    totalPax: 10,
    adultCount: 5,
  };

  const [days, setDays] = useState([]);
  const [quotationCustomSD, setQuotationCustomSD] = useState(false);

  /* generate days immediately */

  useEffect(() => {
    const dates = generateTourDates(info.startDate, info.daysCount);

    const built = dates.map((date, i) => ({
      date,
      city_id: i === 0 ? "1" : "",
      excursions: [],
      note: "",
      standard_description: null,
    }));

    setDays(built);
  }, []);

  function updateDay(idx, patch) {
    setDays((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  }

  function copyPrevCity(idx) {
    if (idx === 0) return;
    const prevCity = days[idx - 1]?.city_id;
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

  const stepMeta = [
    { id: "schedule", label: "Schedule" },
    { id: "itinerary", label: "Itinerary" },
    { id: "review", label: "Review" },
  ];

  function next() {
    setStep((s) => Math.min(2, s + 1));
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="min-h-screen bg-background">

      <ModernStepper
        steps={stepMeta}
        currentStep={step}
        onStepChange={setStep}
      />

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Quotation Preparation</CardTitle>
            <CardDescription>{stepMeta[step].label}</CardDescription>
          </CardHeader>

          <CardContent>

            {/* STEP 1 : SCHEDULE */}

            {step === 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {scheduleRows.map((d, idx) => (
                    <TableRow key={d.date}>
                      <TableCell>{d.date}</TableCell>

                      <TableCell>
                        <Select
                          value={d.city_id}
                          onValueChange={(v) =>
                            updateDay(idx, { city_id: v })
                          }
                        >
                          <SelectTrigger>
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

                      <TableCell>
                        <Input
                          value={d.note}
                          onChange={(e) =>
                            updateDay(idx, { note: e.target.value })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyPrevCity(idx)}
                        >
                          Copy Prev
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* STEP 2 : ITINERARY */}

            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {days.map((d, idx) => (
                  <Card key={d.date}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Day {idx + 1} — {d.date}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                      <div>
                        <Label>City</Label>

                        <Select
                          value={d.city_id}
                          onValueChange={(v) =>
                            updateDay(idx, { city_id: v })
                          }
                        >
                          <SelectTrigger>
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
                      </div>

                      <div>
                        <Label>Note</Label>

                        <Textarea
                          value={d.note}
                          onChange={(e) =>
                            updateDay(idx, { note: e.target.value })
                          }
                        />
                      </div>

                    </CardContent>
                  </Card>
                ))}

              </div>
            )}

            {/* STEP 3 : REVIEW */}

            {step === 2 && (
              <div className="space-y-4">

                <Card>
                  <CardHeader>
                    <CardTitle>Formatted Notes</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <Textarea
                      readOnly
                      value={formattedNotesText}
                      className="min-h-[200px]"
                    />
                  </CardContent>
                </Card>

              </div>
            )}

          </CardContent>
        </Card>

        {/* FOOTER NAV */}

        <div className="flex justify-between">

          <Button variant="outline" onClick={back} disabled={step === 0}>
            Back
          </Button>

          {step < 2 ? (
            <Button onClick={next}>Continue</Button>
          ) : (
            <Button
              onClick={() => {
                const payload = {
                  info,
                  days,
                  formattedNotes: formattedNotesText,
                  custom_sd: quotationCustomSD,
                };

                console.log(payload);
                alert("Saved. Check console.");
              }}
            >
              Save Quotation
            </Button>
          )}

        </div>

      </div>
    </div>
  );
}