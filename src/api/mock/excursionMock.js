const LS_KEY = "ti_excursions_mock";

const seed = [
  {
    id: 1,
    name: "Sigiriya Rock Fortress",
    description: "Climb the ancient rock fortress and explore frescoes.",
    tags: ["culture", "UNESCO"],
    pricingType: "PER_PERSON", // PER_PERSON | SAFARI | BOAT | CUSTOM | FREE
    perPerson: {
      infantRange: [0, 2],
      childRange: [3, 5],
      adultFrom: 6,
      infantUSD: 0,
      childUSD: 8,
      adultUSD: 12,
      guideFeeUSD: 10, // optional; set to 0 if not applicable
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: false,
    assignedCityIds: [3], // Sigiriya
    images: [],
    primaryImageIndex: null,
    reminder: {
      enabled: false,
      daysBefore: 0,
      nextDayAlso: false,
      note: ""
    },
    status: "active",
  },
  {
    id: 2,
    name: "Yala Safari",
    description: "Half-day safari with jeep and entrance.",
    tags: ["wildlife", "safari"],
    pricingType: "SAFARI",
    perPerson: null,
    safari: {
      jeepRentUSD: 60,
      perPersonEntranceUSD: 25,
      jeepEntranceUSD: 15,
      vatRate: 0.18,
      jeepCapacity: 6,
      fullDayAvailable: true,
      lunchPerPersonUSD: 8
    },
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [2], // e.g., Kandy used as route stop (for demo)
    images: [],
    primaryImageIndex: null,
    reminder: {
      enabled: true,
      daysBefore: 7,
      nextDayAlso: true,
      note: "Pre-book jeeps"
    },
    status: "active",
  },
];

function ensureSeed() {
  if (!localStorage.getItem(LS_KEY)) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
  }
}
function read() { ensureSeed(); return JSON.parse(localStorage.getItem(LS_KEY)); }
function write(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)); }
function delay(result, ms = 250) { return new Promise(r => setTimeout(() => r(result), ms)); }

export async function getExcursions({ q = "" } = {}) {
  const data = read();
  const query = q.trim().toLowerCase();
  const filtered = !query
    ? data
    : data.filter(e =>
        e.name.toLowerCase().includes(query) ||
        (e.description || "").toLowerCase().includes(query) ||
        (e.tags || []).some(t => t.toLowerCase().includes(query))
      );
  return delay(filtered);
}

export async function createExcursion(payload) {
  const data = read();
  const id = data.length ? Math.max(...data.map(x => x.id)) + 1 : 1;
  const rec = {
    id,
    status: "active",
    tags: [],
    images: [],
    primaryImageIndex: null,
    isOptionalSupplement: false,
    reminder: { enabled: false, daysBefore: 0, nextDayAlso: false, note: "" },
    ...payload,
  };
  data.push(rec);
  write(data);
  return delay(rec);
}

export async function updateExcursion(id, patch) {
  const data = read();
  const idx = data.findIndex(x => x.id === id);
  if (idx === -1) throw new Error("Excursion not found");
  data[idx] = { ...data[idx], ...patch };
  write(data);
  return delay(data[idx]);
}

export async function disableExcursion(id) {
  const data = read();
  const idx = data.findIndex(x => x.id === id);
  if (idx === -1) throw new Error("Excursion not found");
  data[idx].status = "inactive";
  write(data);
  return delay({ ok: true });
}
