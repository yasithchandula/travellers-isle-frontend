// src/api/excursionApi.js
let inMemoryExcursions = null;

const loadMock = async () => {
  if (!inMemoryExcursions) {
    const data = await import("../mock/excursions.json");
    inMemoryExcursions = data.default;
  }
  return inMemoryExcursions;
};

const excursionApi = {
  getAll: async () => {
    const data = await loadMock();
    await new Promise((r) => setTimeout(r, 300));
    return data;
  },

  create: async (excursion) => {
    const data = await loadMock();
    const newItem = { ...excursion, id: Date.now() };
    inMemoryExcursions = [...data, newItem];
    console.log("Mock create excursion:", newItem);
    return newItem;
  },

  update: async (id, updated) => {
    const data = await loadMock();
    inMemoryExcursions = data.map((e) => (e.id === id ? { ...e, ...updated } : e));
    console.log("Mock update excursion:", id, updated);
    return { success: true };
  },

  delete: async (id) => {
    const data = await loadMock();
    inMemoryExcursions = data.filter((e) => e.id !== id);
    console.log("Mock delete excursion:", id);
    return { success: true };
  },
};

export default excursionApi;
