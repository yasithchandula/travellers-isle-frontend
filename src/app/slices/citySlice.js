import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCities, createCity, updateCity, deactivateCity } from "../../api/mock/cityMock";

/**
 * FETCH
 */
export const fetchCities = createAsyncThunk(
  "cities/fetch",
  async ({ search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await getCities({ search, page, limit }); // ✅ NO .data

      return {
        items: data.items || [],
        page: data.page || 1,
        limit: data.page_size || limit,
        total: data.total || 0,
        total_pages: data.total_pages || 1,
      };

    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

/**
 * CREATE
 */
export const addCity = createAsyncThunk(
  "cities/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await createCity(payload);
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

/**
 * UPDATE
 */
export const editCity = createAsyncThunk(
  "cities/edit",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateCity(id, payload);
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

/**
 * DEACTIVATE
 */
export const deactivate = createAsyncThunk(
  "cities/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      await deactivateCity(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const citySlice = createSlice({
  name: "cities",
  initialState: {
    items: [],
    page: 1,
    limit: 10,
    total_pages: 1,
    total: 0,
    loading: false,
    error: null,
    search: "",
  },
  reducers: {
    setCitySearch(state, action) {
      state.search = action.payload;
    },
    setCityPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchCities.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCities.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.items;
        s.page = a.payload.page;
        s.limit = a.payload.limit;
        s.total = a.payload.total;
        s.total_pages = a.payload.total_pages;
      })
      .addCase(fetchCities.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ADD */
      .addCase(addCity.fulfilled, (s, a) => {
        if (!a.payload) return;
        s.items.unshift(a.payload);
        s.total += 1;
      })


      /* EDIT */
      .addCase(editCity.fulfilled, (s, a) => {
        if (!a.payload || !a.payload.id) return;

        const idx = s.items.findIndex((c) => c.id === a.payload.id);
        if (idx !== -1) {
          s.items[idx] = {
            ...s.items[idx],
            ...a.payload,
          };
        }
      })


      /* DEACTIVATE */
      .addCase(deactivate.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c.id === a.payload);
        if (idx !== -1) {
          s.items[idx].status = 0;
        }
      });
  },
});

export const { setCitySearch, setCityPage } = citySlice.actions;
export default citySlice.reducer;
