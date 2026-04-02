import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/mock/userMock";

/* ===================== THUNKS ===================== */

// FETCH
export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (q = "", { rejectWithValue }) => {
    try {
      const data = await getUsers({ q });
      return data;
    } catch (e) {
      return rejectWithValue(e.message || "Unable to load users");
    }
  }
);

// ADD
export const addUser = createAsyncThunk(
  "users/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createUser(payload);

      return {
        temp_password: res?.data?.temp_password,
        message: res?.message,
      };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to create user"
      );
    }
  }
);




export const editUser = createAsyncThunk(
  "users/edit",
  async ({ id, ...patch }, { rejectWithValue }) => {
    try {
      const data = await updateUser(id, patch);
      if ((!data.data && data.status !== 200) || !data) {
        throw new Error("No data returned from updateUser");
      }
      return data?.data ?? data; // handle wrappers
    } catch (e) {
      return rejectWithValue(e.message || "Failed to update user");
    }
  }
);




// DELETE
export const removeUser = createAsyncThunk(
  "users/remove",
  async (user_id, { rejectWithValue }) => {
    try {
      await deleteUser({ user_id, type: "SOFT" });
      return user_id;
    } catch (e) {
      return rejectWithValue(e.message || "Failed to delete user");
    }
  }
);

/* ===================== SLICE ===================== */

const slice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: null,
    query: "",
    page: 1,
    total: 0,
    totalPages: 1,
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- FETCH ---------- */
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;

        const data = a.payload?.data;
        s.items = Array.isArray(data?.items) ? data.items : [];
        s.page = data?.page ?? 1;
        s.total = data?.total ?? 0;
        s.totalPages = data?.total_pages ?? 1;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ---------- ADD ---------- */
      .addCase(addUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(addUser.fulfilled, (s, a) => {
        s.loading = false;
        // nothing to push — backend didn’t return user
      })


      .addCase(addUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ---------- EDIT ---------- */
      .addCase(editUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(editUser.fulfilled, (s, a) => {
        s.loading = false;
        const updated = a.payload;

        if (!updated?.id) return;

        const idx = s.items.findIndex((u) => u.id === updated.id);
        if (idx !== -1) {
          s.items[idx] = updated;
        }
      })
      .addCase(editUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ---------- DELETE ---------- */
      .addCase(removeUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(removeUser.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter((u) => u.id !== a.payload);
      })
      .addCase(removeUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { setQuery } = slice.actions;
export default slice.reducer;
