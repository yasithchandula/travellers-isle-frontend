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
}


/**
 * GET SUMMARY TREE
 * GET /quotations/summary
 */
export async function fetchQuotationSummaryTreeApi() {
  const { data } = await api.get("/quotations/summary");
  return data;
}

/**
 * GET MONTHLY DETAILS
 * POST /quotations/monthly-details
 */
export async function fetchMonthlyQuotationDetailsApi(payload) {
  const { year, month } = payload;

  const { data } = await api.post("/quotations/monthly-details", {
    year,
    month,
  });

  return data;
}

/**
 * GET HTML PREVIEW
 */
export async function fetchQuotationPreviewHtmlApi(id) {
  const res = await api.get(`/quotations/generate-html/${id}`, {
    responseType: "text", // IMPORTANT
  });

  return res.data;
};


/**
 * BULK SAVE OPTIONS (HOTELS / ROOMS)
 * POST /quotations/options/bulk-save
 */
export async function bulkSaveQuotationOptionsApi(payload) {
  const { data } = await api.post(
    "/quotations/options/bulk-save",
    payload
  );
  return data;
}

/**
 * FETCH QUOTATION OPTIONS
 * GET /quotations/:id/options
 */
export async function fetchQuotationOptionsApi(quotationId) {
  const { data } = await api.get(
    `/quotations/${quotationId}/options`
  );
  return data;
}

/**
 * UPDATE QUOTATION OPTION
 * PATCH /quotations/:quotationId/options/:optionIndex
 */
export async function updateQuotationOptionApi({
  quotationId,
  optionIndex,
  payload,
}) {
  const { data } = await api.patch(
    `/quotations/${quotationId}/options/${optionIndex}`,
    payload
  );
  return data;
}

/**
 * DELETE QUOTATION OPTION
 * DELETE /quotations/:quotationId/options/:optionIndex
 */
export async function deleteQuotationOptionApi({
  quotationId,
  optionIndex,
}) {
  const { data } = await api.delete(
    `/quotations/${quotationId}/options/${optionIndex}`
  );
  return data;
}


/**
 * GENERATE PDF
 * POST /pdf/generate/:id
 */
export async function generateQuotationPdfApi(quotationId) {
  const { data } = await api.get(
    `/quotations/generate-pdf/${quotationId}`
  );

  return data;
}
