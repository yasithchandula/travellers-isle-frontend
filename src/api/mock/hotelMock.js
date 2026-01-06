import api from "@/api/axios";

/* CREATE */
export const createHotel = (payload) =>
  api.put("/hotels/create/", payload).then(r => r.data);

/* UPDATE */
export const updateHotel = (id, payload) =>
  api.patch(`/hotels/update/${id}`, payload).then(r => r.data);

/* STATUS CHANGE (soft disable example) */
export const changeHotelStatus = (id) =>
  api.patch(`/hotels/update/${id}`, { status: "inactive" });

/* GET ALL (pagination ready) */
export const getHotels = ({ page = 1, limit = 10 } = {}) =>
  api.post("/hotels/all/", { page, limit }).then(r => r.data);
