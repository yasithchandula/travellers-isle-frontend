import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getHotels,
  createHotel,
  updateHotel,
  changeHotelStatus
} from "../../api/mock/hotelMock";

/* FETCH */
export const fetchHotels = createAsyncThunk(
  "hotels/fetch",
  async ({ page = 1, limit = 10 }) => {
    return await getHotels({ page, limit });
  }
);

/* CREATE */
export const addHotel = createAsyncThunk(
  "hotels/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await createHotel(payload);
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

/* UPDATE */
export const editHotel = createAsyncThunk(
  "hotels/edit",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateHotel(id, payload);
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

/* DISABLE */
export const disableHotel = createAsyncThunk(
  "hotels/disable",
  async (id) => {
    await changeHotelStatus(id);
    return id;
  }
);

const slice = createSlice({
  name: "hotels",
  initialState: {
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchHotels.pending, (s) => { s.loading = true; })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ correct path
        const res = action.payload;

        state.items = Array.isArray(res?.data?.items)
          ? res.data.items
          : [];

        state.page = res?.data?.page ?? 1;
        state.limit = res?.data?.page_size ?? 10;
        state.total = res?.data?.total ?? 0;
      })


      .addCase(fetchHotels.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })

      .addCase(addHotel.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })

      .addCase(editHotel.fulfilled, (s, a) => {
        const i = s.items.findIndex(h => h.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })

      .addCase(disableHotel.fulfilled, (s, a) => {
        const i = s.items.findIndex(h => h.id === a.payload);
        if (i !== -1) s.items[i].status = "inactive";
      });
  }
});

export default slice.reducer;
