import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHotels, createHotel, updateHotel, disableHotel } from "../../api/mock/hotelMock";

export const fetchHotels = createAsyncThunk("hotels/fetch", async (q = "") => {
  return await getHotels({ q });
});

export const addHotel = createAsyncThunk(
  "hotels/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await createHotel(payload);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const editHotel = createAsyncThunk(
  "hotels/edit",
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      return await updateHotel(id, patch);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const disable = createAsyncThunk(
  "hotels/disable",
  async (id, { rejectWithValue }) => {
    try {
      await disableHotel(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const slice = createSlice({
  name: "hotels",
  initialState: {
    items: [],
    loading: false,
    error: null,
    query: "",
  },
  reducers: {
    setHotelQuery(state, action) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchHotels.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchHotels.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(addHotel.fulfilled, (s, a) => { s.items.push(a.payload); })

      .addCase(editHotel.fulfilled, (s, a) => {
        const idx = s.items.findIndex((h) => h.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })

      .addCase(disable.fulfilled, (s, a) => {
        const idx = s.items.findIndex((h) => h.id === a.payload);
        if (idx !== -1) s.items[idx].status = "inactive";
      });
  },
});

export const { setHotelQuery } = slice.actions;
export default slice.reducer;
