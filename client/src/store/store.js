import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./auth-slice"
import adminProductreducer from "./admin/product-slice"
import shopProductreducer from "./shop/product-slice"
const store = configureStore({
    reducer : {
        auth : authreducer,
        adminProducts : adminProductreducer,
        shopProducts : shopProductreducer
    }
})
export default store;