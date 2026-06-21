import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig.js";

const initialState = {
  isLoading: false,
  couponList: [],
};

export const addNewCoupon = createAsyncThunk(
  "/coupons/addNewCoupon",
  async (formData) => {
    const result = await axios.post(
      `${API_BASE_URL}/api/admin/coupons/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return result?.data;
  }
);

export const fetchAllCoupons = createAsyncThunk(
  "/coupon/fetchAllCoupons",
  async () => {
    const result = await axios.get(
      `${API_BASE_URL}/api/admin/coupons/get`,
      {
        withCredentials: true,
      }
    );
    return result?.data;
  }
);

export const editCoupon = createAsyncThunk(
  "/coupon/editCoupon",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${API_BASE_URL}/api/admin/coupons/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return result?.data;
  }
);

export const deleteCoupon = createAsyncThunk(
  "/coupon/deleteCoupon",
  async (id) => {
    const result = await axios.delete(
      `${API_BASE_URL}/api/admin/coupons/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    return result?.data;
  }
);

const adminCouponSlice = createSlice({
  name: "adminCoupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCoupons.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.couponList = action.payload.data;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.couponList = [];
      });
  },
});

export default adminCouponSlice.reducer;
