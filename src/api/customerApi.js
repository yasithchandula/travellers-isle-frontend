const customerApi = {
    getAll: async () => {
        const data = await import('../mock/customers.json');
        await new Promise((r) => setTimeout(r, 300));
        return data.default;
    },
    create: async (customer) => {
        console.log('Mock create customer:', customer);
        return { success: true };
    },
    update: async (id, data) => {
        console.log('Mock update customer:', id, data);
        return { success: true };
    },
    delete: async (id) => {
        console.log('Mock delete customer:', id);
        return { success: true };
    }
};
export default customerApi;