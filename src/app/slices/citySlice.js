import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCities, createCity, updateCity, deactivateCity } from "../../api/mock/cityMock";

export const fetchCities = createAsyncThunk("cities/fetch", async (q = "") => {
  return await getCities({ q });
});

export const addCity = createAsyncThunk("cities/add", async (payload, { rejectWithValue }) => {
  try {
    return await createCity(payload);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const editCity = createAsyncThunk("cities/edit", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await updateCity(id, patch);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deactivate = createAsyncThunk("cities/deactivate", async (id, { rejectWithValue }) => {
  try {
    await deactivateCity(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const citySlice = createSlice({
  name: "cities",
  initialState: {
    items: [],
    loading: false,
    error: null,
    query: "",
  },
  reducers: {
    setCityQuery(state, action) {
      state.query = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCities.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchCities.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(addCity.fulfilled, (s, a) => { s.items.push(a.payload); })

      .addCase(editCity.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })

      .addCase(deactivate.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c.id === a.payload);
        if (idx !== -1) s.items[idx].status = "inactive";
      });
  }
});

export const { setCityQuery } = citySlice.actions;
export default citySlice.reducer;
