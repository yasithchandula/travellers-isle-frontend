import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { fetchExcursions } from "@/app/slices/excursionSlice";
import {
  fetchStandardDescriptions,
  setStandardDescriptionSearch,
} from "@/app/slices/standardDescriptionSlice";
import {
  updateQuotationDay,
  fetchQuotationFullDetails,
} from "@/app/slices/quotationSlice";

import { createStandardDescription } from "@/api/mock/standardDescriptionMock";

import useCitiesLoader from "./useCitiesLoader";
import { formatNotes } from "../utils/dateHelpers";
import {
  mapQuotationShellToDays,
  buildDayUpdatePayload,
} from "../utils/quotationWizardMappers";
import { useNavigate } from "react-router-dom";
import { QUOTATION_WIZARD_STEPS } from "../utils/quotationWizardConstants";

export default function useQuotationWizard({
  dispatch,
  id,
  quotationShell,
  standardDescriptionsState,
}) {
  const { items: standardDescriptions = [], search: descriptionSearch = "" } =
    standardDescriptionsState || {};
  const { cities, isLoadingCities } = useCitiesLoader(dispatch);

  const [step, setStep] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [days, setDays] = useState([]);
  const [excursionSearch, setExcursionSearch] = useState("");
  const [isSavingDay, setIsSavingDay] = useState(false);
  const [isSavingQuotation, setIsSavingQuotation] = useState(false);

  const [editingDescription, setEditingDescription] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    dispatch(fetchQuotationFullDetails(id));
  }, [dispatch, id]);

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
        limit: 30,
      })
    );
  }, [dispatch, descriptionSearch]);

  useEffect(() => {
    if (!quotationShell) return;
    setDays(mapQuotationShellToDays(quotationShell));
  }, [quotationShell]);

  const info = useMemo(
    () => ({
      startDate: quotationShell?.start_date,
      daysCount: quotationShell?.days_count,
    }),
    [quotationShell]
  );

  const formattedNotes = useMemo(() => formatNotes(days), [days]);

  const totalExcursions = useMemo(
    () => days.reduce((sum, d) => sum + (d.excursions?.length || 0), 0),
    [days]
  );

  const totalDescriptions = useMemo(
    () => days.reduce((sum, day) => sum + (day.standard_description ? 1 : 0), 0),
    [days]
  );

  const currentDay = days[dayIndex] || null;

  function updateDay(index, patch) {
    setDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...patch };

      if (patch.destination_city_id && updated[index + 1]) {
        updated[index + 1] = {
          ...updated[index + 1],
          starting_city_id: patch.destination_city_id,
        };
      }

      return updated;
    });
  }

  async function saveDayToApi(dayData, showSuccessToast = true) {
    if (!dayData?.id) return true;

    try {
      setIsSavingDay(true);

      const payload = buildDayUpdatePayload(dayData);
      await dispatch(updateQuotationDay(payload)).unwrap();

      if (showSuccessToast) {
        toast.success(`Day ${dayData.day_number || dayIndex + 1} saved`);
      }

      return true;
    } catch (error) {
      console.error("Failed to update day:", error);
      toast.error("Failed to save day");
      return false;
    } finally {
      setIsSavingDay(false);
    }
  }

  async function saveAllDaysToApi() {
    const daysToSave = days.filter((day) => day?.id);

    if (!daysToSave.length) return true;

    try {
      setIsSavingDay(true);

      for (const day of daysToSave) {
        const payload = buildDayUpdatePayload(day);
        await dispatch(updateQuotationDay(payload)).unwrap();
      }

      toast.success("Schedule and itinerary saved");
      return true;
    } catch (error) {
      console.error("Failed to update quotation days:", error);
      toast.error("Failed to save itinerary");
      return false;
    } finally {
      setIsSavingDay(false);
    }
  }

  async function nextStep() {
    if (step === 0) {
      const ok = await saveAllDaysToApi();
      if (!ok) return;
    }

    setStep((prev) =>
      Math.min(QUOTATION_WIZARD_STEPS.length - 1, prev + 1)
    );
  }

  function prevStep() {
    setStep((prev) => Math.max(0, prev - 1));
  }

  async function nextDay() {
    const day = days[dayIndex];
    const ok = await saveDayToApi(day);

    if (!ok) return;

    setDayIndex((prev) => Math.min(days.length - 1, prev + 1));
  }

  function prevDay() {
    setDayIndex((prev) => Math.max(0, prev - 1));
  }

  async function handleSaveQuotation() {
    try {
      setIsSavingQuotation(true);

      await new Promise((r) => setTimeout(r, 800));

      toast.success("Quotation saved");

      navigate("/quotations");

    } catch (error) {
      console.error(error);
      toast.error("Failed to save quotation");
    } finally {
      setIsSavingQuotation(false);
    }
  }

  async function handleCreateFromEdit(payload) {
    try {
      // If this is actually a thunk in your app, replace with:
      // const res = await dispatch(createStandardDescription(payload)).unwrap();
      const res = await createStandardDescription(payload);

      const newDescription = res?.data || res;

      if (!newDescription?.id) {
        throw new Error("Invalid response");
      }

      const day = days[dayIndex] || {};

      updateDay(dayIndex, {
        standard_description: newDescription,
        standard_description_id: newDescription.id,
        actual_mileage: newDescription.mileage ?? "",
        travel_time_minutes: newDescription.travel_time_minutes ?? "",
        auto_standard_description_id:
          day.auto_standard_description_id === editingDescription?.id
            ? null
            : day.auto_standard_description_id,
      });

      toast.success("New description created from edit");

      setOpenEditDialog(false);
      setEditingDescription(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create description");
    }
  }

  return {
    cities,
    isLoadingCities,
    step,
    setStep,
    dayIndex,
    setDayIndex,
    days,
    setDays,
    excursionSearch,
    setExcursionSearch,
    isSavingDay,
    isSavingQuotation,
    editingDescription,
    setEditingDescription,
    openEditDialog,
    setOpenEditDialog,
    info,
    formattedNotes,
    totalExcursions,
    totalDescriptions,
    currentDay,
    standardDescriptions,
    updateDay,
    saveDayToApi,
    saveAllDaysToApi,
    nextStep,
    prevStep,
    nextDay,
    prevDay,
    handleSaveQuotation,
    handleCreateFromEdit,
    setStandardDescriptionSearchAction: setStandardDescriptionSearch,
  };
}
