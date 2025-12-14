const LS_KEY = "ti_hotels_mock";

const seed = [
  {
    id: 1,
    name: "Cinnamon Grand Colombo",
    cityId: 1,
    address: "Colombo 03",
    vatNumber: "123456789",
    sltdaReg: "SLTDA-00123",
    mealPlans: ["BB", "HB", "FB"],
    roomCategories: [
      { name: "Deluxe Room", basePriceUSD: 120 },
      { name: "Premium Room", basePriceUSD: 160 }
    ],
    driverAccommodation: {
      priceUSD: 15,
      notes: "Driver dormitory available"
    },
    specialPricingContact: {
      name: "Hotel Reservations",
      phone: "+94 112 433 456"
    },
    earlyCheckinUSD: 40,
    lateCheckoutUSD: 35,
    status: "active",
  }
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

function delay(result, ms = 300) {
  return new Promise((res) => setTimeout(() => res(result), ms));
}

export async function getHotels({ q = "" } = {}) {
  const data = read();
  const query = q.toLowerCase().trim();

  const filtered = !query
    ? data
    : data.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.address.toLowerCase().includes(query)
      );

  return delay(filtered);
}

export async function createHotel(payload) {
  const data = read();
  const id = data.length ? Math.max(...data.map((h) => h.id)) + 1 : 1;
  const newHotel = { id, status: "active", ...payload };

  data.push(newHotel);
  write(data);
  return delay(newHotel);
}

export async function updateHotel(id, patch) {
  const data = read();
  const idx = data.findIndex((h) => h.id === id);
  if (idx === -1) throw new Error("Hotel not found");

  data[idx] = { ...data[idx], ...patch };
  write(data);
  return delay(data[idx]);
}

export async function disableHotel(id) {
  const data = read();
  const idx = data.findIndex((h) => h.id === id);
  if (idx === -1) throw new Error("Hotel not found");

  data[idx].status = "inactive";
  write(data);
  return delay({ ok: true });
}
