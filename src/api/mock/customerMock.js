const LS_KEY = "ti_customers_mock";

const seed = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+94 77 123 4567",
    address: "Colombo, Sri Lanka",
    allergies: ["Nuts"],
    celebrations: ["Honeymoon"],
    status: "active"
  },
  {
    id: 2,
    name: "Emily Carter",
    email: "emily.carter@gmail.com",
    phone: "+44 7755 224466",
    address: "",
    allergies: [],
    celebrations: [],
    status: "active"
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

export async function getCustomers({ q = "" } = {}) {
  const data = read();
  const query = q.toLowerCase().trim();
  const filtered = !query
    ? data
    : data.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query)
      );
  return delay(filtered);
}

export async function createCustomer(payload) {
  const data = read();
  const dup = data.some(
    (c) => c.email.toLowerCase() === payload.email.toLowerCase()
  );
  if (dup) {
    const e = new Error("Email already exists");
    e.code = "EMAIL_EXISTS";
    throw e;
  }
  const id = data.length ? Math.max(...data.map((c) => c.id)) + 1 : 1;
  const newCustomer = { id, status: "active", ...payload };
  data.push(newCustomer);
  write(data);
  return delay(newCustomer);
}

export async function updateCustomer(id, patch) {
  const data = read();
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Not found");

  if (patch.email) {
    const dup = data.some(
      (c) => c.id !== id && c.email.toLowerCase() === patch.email.toLowerCase()
    );
    if (dup) {
      const e = new Error("Email already exists");
      e.code = "EMAIL_EXISTS";
      throw e;
    }
  }

  data[idx] = { ...data[idx], ...patch };
  write(data);
  return delay(data[idx]);
}

export async function deactivateCustomer(id) {
  const data = read();
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Not found");

  data[idx].status = "inactive";
  write(data);
  return delay({ ok: true });
}
