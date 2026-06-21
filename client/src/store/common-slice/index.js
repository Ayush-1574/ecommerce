import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig.js";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/common/feature/get`
    );
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/common/feature/add`,
      { image }
    );
    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/order/deleteFeatureImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/common/feature/delete/${id}`
      );
      return { ...response.data, id };
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Failed to delete");
    }
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.featureImageList.push(action.payload.data);
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.featureImageList = state.featureImageList.filter(
          (img) => img.id !== action.payload.id
        );
      });
  },
});

export default commonSlice.reducer;
