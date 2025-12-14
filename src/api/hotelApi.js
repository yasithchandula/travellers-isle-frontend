const hotelApi = {
    getAll: async () => {
        const data = await import('../mock/hotels.json');
        await new Promise((r) => setTimeout(r, 300));
        return data.default;
    },
    create: async (hotel) => {
        console.log('Mock create hotel:', hotel);
        return { success: true };
    },
    update: async (id, data) => {
        console.log('Mock update hotel:', id, data);
        return { success: true };
    },
    delete: async (id) => {
        console.log('Mock delete hotel:', id);
        return { success: true };
    }
};
export default hotelApi;