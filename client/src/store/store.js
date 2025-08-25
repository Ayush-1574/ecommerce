import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./auth-slice"
import adminProductreducer from "./admin/product-slice"
import shopProductreducer from "./shop/product-slice"
import shopCartSlice from "./shop/cart-slice"
import shopAddressSlice from "./shop/address-slice"
const store = configureStore({
    reducer : {
        auth : authreducer,
        adminProducts : adminProductreducer,
        shopProducts : shopProductreducer,
        shopCart : shopCartSlice,
        shopAddress : shopAddressSlice
    }
})
export default store;