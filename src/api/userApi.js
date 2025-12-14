const userApi = {
    getAll: async () => {
        const data = await import('../mock/users.json');
        await new Promise((r) => setTimeout(r, 300));
        return data.default;
    },
    create: async (user) => {
        console.log('Mock create user:', user);
        return { success: true };
    },
    delete: async (id) => {
        console.log('Mock delete user:', id);
        return { success: true };
    }
};
export default userApi;