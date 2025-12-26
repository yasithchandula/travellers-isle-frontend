import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStandardDescriptions } from "../../api/mock/standardDescriptionMock";

export const fetchStandardDescriptions = createAsyncThunk(
  "standardDescriptions/fetch",
  async () => {
    return await getStandardDescriptions();
  }
);

const standardDescriptionSlice = createSlice({
  name: "standardDescriptions",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStandardDescriptions.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStandardDescriptions.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchStandardDescriptions.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      });
  },
});

export default standardDescriptionSlice.reducer;
