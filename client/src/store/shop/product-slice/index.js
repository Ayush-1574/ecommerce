import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    productList : [],
    productDetail : null,

}

export const fetchAllFilteredProducts = createAsyncThunk("/products/addNewproduct" , async({filterParams , sortParams}) => {
    const query = new URLSearchParams({
        ...filterParams,
        sortBy : sortParams
    })
    const response = await axios.get(`http://localhost:5000/api/v1/shop/products/get?${query}`  , {
        headers : {
            'content-type' : 'application/json'
        }
    })
   
    
    return response.data
})

export const getProductDetails = createAsyncThunk("" , async (id) => {
    const response = await axios.get(`http://localhost:5000/api/v1/shop/products/get/${id}`)
    return response?.data
})


const ShopProductSlice = createSlice({
    name : 'ShopProduct',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllFilteredProducts.pending , (state) => {
            state.isLoading = true;
        })
        .addCase(fetchAllFilteredProducts.fulfilled , (state , action) => {
           
            state.isLoading = false;
            state.productList = action.payload.data
        })
        .addCase(fetchAllFilteredProducts.rejected , (state) => {
            state.isLoading = false;
            state.productList = [];
        })
        .addCase(getProductDetails.pending , (state) => {
            state.isLoading = true;
        })
        .addCase(fetchAllFilteredProducts.fulfilled , (state , action) => {
           
            state.isLoading = false;
            state.productDetail = action.payload.data
        })
        .addCase(fetchAllFilteredProducts.rejected , (state) => {
            state.isLoading = false;
            state.productDetail = null;
        })
        

    }
})

export default ShopProductSlice.reducer