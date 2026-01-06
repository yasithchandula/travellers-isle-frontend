import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getExcursions,
  createExcursion,
  updateExcursion,
} from "../../api/mock/excursionMock";

/**
 * Fetch list
 */
export const fetchExcursions = createAsyncThunk(
  "excursions/fetch",
  async ({ search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await getExcursions({ search, page, limit });

      // IMPORTANT: normalize response
      return {
        items: res.data.data,
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
        totalPages: res.data.total_pages,
      };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);


/**
 * Create
 */
export const addExcursion = createAsyncThunk(
  "excursions/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await createExcursion(payload);
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

/**
 * Update
 */
export const editExcursion = createAsyncThunk(
  "excursions/edit",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateExcursion(id, payload);
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const slice = createSlice({
  name: "excursions",
  initialState: {
    items: [],
    loading: false,
    error: null,
    search: "",
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  reducers: {
    setExcursionSearch(state, action) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch */
      .addCase(fetchExcursions.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchExcursions.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.items;
        s.page = a.payload.page;
        s.limit = a.payload.limit;
        s.total = a.payload.total;
        s.totalPages = a.payload.totalPages;
      })

      .addCase(fetchExcursions.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })

      /* Create */
      .addCase(addExcursion.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })

      /* Update */
      .addCase(editExcursion.fulfilled, (s, a) => {
        const idx = s.items.findIndex((x) => x.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      });
  },
});

export const { setExcursionSearch } = slice.actions;
export default slice.reducer;
