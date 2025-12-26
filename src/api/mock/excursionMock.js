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
  {
    id: 3,
    name: "Temple of the Tooth Relic",
    description: "Visit Sri Lanka’s most sacred Buddhist temple in Kandy.",
    tags: ["culture", "religion"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 2],
      childRange: [3, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 3,
      adultUSD: 6,
      guideFeeUSD: 10,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: false,
    assignedCityIds: [2],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: false, daysBefore: 0, nextDayAlso: false, note: "" },
    status: "active",
  },
  {
    id: 4,
    name: "Kandy Cultural Dance Show",
    description: "Traditional Kandyan dance and drumming performance.",
    tags: ["culture", "dance"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 4],
      childRange: [5, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 5,
      adultUSD: 8,
      guideFeeUSD: 0,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [2],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: true, daysBefore: 1, nextDayAlso: false, note: "Evening show" },
    status: "active",
  },
  {
    id: 5,
    name: "Sigiriya Village Safari",
    description: "Bullock cart ride, village walk, and local lunch.",
    tags: ["culture", "village"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 2],
      childRange: [3, 10],
      adultFrom: 11,
      infantUSD: 0,
      childUSD: 6,
      adultUSD: 12,
      guideFeeUSD: 8,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [3],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: false, daysBefore: 0, nextDayAlso: false, note: "" },
    status: "active",
  },
  {
    id: 6,
    name: "Pidurangala Rock Hike",
    description: "Sunrise hike with panoramic views of Sigiriya Rock.",
    tags: ["hiking", "nature"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 5],
      childRange: [6, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 2,
      adultUSD: 4,
      guideFeeUSD: 12,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [3],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: true, daysBefore: 1, nextDayAlso: false, note: "Early morning start" },
    status: "active",
  },
  {
    id: 7,
    name: "Spice Garden Visit",
    description: "Guided walk through a spice and herbal garden.",
    tags: ["nature", "education"],
    pricingType: "FREE",
    perPerson: null,
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: false,
    assignedCityIds: [1, 2],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: false, daysBefore: 0, nextDayAlso: false, note: "" },
    status: "active",
  },
  {
    id: 8,
    name: "Minneriya National Park Safari",
    description: "Elephant gathering safari by jeep.",
    tags: ["wildlife", "safari"],
    pricingType: "SAFARI",
    perPerson: null,
    safari: {
      jeepRentUSD: 55,
      perPersonEntranceUSD: 20,
      jeepEntranceUSD: 15,
      vatRate: 0.18,
      jeepCapacity: 6,
      fullDayAvailable: false,
      lunchPerPersonUSD: 0
    },
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [3],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: true, daysBefore: 5, nextDayAlso: true, note: "Seasonal availability" },
    status: "active",
  },
  {
    id: 9,
    name: "Dambulla Cave Temple",
    description: "Explore ancient cave temples with Buddha statues.",
    tags: ["culture", "UNESCO"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 2],
      childRange: [3, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 5,
      adultUSD: 7,
      guideFeeUSD: 10,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: false,
    assignedCityIds: [3],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: false, daysBefore: 0, nextDayAlso: false, note: "" },
    status: "active",
  },
  {
    id: 10,
    name: "Colombo City Highlights Tour",
    description: "Guided city tour covering key landmarks.",
    tags: ["city", "culture"],
    pricingType: "CUSTOM",
    perPerson: null,
    safari: null,
    boat: null,
    custom: {
      baseUSD: 40,
      note: "Price varies by duration"
    },
    isOptionalSupplement: false,
    assignedCityIds: [1],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: true, daysBefore: 1, nextDayAlso: false, note: "Confirm traffic timing" },
    status: "active",
  },
  {
    id: 11,
    name: "Colombo Street Food Walk",
    description: "Taste local snacks and street food.",
    tags: ["food", "culture"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 4],
      childRange: [5, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 6,
      adultUSD: 10,
      guideFeeUSD: 12,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [1],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: true, daysBefore: 1, nextDayAlso: false, note: "Evening walk" },
    status: "active",
  },
  {
    id: 12,
    name: "Kelaniya Temple Visit",
    description: "Historic Buddhist temple near Colombo.",
    tags: ["religion", "culture"],
    pricingType: "FREE",
    perPerson: null,
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: false,
    assignedCityIds: [1],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: false, daysBefore: 0, nextDayAlso: false, note: "" },
    status: "active",
  },
  {
    id: 13,
    name: "Udawattekele Forest Walk",
    description: "Nature walk in a forest reserve in Kandy.",
    tags: ["nature", "walking"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 4],
      childRange: [5, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 3,
      adultUSD: 5,
      guideFeeUSD: 10,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [2],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: false, daysBefore: 0, nextDayAlso: false, note: "" },
    status: "active",
  },
  {
    id: 14,
    name: "Traditional Cooking Class",
    description: "Hands-on Sri Lankan cooking experience.",
    tags: ["food", "experience"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 6],
      childRange: [7, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 8,
      adultUSD: 15,
      guideFeeUSD: 0,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: true,
    assignedCityIds: [1, 2],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: true, daysBefore: 2, nextDayAlso: false, note: "Pre-book ingredients" },
    status: "active",
  },
  {
    id: 15,
    name: "Elephant Orphanage Visit",
    description: "Observe elephant feeding and bathing.",
    tags: ["wildlife", "family"],
    pricingType: "PER_PERSON",
    perPerson: {
      infantRange: [0, 2],
      childRange: [3, 11],
      adultFrom: 12,
      infantUSD: 0,
      childUSD: 7,
      adultUSD: 12,
      guideFeeUSD: 10,
    },
    safari: null,
    boat: null,
    custom: null,
    isOptionalSupplement: false,
    assignedCityIds: [2],
    images: [],
    primaryImageIndex: null,
    reminder: { enabled: true, daysBefore: 1, nextDayAlso: false, note: "Morning visit recommended" },
    status: "active",
  }
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
