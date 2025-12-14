export const inquiryApi = {
  getAll: async () => {
    const data = await import('../mock/inquiries.json');
    await new Promise((res) => setTimeout(res, 400)); // simulate API delay
    return data.default;
  },
  create: async (inquiry) => {
    console.log('Mock create inquiry:', inquiry);
    return { success: true };
  },
  update: async (id, updated) => {
    console.log('Mock update', id, updated);
    return { success: true };
  },
  delete: async (id) => {
    console.log('Mock delete inquiry:', id);
    return { success: true };
  },
};