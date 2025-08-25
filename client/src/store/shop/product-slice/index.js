import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetail: null,
};

// Fetch all products with filters + sorting
export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const response = await axios.get(
      `http://localhost:5000/api/v1/shop/products/get?${query}`,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    return response.data;
  }
);

// Fetch single product details by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/v1/shop/products/get/${id}`
    );
    return response?.data;
  }
);

const ShopProductSlice = createSlice({
  name: "ShopProduct",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 For all products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // 🔹 For single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetail = null;
      });
  },
});

export const { setProductDetails } = ShopProductSlice.actions;
export default ShopProductSlice.reducer;
