import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  couponList: [],
};

export const addNewCoupon = createAsyncThunk(
  "/coupon/addNewCoupon",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/coupons/add",
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
      "http://localhost:5000/api/admin/coupons/get"
    );
    return result?.data;
  }
);

export const editCoupon = createAsyncThunk(
  "/coupon/editCoupon",
  async ({ id, formData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/coupons/edit/${id}`,
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
      `http://localhost:5000/api/admin/coupons/delete/${id}`
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
