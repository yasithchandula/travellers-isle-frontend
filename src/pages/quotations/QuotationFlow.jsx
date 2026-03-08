"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchExcursions } from "@/app/slices/excursionSlice";

import {
  fetchStandardDescriptions,
  setStandardDescriptionSearch,
} from "@/app/slices/standardDescriptionSlice";

import ExcursionSelector from "@/components/ui/excursion-selector";
import StandardDescriptionSelector from "@/components/ui/standard-description-selector";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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

/* ======================
   MOCK CITY DATA
====================== */

const CITIES = [
  { id: "1", name: "Dambulla" },
  { id: "2", name: "Kandy" },
  { id: "3", name: "Nuwara Eliya" },
  { id: "4", name: "Ella" },
  { id: "5", name: "Galle" },
];

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

/* ======================
   MAIN PAGE
====================== */

export default function QuotationWizardModernPage() {

  const dispatch = useDispatch();

  const excursions = useSelector((s) => s.excursions?.items || []);

  const {
    items: standardDescriptions = [],
    search: descriptionSearch = "",
  } = useSelector((s) => s.standardDescriptions || {});

  const [excursionSearch, setExcursionSearch] = useState("");

  const [step, setStep] = useState(0);

  const [dayIndex, setDayIndex] = useState(0);

  const info = {
    startDate: "2026-02-01",
    daysCount: 5,
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
  }, [excursionSearch]);

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
     INIT DAYS
  ====================== */

  useEffect(() => {
    const dates = generateTourDates(info.startDate, info.daysCount);

    const built = dates.map((date, i) => ({
      date,
      city_id: i === 0 ? "1" : "",
      excursions: [],
      standard_descriptions: [],
      note: "",
    }));

    setDays(built);
  }, []);

  /* ======================
     UPDATE DAY
  ====================== */

  function updateDay(idx, patch) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === idx ? { ...d, ...patch } : d
      )
    );
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

  function nextDay() {
    setDayIndex((d) => Math.min(days.length - 1, d + 1));
  }

  function prevDay() {
    setDayIndex((d) => Math.max(0, d - 1));
  }

  const formattedNotes = useMemo(() => formatNotes(days), [days]);

  const steps = [
    { id: "schedule", label: "Schedule" },
    { id: "itinerary", label: "Itinerary" },
    { id: "review", label: "Review" },
  ];

  const day = days[dayIndex];

  return (
    <div className="min-h-screen bg-background">

      <ModernStepper
        steps={steps}
        currentStep={step}
        onStepChange={setStep}
      />

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <Card>

          <CardHeader>
            <CardTitle>Quotation Builder</CardTitle>
            <CardDescription>
              {steps[step].label}
            </CardDescription>
          </CardHeader>

          <CardContent>

            {/* ======================
                STEP 1
            ====================== */}

            {step === 0 && (

              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Excursions</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {days.map((d, idx) => (

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

                      <TableCell className="min-w-[300px]">

                        <ExcursionSelector
                          items={excursions}
                          selected={d.excursions}
                          setSelected={(list) =>
                            updateDay(idx, {
                              excursions: list,
                            })
                          }
                          onSearch={(v) =>
                            setExcursionSearch(v)
                          }
                        />

                      </TableCell>

                      <TableCell>

                        <Input
                          value={d.note}
                          onChange={(e) =>
                            updateDay(idx, {
                              note: e.target.value,
                            })
                          }
                        />

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            )}

            {/* ======================
                STEP 2
            ====================== */}

            {step === 1 && day && (

              <Card>

                <CardHeader>
                  <CardTitle>Day {dayIndex + 1}</CardTitle>
                  <CardDescription>{day.date}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* CITY */}

                  <div>
                    <Label>City</Label>

                    <Select
                      value={day.city_id}
                      onValueChange={(v) =>
                        updateDay(dayIndex, { city_id: v })
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

                  {/* STANDARD DESCRIPTIONS */}

                  <div className="space-y-2">

                    <Label>Standard Descriptions</Label>

                    <Popover>

                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          Select Standard Descriptions
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[500px] p-3 bg-white">

                        <StandardDescriptionSelector
                          items={standardDescriptions}
                          selected={day.standard_descriptions}
                          setSelected={(list) =>
                            updateDay(dayIndex, {
                              standard_descriptions: list,
                            })
                          }
                          onSearch={(val) =>
                            dispatch(setStandardDescriptionSearch(val))
                          }
                        />

                      </PopoverContent>

                    </Popover>

                    {/* Selected Preview */}

                    {day.standard_descriptions?.length > 0 && (

                      <div className="flex flex-wrap gap-2 pt-2">

                        {day.standard_descriptions.map((d) => (

                          <span
                            key={d.id}
                            className="px-2 py-1 text-xs bg-ti-mint/50 border rounded"
                          >
                            {d.title ||
                              `${d.start_city?.name} → ${d.end_city?.name}`}
                          </span>

                        ))}

                      </div>

                    )}

                  </div>

                </CardContent>

                <div className="flex justify-between p-4 border-t">

                  <Button
                    variant="outline"
                    onClick={prevDay}
                    disabled={dayIndex === 0}
                  >
                    Prev Day
                  </Button>

                  <Button
                    variant="outline"
                    onClick={nextDay}
                    disabled={dayIndex === days.length - 1}
                  >
                    Next Day
                  </Button>

                </div>

              </Card>

            )}

            {/* ======================
                STEP 3
            ====================== */}

            {step === 2 && (

              <Card>

                <CardHeader>
                  <CardTitle>Notes Preview</CardTitle>
                </CardHeader>

                <CardContent>

                  <Textarea
                    value={formattedNotes}
                    readOnly
                    className="min-h-[200px]"
                  />

                </CardContent>

              </Card>

            )}

          </CardContent>

        </Card>

        {/* STEP NAV */}

        <div className="flex justify-between">

          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 0}
          >
            Back
          </Button>

          {step < 2 ? (

            <Button onClick={nextStep}>
              Continue
            </Button>

          ) : (

            <Button
              onClick={() => {

                const payload = {
                  info,
                  days,
                  formattedNotes,
                };

                console.log(payload);

                alert("Quotation Saved");

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