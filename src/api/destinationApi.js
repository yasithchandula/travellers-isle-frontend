const destinationApi = {
    getAll: async () => {
        const data = await import('../mock/destinations.json');
        await new Promise((r) => setTimeout(r, 300));
        return data.default;
    },
    create: async (destination) => {
        console.log('Mock create destination:', destination);
        return { success: true };
    },
    update: async (id, data) => {
        console.log('Mock update destination:', id, data);
        return { success: true };
    },
    delete: async (id) => {
        console.log('Mock delete destination:', id);
        return { success: true };
    }
};
export default destinationApi;