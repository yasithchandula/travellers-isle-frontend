const LS_KEY = "ti_inquiries_mock";

const seed = [
  {
    id: 1,
    name: "Michael Reed",
    email: "michael@example.com",
    phone: "+94 77 532 4422",
    tourDate: "2025-03-22",
    adults: 2,
    children: 1,
    message: "Need a 7-day tour around cultural triangle.",
    source: "website",
    label: "",
    status: "new",   // new, assigned, converted, spam
    assignedTo: null,
    createdAt: "2025-02-10",
  },
  {
    id: 2,
    name: "Sarah Jones",
    email: "sarah@gmail.com",
    phone: "+1 345 223 9988",
    tourDate: "",
    adults: 4,
    children: 0,
    message: "Please share a quotation for a family trip.",
    source: "manual",
    label: "urgent",
    status: "assigned",
    assignedTo: 1, // user ID
    createdAt: "2025-02-12",
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
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function getInquiries({ q = "", label = "" } = {}) {
  const data = read();
  const query = q.toLowerCase().trim();

  let filtered = data;

  if (query) {
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(query) ||
        i.email.toLowerCase().includes(query) ||
        i.phone.toLowerCase().includes(query)
    );
  }

  if (label) {
    filtered = filtered.filter((i) => i.label === label);
  }

  return delay(filtered);
}

export async function createInquiry(payload) {
  const data = read();
  const id = data.length ? Math.max(...data.map((x) => x.id)) + 1 : 1;

  const newInquiry = {
    id,
    status: "new",
    label: "",
    source: "manual",
    assignedTo: null,
    createdAt: new Date().toISOString().slice(0, 10),
    ...payload,
  };

  data.push(newInquiry);
  write(data);
  return delay(newInquiry);
}

export async function updateInquiry(id, patch) {
  const data = read();
  const idx = data.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Inquiry not found");

  data[idx] = { ...data[idx], ...patch };
  write(data);
  return delay(data[idx]);
}

export async function markSpam(id) {
  return updateInquiry(id, { status: "spam" });
}

export async function assignInquiry(id, userId) {
  return updateInquiry(id, { assignedTo: userId, status: "assigned" });
}

export async function convertInquiry(id) {
  return updateInquiry(id, { status: "converted" });
}
