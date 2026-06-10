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
      excursions: Array.isArray(apiDay.excursions) ? apiDay.excursions : [],
      standard_description: apiDay.standard_description || null,
      standard_description_id: apiDay.standard_description_id || null,
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
    standard_description_id:
      dayData.standard_description?.id || dayData.standard_description_id || null,
    note: dayData.note || "",
  };
}
