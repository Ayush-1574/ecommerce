import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    productList : [],

}

export const addNewProduct = createAsyncThunk("/products/addNewproduct" , async(formData) => {
    try {
        console.log(formData)
        const response = await axios.post("http://localhost:5000/api/v1/admin/products/add" , formData , {
            headers : {
                'content-type' : 'application/json'
            }
        })
       
        return response.data
    } catch (error) {
        console.error("Error details:", error.response?.data);
        return rejectWithValue(error.response?.data);
    }
})
export const fetchAllProduct = createAsyncThunk("/products/addNewproduct" , async() => {
    console.log("Rejected")
    const response = await axios.get("http://localhost:5000/api/v1/admin/products/get"  , {
        headers : {
            'content-type' : 'application/json'
        }
    })
   console.log("Rejected")
    return response.data
})
export const editProduct = createAsyncThunk("/products/editproduct" , async({id , ...formData}) => {
    const response = await axios.put(`http://localhost:5000/api/v1/admin/products/edit/${id}` , formData , {
        headers : {
            'content-type' : 'application/json'
        }
    })
   
    return response.data
})
export const deleteProduct = createAsyncThunk("/products/addNewproduct" , async(id) => {
    const response = await axios.post(`http://localhost:5000/api/v1/admin/products/delete/${id}` , {
    
    })
    
    return response.data
})
const AdminProductSlice = createSlice({
    name : 'adminProduct',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllProduct.pending , (state) => {
            state.isLoading = true;
        })
        .addCase(fetchAllProduct.fulfilled , (state , action) => {
            console.log(action.payload.data)
            state.isLoading = false;
            state.productList = action.payload.data
        })
        .addCase(fetchAllProduct.rejected , (state) => {
            state.isLoading = false;
            state.productList = [];
        })
        

    }
})

export default AdminProductSlice.reducer