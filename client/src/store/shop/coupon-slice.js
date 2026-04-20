import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  appliedCoupon: null,
};

export const applyCoupon = createAsyncThunk(
  "/coupon/applyCoupon",
  async ({ code, cartTotalAmount }, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        "http://localhost:5000/api/shop/coupons/apply",
        { code, cartTotalAmount },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Error applying coupon" });
    }
  }
);

const shopCouponSlice = createSlice({
  name: "shopCoupon",
  initialState,
  reducers: {
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appliedCoupon = action.payload.data;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.appliedCoupon = null;
      });
  },
});

export const { clearAppliedCoupon } = shopCouponSlice.actions;
export default shopCouponSlice.reducer;
