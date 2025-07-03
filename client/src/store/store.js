import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./auth-slice"
import adminProductreducer from "./admin/product-slice"
const store = configureStore({
    reducer : {
        auth : authreducer,
        adminProducts : adminProductreducer,
    }
})
export default store;