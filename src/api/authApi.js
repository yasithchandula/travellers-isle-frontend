import axiosInstance from "./axiosInstance";

const authApi = {
  login: async (data) => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  },
  register: async (data) => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  },
  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
};

export default authApi;
