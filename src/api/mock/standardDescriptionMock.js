import api from "@/api/axios";

/**
 * POST /standard-descriptions/all
 */
export async function getStandardDescriptions({
  search = "",
  status = "",
  page = 1,
  limit = 10,
}) {
  const { data } = await api.post("/standard-descriptions/all", {
    search,
    status,
    page,
    limit,
  });

  return data; // return FULL response
}

/**
 * POST /standard-descriptions/search
 */
export async function searchStandardDescriptionsApi(payload) {
  const { data } = await api.post("/standard-descriptions/search", payload);
  return data;
}

/**
 * PUT /standard-descriptions/create/
 */
export async function createStandardDescription(payload) {
  const { data } = await api.put(
    "/standard-descriptions/create/",
    payload
  );
  return data;
}

/**
 * PATCH /standard-descriptions/update/:id
 */
export async function updateStandardDescription(id, payload) {
  const { data } = await api.patch(
    `/standard-descriptions/update/${id}`,
    payload
  );
  return data;
}

/**
 * DELETE /standard-descriptions/delete/:id
 */
export async function deleteStandardDescription(id) {
  const { data } = await api.delete(
    `/standard-descriptions/delete/${id}`
  );
  return data;
}

/**
 * PATCH /standard-descriptions/approve/:id
 */
export async function approveStandardDescription(id) {
  const { data } = await api.patch(
    `/standard-descriptions/approve/${id}`
  );
  return data;
}


export const fetchDistanceApi = async (payload) => {
  const res = await api.post(
    "/standard-descriptions/distance",
    payload
  );
  return res.data;
};
