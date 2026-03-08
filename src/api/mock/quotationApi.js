import api from "@/api/axios";

/**
 * CREATE QUOTATION FROM INQUIRY
 * POST /quotations/create-from-inquiry
 */
export async function createQuotationFromInquiry(payload) {

  const {
    inquiry_id,
    start_date,
    days_count,
    pax_adults,
    pax_children_ages,
    created_by,
  } = payload;

  const { data } = await api.post(
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