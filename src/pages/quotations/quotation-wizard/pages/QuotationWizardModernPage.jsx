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

import useQuotationWizard from "../hooks/useQuotationWizard";
import { QUOTATION_WIZARD_STEPS } from "../utils/quotationWizardConstants";

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
    <div className="min-h-screen bg-muted/30">
      <ModernStepper
        steps={QUOTATION_WIZARD_STEPS}
        currentStep={step}
        onStepChange={setStep}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <WizardHeader
            daysCount={days.length}
            totalExcursions={totalExcursions}
            totalDescriptions={totalDescriptions}
          />

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

            {step === 2 && <ReviewStep formattedNotes={formattedNotes} />}
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
        onOpenChange={(value) => {
          if (!value) {
            setEditingDescription(null);
          }
          setOpenEditDialog(value);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
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