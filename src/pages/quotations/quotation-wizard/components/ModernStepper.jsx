import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModernStepper({
  steps,
  currentStep,
  onStepChange,
}) {
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