const LS_KEY = "ti_cities_mock";

const seed = [
  {
    id: 1,
    name: "Colombo",
    country: "Sri Lanka",
    region: "West",
    isDestination: true,
    isStop: true,
    status: "active",
  },
  {
    id: 2,
    name: "Kandy",
    country: "Sri Lanka",
    region: "Central",
    isDestination: true,
    isStop: true,
    status: "active",
  },
  {
    id: 3,
    name: "Sigiriya",
    country: "Sri Lanka",
    region: "Central",
    isDestination: true,
    isStop: false,
    status: "active",
  },
];

function ensureSeed() {
  if (!localStorage.getItem(LS_KEY)) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
  }
}

function read() {
  ensureSeed();
  return JSON.parse(localStorage.getItem(LS_KEY));
}

function write(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function delay(result, ms = 250) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function getCities({ q = "" } = {}) {
  const data = read();
  const query = q.trim().toLowerCase();
  const filtered = !query
    ? data
    : data.filter((c) => c.name.toLowerCase().includes(query) || c.region.toLowerCase().includes(query));
  return delay(filtered);
}

export async function createCity(payload) {
  const data = read();
  const dup = data.some((c) => c.name.toLowerCase() === payload.name.toLowerCase());
  if (dup) {
    const e = new Error("City already exists");
    e.code = "CITY_EXISTS";
    throw e;
  }
  const id = data.length ? Math.max(...data.map((x) => x.id)) + 1 : 1;
  const newCity = { id, status: "active", ...payload };
  data.push(newCity);
  write(data);
  return delay(newCity);
}

export async function updateCity(id, patch) {
  const data = read();
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("City not found");

  data[idx] = { ...data[idx], ...patch };
  write(data);
  return delay(data[idx]);
}

export async function deactivateCity(id) {
  const data = read();
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("City not found");

  data[idx].status = "inactive";
  write(data);
  return delay({ ok: true });
}
