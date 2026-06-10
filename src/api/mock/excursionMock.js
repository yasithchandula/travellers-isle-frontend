import api from "@/api/axios";

/**
 * POST /excursions/all/
 */
export async function getExcursions({ search = "", page = 1, limit = 10 }) {
  const { data } = await api.post("/excursions/all/", {
    search,
    page,
    limit,
  });

  return data; // return FULL response
}

/**
 * POST /excursions/all-no-pages
 */
export async function getExcursionsByCity({ search = "", city }) {
  const { data } = await api.post("/excursions/all-no-pages", {
    search,
    city,
  });

  return data;
}

/**
 * PUT /excursions/create/
 */
export async function createExcursion(payload) {
  const { data } = await api.put("/excursions/create/", payload);
  return data;
}

/**
 * PATCH /excursions/update/:id
 */
export async function updateExcursion(id, payload) {
  const { data } = await api.patch(`/excursions/update/${id}`, payload);
  return data;
}
