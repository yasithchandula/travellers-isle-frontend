import api from "./axios";

/**
 * LOGIN
 */
export async function loginAuth(identifier, password) {
  const { data } = await api.post("/auth/login", {
    identifier,
    password,
  });

  return data;
}

/**
 * CURRENT USER / PROFILE
 */
export async function getAuthUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

/**
 * CHANGE PASSWORD
 */
export async function changePassword(newPassword) {
  const { data } = await api.post("/users/change-password", {
    password: newPassword,
  });

  return data;
}

/**
 * LOGOUT
 */
export function logoutAuth() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  window.location.href = "/login";
}
