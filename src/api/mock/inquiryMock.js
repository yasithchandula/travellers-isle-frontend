import api from "@/api/axios";

/**
 * POST /inquiries/all
 */
export async function getInquiries({
  search = "",
  status = "",
  page = 1,
  limit = 10,
}) {
  const { data } = await api.post("/inquiries/all", {
    search,
    status,
    page,
    limit,
  });

  return data;
}

/**
 * POST /inquiries/create
 */
export async function createInquiry(payload) {
  const { data } = await api.post("/inquiries/create", payload);
  return data;
}

/**
 * PATCH /inquiries/update-assign-to
 */
export async function updateAssignTo(inquiry_id, user_id) {
  const { data } = await api.patch("/inquiries/update-assign-to", {
    inquiry_id,
    user_id,
  });

  return data;
}

/**
 * PATCH /inquiries/spam/:id
 * (If backend supports it)
 */
export async function markInquirySpam(id) {
  const { data } = await api.patch(`/inquiries/spam/${id}`);
  return data;
}

/**
 * PATCH /inquiries/convert/:id
 * (If backend supports it)
 */
export async function convertInquiryToTour(id) {
  const { data } = await api.patch(`/inquiries/convert/${id}`);
  return data;
}