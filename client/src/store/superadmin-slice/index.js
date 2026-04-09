import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:5000/api/superadmin";

const initialState = {
  isLoading: false,
  users: [],
  stats: null,
  error: null,
};

export const fetchSuperadminStats = createAsyncThunk(
  "superadmin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/stats`, { withCredentials: true });
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "superadmin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/users`, { withCredentials: true });
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const createAdminUser = createAsyncThunk(
  "superadmin/createAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE}/admins`, formData, { withCredentials: true });
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed to create admin");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "superadmin/updateRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE}/users/${id}/role`, { role }, { withCredentials: true });
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed to update role");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "superadmin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE}/users/${id}`, { withCredentials: true });
      return { ...res.data, id };
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed to delete user");
    }
  }
);

const superadminSlice = createSlice({
  name: "superadmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchSuperadminStats.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSuperadminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchSuperadminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Users
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create admin
    builder
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload.data);
      });

    // Update role
    builder
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const idx = state.users.findIndex((u) => u.id === updated.id);
        if (idx !== -1) state.users[idx] = { ...state.users[idx], role: updated.role };
      });

    // Delete
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload.id);
      });
  },
});

export default superadminSlice.reducer;
