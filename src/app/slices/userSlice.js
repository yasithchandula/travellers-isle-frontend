import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/mock/userMock";

export const fetchUsers = createAsyncThunk("users/fetch", async (q = "") => {
  const data = await getUsers({ q });

  return data;
});

export const addUser = createAsyncThunk("users/add", async (payload, { rejectWithValue }) => {
  try {
    const data = await createUser(payload);
    return data;
  } catch (e) {
    return rejectWithValue(e.message || "Failed to create user");
  }
});

export const editUser = createAsyncThunk("users/edit", async ({ id, patch }, { rejectWithValue }) => {
  try {
    const data = await updateUser(id, patch);
    return data;
  } catch (e) {
    return rejectWithValue(e.message || "Failed to update user");
  }
});

export const removeUser = createAsyncThunk("users/remove", async (id, { rejectWithValue }) => {
  try {
    console.log("Deleting user with ID:", id);
    await deleteUser({ user_id: id, type: "SOFT" });
    return id;
  } catch (e) {
    return rejectWithValue(e.message || "Failed to delete user");
  }
});

const slice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: null,
    query: "",
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.items = action.payload.data.items;
        state.page = action.payload.data.page;
        state.total = action.payload.data.total;
        state.totalPages = action.payload.data.total_pages;
        state.loading = false;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load users";
      })


      .addCase(addUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(addUser.fulfilled, (s, a) => { s.loading = false; s.items.push(a.payload); })
      .addCase(addUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(editUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(editUser.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.items.findIndex((u) => u.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(editUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(removeUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(removeUser.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter((u) => u.id !== a.payload);
      })
      .addCase(removeUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setQuery } = slice.actions;
export default slice.reducer;
