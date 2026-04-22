import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import SummaryBadge from "./SummaryBadge";

export default function ModernStepper({
  steps,
  currentStep,
  onStepChange,
  daysCount,
  totalExcursions,
  totalDescriptions,
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;

          setIsScrolled((prev) => {
            // ✅ Hysteresis thresholds (no shaking)
            if (!prev && y > 100) return true;
            if (prev && y < 40) return false;
            return prev;
          });

          ticking = false;
        });

        ticking = true;
      }
    };

    // ✅ prevent unnecessary listener if no scroll possible
    if (document.body.scrollHeight > window.innerHeight) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-30 border-b backdrop-blur-xl transition-all",
        isScrolled
          ? "bg-background/95 shadow-sm"
          : "bg-background/80"
      )}
    >
      {/* =========================
       * HEADER (COLLAPSIBLE)
       ========================= */}
      <div
        className={cn(
          "mx-auto px-4 overflow-hidden transition-all duration-300 will-change-[max-height,opacity]",
          isScrolled
            ? "max-h-0 opacity-0 pb-0"
            : "max-h-[220px] opacity-100 pt-4 pb-2"
        )}
      >
        <CardHeader className="border rounded-xl bg-card/80 backdrop-blur-sm px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="space-y-1">
              <CardTitle className="text-lg md:text-xl font-semibold tracking-tight">
                Quotation Builder
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Build the schedule, itinerary, and notes.
              </CardDescription>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap gap-2">
              <SummaryBadge>
                {daysCount || 0} {daysCount === 1 ? "day" : "days"}
              </SummaryBadge>

              <SummaryBadge>
                {totalExcursions || 0} excursion
                {totalExcursions === 1 ? "" : "s"}
              </SummaryBadge>

              <SummaryBadge>
                {totalDescriptions || 0} description
                {totalDescriptions === 1 ? "" : "s"}
              </SummaryBadge>
            </div>
          </div>
        </CardHeader>
      </div>

      {/* =========================
       * STEPPER (ALWAYS VISIBLE)
       ========================= */}
      <div
        className={cn(
          "mx-auto px-4 transition-all",
          isScrolled ? "py-2" : "py-3"
        )}
      >
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isDone = currentStep > index;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onStepChange(index)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border px-4 py-2 text-sm transition-all duration-200",
                    "hover:scale-[1.02] active:scale-[0.98]",

                    isActive &&
                      "border-ti-forest bg-ti-forest text-white shadow-md",

                    isDone &&
                      "border-ti-forest/20 bg-ti-forest/10 text-ti-forest hover:bg-ti-forest/15",

                    !isActive &&
                      !isDone &&
                      "border-border bg-card text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      isActive && "bg-white/20 text-white",
                      isDone && "bg-ti-forest text-white",
                      !isActive && !isDone && "bg-muted text-foreground"
                    )}
                  >
                    {isDone ? <Check size={12} /> : index + 1}
                  </div>

                  <span className="font-medium whitespace-nowrap">
                    {step.label}
                  </span>
                </button>

                {/* CONNECTOR */}
                {index < steps.length - 1 && (
                  <div className="mx-2 h-[2px] w-10 shrink-0 rounded-full bg-border relative">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full transition-all",
                        currentStep > index
                          ? "bg-ti-forest"
                          : "bg-border"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}