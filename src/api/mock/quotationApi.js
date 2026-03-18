import api from "@/api/axios";

/**
 * CREATE QUOTATION FROM INQUIRY
 * POST /quotations/create-from-inquiry
 */
export async function createQuotationFromInquiryApi(payload) {

  const {
    inquiry_id,
    start_date,
    days_count,
    pax_adults,
    pax_children_ages,
    created_by,
  } = payload;

  const { data } = await api.put(
    "/quotations/create-from-inquiry",
    {
      inquiry_id,
      start_date,
      days_count,
      pax_adults,
      pax_children_ages,
      created_by,
    }
  );

  return data;
}

/**
 * UPDATE QUOTATION DAY
 * PUT /quotations/update-day
 */
export async function updateQuotationDayApi(payload) {
  const {
    id,
    start_city_id,
    end_city_id,
    staying_city_id,
    stop_ids,
    standard_description_id,
    note,
  } = payload;

  const { data } = await api.patch("/quotations/update-day", {
    id,
    start_city_id,
    end_city_id,
    staying_city_id,
    stop_ids,
    standard_description_id,
    note,
  });

  return data;
}


export async function fetchQuotationFullDetailsApi(id) {
  return api.get(`/quotations/full-details/${id}`);
};