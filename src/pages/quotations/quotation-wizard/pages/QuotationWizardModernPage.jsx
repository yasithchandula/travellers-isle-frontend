"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import StandardDescriptionForm from "@/components/forms/StandardDescriptionForm";

import ModernStepper from "../components/ModernStepper";
import WizardHeader from "../components/WizardHeader";
import ScheduleTableStep from "../components/ScheduleTableStep";
import ItineraryStep from "../components/ItineraryStep";
import ReviewStep from "../components/ReviewStep";
import AccommodationTableStep from "../components/AccommodationTableStep";

import useQuotationWizard from "../hooks/useQuotationWizard";
import { QUOTATION_WIZARD_STEPS } from "../utils/quotationWizardConstants";
import FinalPreviewStep from "../components/FinalPreviewStep";

export default function QuotationWizardModernPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const excursions = useSelector((state) => state.excursions?.items || []);
  const quotationShell = useSelector(
    (state) => state.quotations?.quotationShell
  );
  const standardDescriptionsState = useSelector(
    (state) => state.standardDescriptions || {}
  );

  const {
    cities,
    isLoadingCities,
    step,
    setStep,
    dayIndex,
    days,
    excursionSearch,
    setExcursionSearch,
    isSavingDay,
    isSavingQuotation,
    editingDescription,
    setEditingDescription,
    openEditDialog,
    setOpenEditDialog,
    formattedNotes,
    totalExcursions,
    totalDescriptions,
    currentDay,
    standardDescriptions,
    updateDay,
    nextStep,
    prevStep,
    nextDay,
    prevDay,
    handleSaveQuotation,
    handleCreateFromEdit,
    setStandardDescriptionSearchAction,
  } = useQuotationWizard({
    dispatch,
    id,
    quotationShell,
    excursions,
    standardDescriptionsState,
  });

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Sticky Stepper */}
      <ModernStepper
        steps={QUOTATION_WIZARD_STEPS}
        currentStep={step}
        onStepChange={setStep}
      />

      {/* SCROLL CONTAINER */}
      <div
        data-scroll-container
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div className="mx-auto w-full max-w-[1400px] flex flex-col gap-6 px-4 py-6 md:px-6">

          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardContent className="space-y-6 p-4 md:p-6">

              {step === 0 && (
                <ScheduleTableStep
                  days={days}
                  cities={cities}
                  excursions={excursions}
                  isLoadingCities={isLoadingCities}
                  onUpdateDay={updateDay}
                  onExcursionSearch={setExcursionSearch}
                  excursionSearch={excursionSearch}
                />
              )}

              {step === 1 && currentDay && (
                <ItineraryStep
                  day={currentDay}
                  dayIndex={dayIndex}
                  daysLength={days.length}
                  cities={cities}
                  excursions={excursions}
                  standardDescriptions={standardDescriptions}
                  dispatch={dispatch}
                  setStandardDescriptionSearchAction={
                    setStandardDescriptionSearchAction
                  }
                  onUpdateDay={updateDay}
                  onSetEditingDescription={setEditingDescription}
                  onOpenEditDialog={setOpenEditDialog}
                  onExcursionSearch={setExcursionSearch}
                  onPrevDay={prevDay}
                  onNextDay={nextDay}
                  isSavingDay={isSavingDay}
                />
              )}

              {step === 2 && (
                <ReviewStep
                  formattedNotes={formattedNotes}
                  quotationShell={quotationShell}
                  cities={cities}
                />
              )}

              {step === 3 && (
                <AccommodationTableStep
                  days={days}
                  cities={cities}
                  onUpdateDay={updateDay}
                  quotationShell={quotationShell}
                />
              )}

              {step === 4 && id && (
                <FinalPreviewStep quotationId={id} />
              )}
            </CardContent>
          </Card>

          {/*  Footer actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0 || isSavingQuotation}
              className="min-w-[120px]"
            >
              Back
            </Button>

            {step < 4 ? (
              <Button onClick={nextStep} className="min-w-[140px]">
                Continue
              </Button>
            ) : (
              <Button
                size="lg"
                className="min-w-[140px]"
                onClick={handleSaveQuotation}
                disabled={isSavingQuotation}
              >
                <span className="inline-flex items-center gap-2">
                  {isSavingQuotation && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isSavingQuotation ? "Saving..." : "Finish"}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={openEditDialog}
        onOpenChange={(value) => {
          if (!value) setEditingDescription(null);
          setOpenEditDialog(value);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit & Create New Standard Description
            </DialogTitle>
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