import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getExcursions,
  createExcursion,
  updateExcursion,
  disableExcursion
} from "../../api/mock/excursionMock";

export const fetchExcursions = createAsyncThunk("excursions/fetch", async (q = "") => {
  return await getExcursions({ q });
});

export const addExcursion = createAsyncThunk(
  "excursions/add",
  async (payload, { rejectWithValue }) => {
    try { return await createExcursion(payload); }
    catch (e) { return rejectWithValue(e.message); }
  }
);

export const editExcursion = createAsyncThunk(
  "excursions/edit",
  async ({ id, patch }, { rejectWithValue }) => {
    try { return await updateExcursion(id, patch); }
    catch (e) { return rejectWithValue(e.message); }
  }
);

export const disableExc = createAsyncThunk(
  "excursions/disable",
  async (id, { rejectWithValue }) => {
    try { await disableExcursion(id); return id; }
    catch (e) { return rejectWithValue(e.message); }
  }
);

const slice = createSlice({
  name: "excursions",
  initialState: {
    items: [],
    loading: false,
    error: null,
    query: "",
  },
  reducers: {
    setExcursionQuery(state, action) { state.query = action.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchExcursions.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchExcursions.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchExcursions.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

     .addCase(addExcursion.fulfilled, (s, a) => { s.items.push(a.payload); })
     .addCase(editExcursion.fulfilled, (s, a) => {
        const i = s.items.findIndex(x => x.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
     })
     .addCase(disableExc.fulfilled, (s, a) => {
        const i = s.items.findIndex(x => x.id === a.payload);
        if (i !== -1) s.items[i].status = "inactive";
     });
  }
});

export const { setExcursionQuery } = slice.actions;
export default slice.reducer;
