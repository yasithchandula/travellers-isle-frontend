// import axiosInstance from "./axiosInstance";

// const authApi = {
//   login: async (data) => {
//     const res = await axiosInstance.post("/auth/login", data);
//     return res.data;
//   },
//   register: async (data) => {
//     const res = await axiosInstance.post("/auth/register", data);
//     return res.data;
//   },
//   logout: async () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//   },
// };

// export default authApi;



const authApi = {
  login: async ({ email, password }) => {
    const usersData = await import("../mock/users.json");
    const users = usersData.default;

    await new Promise((res) => setTimeout(res, 400)); // mock delay

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      token: "mock-admin-token",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  register: async (data) => {
    console.log("Mock register user:", data);
    return { success: true };
  },

  logout: () => {
    localStorage.clear();
  },
};

export default authApi;

