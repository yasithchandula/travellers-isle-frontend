import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getInquiries,
  createInquiry,
  updateAssignTo,
  markInquirySpam,
  convertInquiryToTour,
} from "../../api/mock/inquiryMock";

/* ================= FETCH ================= */

export const fetchInquiries = createAsyncThunk(
  "inquiries/fetch",
  async (
    { q = "", label = "", page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      const res = await getInquiries({
        search: q,
        status: label,
        page,
        limit,
      });

      return {
        items: res.data?.inquiries || [],
        page,
        limit,
        total: res.data?.total || 0,
        totalPages: Math.ceil((res.data?.total || 0) / limit),
      };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

/* ================= CREATE ================= */

export const addInquiry = createAsyncThunk(
  "inquiries/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await createInquiry(payload);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* ================= ASSIGN ================= */

export const assignToExecutive = createAsyncThunk(
  "inquiries/assign",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      return await updateAssignTo(id, userId);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* ================= SPAM ================= */

export const spamInquiry = createAsyncThunk(
  "inquiries/spam",
  async (id, { rejectWithValue }) => {
    try {
      await markInquirySpam(id);
      return id;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* ================= CONVERT ================= */

export const convertToTour = createAsyncThunk(
  "inquiries/convert",
  async (id, { rejectWithValue }) => {
    try {
      return await convertInquiryToTour(id);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

const slice = createSlice({
  name: "inquiries",

  initialState: {
    items: [],
    loading: false,
    error: null,

    query: "",
    labelFilter: "",

    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  reducers: {
    setInquiryQuery(state, action) {
      state.query = action.payload;
    },

    setInquiryLabel(state, action) {
      state.labelFilter = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH ================= */

      .addCase(fetchInquiries.pending, (s) => {
        s.loading = true;
        s.error = null;
      })

      .addCase(fetchInquiries.fulfilled, (state, action) => {
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

      .addCase(fetchInquiries.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })

      /* ================= CREATE ================= */

      .addCase(addInquiry.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })

      /* ================= ASSIGN ================= */

      .addCase(assignToExecutive.fulfilled, (s, a) => {
        const idx = s.items.findIndex(
          (i) => i.id === a.payload.id
        );

        if (idx !== -1) {
          s.items[idx].assignedTo = a.payload.user_id;
          s.items[idx].status = "assigned";
        }
      })

      /* ================= SPAM ================= */

      .addCase(spamInquiry.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload);

        if (idx !== -1) {
          s.items[idx].status = "spam";
        }
      })

      /* ================= CONVERT ================= */

      .addCase(convertToTour.fulfilled, (s, a) => {
        const idx = s.items.findIndex(
          (i) => i.id === a.payload.id
        );

        if (idx !== -1) {
          s.items[idx].status = "converted";
        }
      });
  },
});

export const {
  setInquiryQuery,
  setInquiryLabel,
} = slice.actions;

export default slice.reducer;