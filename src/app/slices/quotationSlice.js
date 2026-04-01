import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createQuotationFromInquiryApi,
  updateQuotationDayApi,
  fetchQuotationFullDetailsApi,
  fetchQuotationSummaryTreeApi,
  fetchMonthlyQuotationDetailsApi,
  fetchQuotationPreviewHtmlApi,
} from "../../api/mock/quotationApi";

import { loadState, saveState, removeState } from "../../lib/storage";

const STORAGE_KEY = "quotation_shell";

/* ===============================
   ASYNC ACTIONS
================================ */

export const createQuotationFromInquiry = createAsyncThunk(
  "quotations/createFromInquiry",
  async (payload, { rejectWithValue }) => {
    try {
      return await createQuotationFromInquiryApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateQuotationDay = createAsyncThunk(
  "quotations/updateDay",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateQuotationDayApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchQuotationFullDetails = createAsyncThunk(
  "quotation/fetchFullDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchQuotationFullDetailsApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchQuotationSummaryTree = createAsyncThunk(
  "quotation/fetchSummaryTree",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchQuotationSummaryTreeApi();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMonthlyQuotationDetails = createAsyncThunk(
  "quotation/fetchMonthlyDetails",
  async (payload, { rejectWithValue }) => {
    try {
      return await fetchMonthlyQuotationDetailsApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchQuotationPreviewHtml = createAsyncThunk(
  "quotation/fetchPreviewHtml",
  async (id, { rejectWithValue }) => {
    try {
      const html = await fetchQuotationPreviewHtmlApi(id);
      return html;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   INITIAL STATE
================================ */

const persisted = loadState(STORAGE_KEY);

const initialState = {
  quotationShell: persisted || null,
  summaryTree: [],
  monthlyDetails: [],
  selectedMonth: null,
  loading: false,
  error: null,
  previewHtml: null,
};

/* ===============================
   SLICE
================================ */

const quotationSlice = createSlice({
  name: "quotations",
  initialState,

  reducers: {
    setQuotationShell: (state, action) => {
      state.quotationShell = action.payload;
      saveState(STORAGE_KEY, action.payload);
    },

    clearQuotationShell: (state) => {
      state.quotationShell = null;
      removeState(STORAGE_KEY);
    },
  },

  extraReducers: (builder) => {
    builder

      /* CREATE QUOTATION */

      .addCase(createQuotationFromInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createQuotationFromInquiry.fulfilled, (state, action) => {
        state.loading = false;

        const apiData = action.payload.data;

        const shell = {
          quotation_id: apiData.quotation_id,
          days: apiData.days,
          start_date: action.meta.arg.start_date,
          days_count: action.meta.arg.days_count,
        };

        state.quotationShell = shell;

        saveState(STORAGE_KEY, shell);
      })

      .addCase(createQuotationFromInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE DAY */

      .addCase(updateQuotationDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateQuotationDay.fulfilled, (state) => {
        state.loading = false;

        // API does not return updated day
        // so we only persist current state
        if (state.quotationShell) {
          saveState(STORAGE_KEY, state.quotationShell);
        }
      })

      .addCase(updateQuotationDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchQuotationFullDetails.fulfilled, (state, action) => {
        const { quotation, itinerary } = action.payload.data;
        state.quotationShell = {
          ...quotation,
          itinerary,
        };
      })

      .addCase(fetchQuotationSummaryTree.fulfilled, (state, action) => {
        state.summaryTree = action.payload.data.years;
      })

      .addCase(fetchMonthlyQuotationDetails.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchMonthlyQuotationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyDetails = action.payload.data.inquiries;
        state.selectedMonth = {
          year: action.payload.data.year,
          month: action.payload.data.month,
        };
      })

      .addCase(fetchMonthlyQuotationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchQuotationPreviewHtml.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchQuotationPreviewHtml.fulfilled, (state, action) => {
        state.loading = false;
        state.previewHtml = action.payload; // HTML string
      })

      .addCase(fetchQuotationPreviewHtml.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


  },
});

export const { setQuotationShell, clearQuotationShell } =
  quotationSlice.actions;

export default quotationSlice.reducer;