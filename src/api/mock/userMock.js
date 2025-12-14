const LS_KEY = "ti_users_mock";

const seed = [
  { id: 1, name: "Admin User", email: "admin@travellersisle.lk", role: "ADMIN", status: "active" },
  { id: 2, name: "Mary Silva", email: "mary@travellersisle.lk", role: "MANAGER", status: "active" },
  { id: 3, name: "Kevin Dias", email: "kevin@travellersisle.lk", role: "TOUR_EXECUTIVE", status: "inactive" },
];

function ensureSeed() {
  const exists = localStorage.getItem(LS_KEY);
  if (!exists) localStorage.setItem(LS_KEY, JSON.stringify(seed));
}

function readAll() {
  ensureSeed();
  return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
}

function writeAll(users) {
  localStorage.setItem(LS_KEY, JSON.stringify(users));
}

// Simulated network delay
function delay(result, ms = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function getUsers({ q = "" } = {}) {
  const data = readAll();
  const query = q.trim().toLowerCase();
  const filtered = !query
    ? data
    : data.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.role.toLowerCase().includes(query)
      );
  return delay(filtered);
}

export async function createUser(payload) {
  const data = readAll();
  const exists = data.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (exists) {
    const err = new Error("Email already exists");
    err.code = "EMAIL_EXISTS";
    throw err;
  }
  const nextId = data.length ? Math.max(...data.map((u) => u.id)) + 1 : 1;
  const newUser = { id: nextId, status: "active", ...payload };
  data.push(newUser);
  writeAll(data);
  return delay(newUser);
}

export async function updateUser(id, patch) {
  const data = readAll();
  const idx = data.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  // prevent email duplication
  if (patch.email) {
    const dup = data.some((u) => u.id !== id && u.email.toLowerCase() === patch.email.toLowerCase());
    if (dup) {
      const err = new Error("Email already exists");
      err.code = "EMAIL_EXISTS";
      throw err;
    }
  }
  data[idx] = { ...data[idx], ...patch };
  writeAll(data);
  return delay(data[idx]);
}

export async function deleteUser(id) {
  const data = readAll();
  const next = data.filter((u) => u.id !== id);
  writeAll(next);
  return delay({ ok: true });
}
