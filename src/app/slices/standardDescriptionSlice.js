import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getStandardDescriptions,
  createStandardDescription,
  updateStandardDescription,
  deleteStandardDescription,
  approveStandardDescription,
  fetchDistanceApi,
  searchStandardDescriptionsApi,
} from "../../api/mock/standardDescriptionMock";

/**
 * Fetch list
 */
export const fetchStandardDescriptions = createAsyncThunk(
  "standardDescriptions/fetch",
  async (
    { search = "", status = "", page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      const res = await getStandardDescriptions({
        search,
        status,
        page,
        limit,
      });

      return {
        items: res.data.items,          // ✅ FIX
        page: res.data.page,
        limit: res.data.page_size,      // ✅ FIX
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
export const addStandardDescription = createAsyncThunk(
  "standardDescriptions/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await createStandardDescription(payload);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/**
 * Update
 */
export const editStandardDescription = createAsyncThunk(
  "standardDescriptions/edit",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateStandardDescription(id, payload);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/**
 * Delete
 */
export const removeStandardDescription = createAsyncThunk(
  "standardDescriptions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteStandardDescription(id);
      return id;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/**
 * Approve
 */
export const approveStandardDescriptionById = createAsyncThunk(
  "standardDescriptions/approve",
  async (id, { rejectWithValue }) => {
    try {
      return await approveStandardDescription(id);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

export const fetchDistance = createAsyncThunk(
  "standardDescriptions/fetchDistance",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetchDistanceApi(payload);

      if (!res?.data?.distance) {
        throw new Error("Invalid distance response");
      }

      return res.data.distance;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message
      );
    }
  }
);

export const searchStandardDescriptions = createAsyncThunk(
  "standardDescriptions/searchMatches",
  async (
    { start_city = null, end_city = null, excursions = [] },
    { rejectWithValue }
  ) => {
    try {
      const result = await searchStandardDescriptionsApi({
        start_city,
        end_city,
        excursions,
      });

      return {
        exact_match: result?.exact_match || null,
        found: result?.found === true,
        suggestions: Array.isArray(result?.suggestions)
          ? result.suggestions
          : [],
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

const slice = createSlice({
  name: "standardDescriptions",
  initialState: {
    items: [],
    loading: false,
    error: null,
    search: "",
    status: "",
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  reducers: {
    setStandardDescriptionSearch(state, action) {
      state.search = action.payload;
    },
    setStandardDescriptionStatus(state, action) {
      state.status = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= FETCH ================= */
      .addCase(fetchStandardDescriptions.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStandardDescriptions.fulfilled, (state, action) => {
        state.loading = false;

        const {
          items = [],
          page,
          limit,
          total,
          totalPages,
        } = action.payload || {};

        state.items = Array.isArray(items) ? items : [];
        state.page = page;
        state.limit = limit;
        state.total = total;
        state.totalPages = totalPages;
      })

      .addCase(fetchStandardDescriptions.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })

      /* ================= CREATE ================= */
      .addCase(addStandardDescription.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })

      /* ================= UPDATE ================= */
      .addCase(editStandardDescription.fulfilled, (s, a) => {
        const idx = s.items.findIndex(
          (x) => x.id === a.payload.id
        );
        if (idx !== -1) s.items[idx] = a.payload;
      })

      /* ================= DELETE ================= */
      .addCase(removeStandardDescription.fulfilled, (s, a) => {
        s.items = s.items.filter(
          (i) => i.id !== a.payload
        );
      })

      /* ================= APPROVE ================= */
      .addCase(
        approveStandardDescriptionById.fulfilled,
        (s, a) => {
          const idx = s.items.findIndex(
            (x) => x.id === a.payload.id
          );
          if (idx !== -1) {
            s.items[idx].status = "APPROVED";
          }
        }
      )

      .addCase(fetchDistance.pending, (state) => {
        state.distanceLoading = true;
        state.distanceError = null;
      })
      .addCase(fetchDistance.fulfilled, (state, action) => {
        state.distanceLoading = false;
        state.distance = action.payload;
      })
      .addCase(fetchDistance.rejected, (state, action) => {
        state.distanceLoading = false;
        state.distanceError = action.payload;
      });
  },
});

export const {
  setStandardDescriptionSearch,
  setStandardDescriptionStatus,
} = slice.actions;

export default slice.reducer;
