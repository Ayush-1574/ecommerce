import adminProductsReducer, { fetchAllProducts } from "@/store/admin/products-slice";
import { describe, test, expect } from "vitest";

describe("adminProductsSlice Reducer", () => {
  const initialState = {
    isLoading: false,
    productList: [],
  };

  test("should return initial state", () => {
    expect(adminProductsReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("fetchAllProducts extraReducers", () => {
    test("handles fetchAllProducts.pending", () => {
      const state = adminProductsReducer(initialState, fetchAllProducts.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles fetchAllProducts.fulfilled", () => {
      const payload = { data: [{ id: "1", title: "Product 1" }] };
      const state = adminProductsReducer(
        { ...initialState, isLoading: true },
        fetchAllProducts.fulfilled(payload)
      );
      expect(state.isLoading).toBe(false);
      expect(state.productList).toEqual(payload.data);
    });

    test("handles fetchAllProducts.rejected", () => {
      const state = adminProductsReducer(
        { ...initialState, isLoading: true },
        fetchAllProducts.rejected()
      );
      expect(state.isLoading).toBe(false);
      expect(state.productList).toEqual([]);
    });
  });
});
