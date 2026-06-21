import { generateTourDates } from "./dateHelpers";

export function mapQuotationShellToDays(quotationShell) {
  if (!quotationShell?.start_date || !quotationShell?.days_count) return [];

  const dates = generateTourDates(
    quotationShell.start_date,
    quotationShell.days_count
  );

  const apiDays = quotationShell.itinerary || [];

  const mappedDays = dates.map((date, index) => {
    const apiDay = apiDays[index] || {};
    const standardDescription =
      apiDay.standard_description ||
      apiDay.standard_descriptions?.[0] ||
      null;

    return {
      id: apiDay.id || null,
      day_number: apiDay.day_number || index + 1,
      date,
      starting_city_id:
        apiDay.start_city_id && apiDay.start_city_id !== 0
          ? String(apiDay.start_city_id)
          : "",
      destination_city_id:
        apiDay.end_city_id && apiDay.end_city_id !== 0
          ? String(apiDay.end_city_id)
          : "",
      stop_ids: Array.isArray(apiDay.stop_ids)
        ? apiDay.stop_ids.map(String)
        : [],
      excursions: Array.isArray(apiDay.excursions)
        ? apiDay.excursions.map((excursion) => ({
            ...excursion,
            id: excursion.id ?? excursion.excursion_id,
          }))
        : [],
      standard_description: standardDescription,
      standard_description_id:
        standardDescription?.id || apiDay.standard_description_id || null,
      auto_standard_description_id: null,
      auto_excursion_ids: [],
      actual_mileage: resolveTravelMetric(
        apiDay.actual_mileage,
        standardDescription?.mileage
      ),
      buffer_mileage: apiDay.buffer_mileage ?? "",
      travel_time_minutes:
        apiDay.travel_time_minutes ??
        standardDescription?.travel_time_minutes ??
        "",
      note: apiDay.note || "",
    };
  });

  return mappedDays.map((day, index) => {
    if (index === 0) return day;

    return {
      ...day,
      starting_city_id:
        mappedDays[index - 1]?.destination_city_id || day.starting_city_id,
    };
  });
}

function resolveTravelMetric(dayValue, descriptionValue) {
  if (Number(dayValue) > 0) return dayValue;
  if (descriptionValue !== null && descriptionValue !== undefined) {
    return descriptionValue;
  }

  return dayValue ?? "";
}

export function buildDayUpdatePayload(dayData) {
  return {
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
    excursions: (dayData.excursions || [])
      .map((excursion) => ({
        excursion_id: Number(excursion.excursion_id ?? excursion.id),
        is_optional: excursion.is_optional === true,
      }))
      .filter((excursion) => Boolean(excursion.excursion_id)),
    standard_description_id:
      dayData.standard_description?.id || dayData.standard_description_id || null,
    actual_mileage:
      dayData.actual_mileage === "" ||
      dayData.actual_mileage === null ||
      dayData.actual_mileage === undefined
        ? null
        : Number(dayData.actual_mileage),
    buffer_mileage:
      dayData.buffer_mileage === "" ||
      dayData.buffer_mileage === null ||
      dayData.buffer_mileage === undefined
        ? null
        : Number(dayData.buffer_mileage),
    travel_time_minutes:
      dayData.travel_time_minutes === "" ||
      dayData.travel_time_minutes === null ||
      dayData.travel_time_minutes === undefined
        ? null
        : Number(dayData.travel_time_minutes),
    note: dayData.note || "",
  };
}
