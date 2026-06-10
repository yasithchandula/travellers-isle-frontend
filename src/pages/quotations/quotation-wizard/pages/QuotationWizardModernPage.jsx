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
import ScheduleTableStep from "../components/ScheduleTableStep";
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
    standardDescriptions,
    updateDay,
    saveDayToApi,
    nextStep,
    prevStep,
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
        daysCount={days.length}
        totalExcursions={totalExcursions}
        totalDescriptions={totalDescriptions}
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
                  standardDescriptions={standardDescriptions}
                  dispatch={dispatch}
                  setStandardDescriptionSearchAction={
                    setStandardDescriptionSearchAction
                  }
                  isLoadingCities={isLoadingCities}
                  isSavingDay={isSavingDay}
                  onUpdateDay={updateDay}
                  onSaveDay={saveDayToApi}
                  onSetEditingDescription={setEditingDescription}
                  onOpenEditDialog={setOpenEditDialog}
                  onExcursionSearch={setExcursionSearch}
                  excursionSearch={excursionSearch}
                />
              )}

              {step === 1 && (
                <ReviewStep
                  formattedNotes={formattedNotes}
                  quotationShell={quotationShell}
                  cities={cities}
                  days={days}
                />
              )}

              {step === 2 && (
                <AccommodationTableStep
                  days={days}
                  cities={cities}
                  onUpdateDay={updateDay}
                  quotationShell={quotationShell}
                />
              )}

              {step === 3 && id && (
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

            {step < QUOTATION_WIZARD_STEPS.length - 1 ? (
              <Button
                onClick={nextStep}
                className="min-w-[140px]"
                disabled={isSavingDay || isSavingQuotation}
              >
                {isSavingDay ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Continue"
                )}
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
