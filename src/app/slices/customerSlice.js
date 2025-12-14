import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deactivateCustomer
} from "../../api/mock/customerMock";

export const fetchCustomers = createAsyncThunk(
  "customers/fetch",
  async (q = "") => {
    return await getCustomers({ q });
  }
);

export const addCustomer = createAsyncThunk(
  "customers/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await createCustomer(payload);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const editCustomer = createAsyncThunk(
  "customers/edit",
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      return await updateCustomer(id, patch);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deactivate = createAsyncThunk(
  "customers/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      await deactivateCustomer(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    items: [],
    loading: false,
    error: null,
    query: "",
  },
  reducers: {
    setCustomerQuery(state, action) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCustomers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCustomers.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchCustomers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })

      .addCase(addCustomer.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })

      .addCase(editCustomer.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })

      .addCase(deactivate.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c.id === a.payload);
        if (idx !== -1) s.items[idx].status = "inactive";
      });
  },
});

export const { setCustomerQuery } = customerSlice.actions;
export default customerSlice.reducer;
