import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:5000/api/siteconfig";

const initialState = {
  isLoading: false,
  config: null,
  error: null,
};

export const fetchSiteConfig = createAsyncThunk(
  "siteconfig/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/public`);
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed");
    }
  }
);

export const fetchSiteConfigAdmin = createAsyncThunk(
  "siteconfig/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/`, { withCredentials: true });
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed");
    }
  }
);

export const updateSiteConfig = createAsyncThunk(
  "siteconfig/update",
  async ({ key, value }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE}/${key}`, { value }, { withCredentials: true });
      return { key, value };
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed");
    }
  }
);

export const resetSiteConfig = createAsyncThunk(
  "siteconfig/reset",
  async (key, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE}/${key}`, { withCredentials: true });
      return key;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed");
    }
  }
);

const siteconfigSlice = createSlice({
  name: "siteconfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteConfig.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload.data;
      })
      .addCase(fetchSiteConfig.rejected, (state) => { state.isLoading = false; })

      .addCase(fetchSiteConfigAdmin.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSiteConfigAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload.data;
      })
      .addCase(fetchSiteConfigAdmin.rejected, (state) => { state.isLoading = false; })

      .addCase(updateSiteConfig.fulfilled, (state, action) => {
        if (state.config) {
          state.config[action.payload.key] = action.payload.value;
        }
      })

      .addCase(resetSiteConfig.fulfilled, (state, action) => {
        // config will be re-fetched after reset
      });
  },
});

export default siteconfigSlice.reducer;
