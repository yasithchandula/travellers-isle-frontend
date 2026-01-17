import api from "@/api/axios";

/**
 * GET USERS (Paginated)
 * POST /users/all
 */
export async function getUsers({ page = 1, limit = 10 } = {}) {
  const { data } = await api.post("/users/all", {
    page,
    limit,
  });

  return data;
}

/**
 * CREATE USER
 * PUT /users/create
 */
export async function createUser(payload) {
  const { email, display_name, role } = payload;

  const { data } = await api.put("/users/create", {
    email,
    display_name,
    role,
  });

  return data;
}

/**
 * UPDATE USER
 * PATCH /users/update
 */
export async function updateUser(user_id, payload) {
  const {
    email,
    display_name,
    role,
    status,
  } = payload;

  const { data } = await api.patch("/users/update", {
    user_id,
    email,
    display_name,
    role,
    status,
  });
  return data;
}

/**
 * DELETE USER (SOFT / HARD)
 * DELETE /users/delete
 */
export async function deleteUser({ user_id, type = "SOFT" }) {
  const { data } = await api.delete("/users/delete", {
    data: {
      user_id,
      type,
    },
  });

  return data;
}
