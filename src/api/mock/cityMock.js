import api from "@/api/axios";

/**
 * GET ALL (POST as per backend)
 */
export async function getCities({ search = "", page = 1, limit = 10 }) {
  const { data } = await api.post("/cities/all/", {
    search,
    page,
    limit,
  });

  return {
    ...data.data,
    items: data.data.items.map((c) => ({
      ...c,
      isDestination: c.is_destination,
      isStop: c.is_stop,
    })),
  };
}


/**
 * CREATE
 */
export async function createCity(payload) {
  const { data } = await api.put("/cities/create/", {
    name: payload.name,
    country: payload.country,
    region: payload.region,
    is_destination: payload.isDestination,
    is_stop: payload.isStop,
  });

  if (data?.status === 200) {
    return {
      ...payload,
      id: Date.now(),  
      status: "active",
    };
  }

  throw new Error(data?.message || "Create city failed");
}



/**
 * UPDATE
 */
export async function updateCity(id, payload) {
  const { data } = await api.patch(`/cities/update/${id}`, {
    name: payload.name,
    country: payload.country,
    region: payload.region,
    is_destination: payload.isDestination,
    is_stop: payload.isStop,
    code: payload.code
  });

  const c = data.data;

  if (!c) {
    return {
      id,
      ...payload,
    };
  }

  return {
    ...c,
    isDestination: c.is_destination,
    isStop: c.is_stop,
  };
}


/**
 * DEACTIVATE (soft delete)
 * ❗ adjust endpoint if backend differs
 */
export async function deactivateCity(id) {
  const { data } = await api.patch(`/cities/deactivate/${id}`);
  return data.data;
}
