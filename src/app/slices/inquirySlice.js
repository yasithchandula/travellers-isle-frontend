import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getInquiries,
  createInquiry,
  updateInquiry,
  markSpam,
  assignInquiry,
  convertInquiry
} from "../../api/mock/inquiryMock";

export const fetchInquiries = createAsyncThunk(
  "inquiries/fetch",
  async ({ q = "", label = "" }) => {
    return await getInquiries({ q, label });
  }
);

export const addInquiry = createAsyncThunk(
  "inquiries/add",
  async (payload) => await createInquiry(payload)
);

export const editInquiry = createAsyncThunk(
  "inquiries/edit",
  async ({ id, patch }) => await updateInquiry(id, patch)
);

export const spamInquiry = createAsyncThunk(
  "inquiries/spam",
  async (id) => {
    await markSpam(id);
    return id;
  }
);

export const assignToExecutive = createAsyncThunk(
  "inquiries/assign",
  async ({ id, userId }) => {
    const data = await assignInquiry(id, userId);
    return data;
  }
);

export const convertToTour = createAsyncThunk(
  "inquiries/convert",
  async (id) => {
    const data = await convertInquiry(id);
    return data;
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
  },
  reducers: {
    setInquiryQuery(state, action) {
      state.query = action.payload;
    },
    setInquiryLabel(state, action) {
      state.labelFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (s) => { s.loading = true; })
      .addCase(fetchInquiries.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchInquiries.rejected, (s) => { s.loading = false; })

      .addCase(addInquiry.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })

      .addCase(assignToExecutive.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })

      .addCase(convertToTour.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })

      .addCase(spamInquiry.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload);
        if (idx !== -1) s.items[idx].status = "spam";
      });
  },
});

export const { setInquiryQuery, setInquiryLabel } = slice.actions;
export default slice.reducer;
