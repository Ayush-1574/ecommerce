import productsReducer, {
  fetchAllFilteredProducts,
  fetchProductDetails,
  setProductDetails,
} from "@/store/shop/products-slice";
import { describe, test, expect } from "vitest";

describe("productsSlice Reducer", () => {
  const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
  };

  test("should return initial state", () => {
    expect(productsReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should handle setProductDetails", () => {
    const stateWithDetails = {
      ...initialState,
      productDetails: { id: "1", title: "Product" },
    };
    const state = productsReducer(stateWithDetails, setProductDetails());
    expect(state.productDetails).toBeNull();
  });

  describe("fetchAllFilteredProducts extraReducers", () => {
    test("handles fetchAllFilteredProducts.pending", () => {
      const state = productsReducer(initialState, fetchAllFilteredProducts.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles fetchAllFilteredProducts.fulfilled", () => {
      const payload = { data: [{ id: "1", title: "Product 1" }] };
      const state = productsReducer(
        { ...initialState, isLoading: true },
        fetchAllFilteredProducts.fulfilled(payload)
      );
      expect(state.isLoading).toBe(false);
      expect(state.productList).toEqual([{ id: "1", title: "Product 1" }]);
    });

    test("handles fetchAllFilteredProducts.rejected", () => {
      const state = productsReducer(
        { ...initialState, isLoading: true },
        fetchAllFilteredProducts.rejected()
      );
      expect(state.isLoading).toBe(false);
      expect(state.productList).toEqual([]);
    });
  });

  describe("fetchProductDetails extraReducers", () => {
    test("handles fetchProductDetails.pending", () => {
      const state = productsReducer(initialState, fetchProductDetails.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles fetchProductDetails.fulfilled", () => {
      const payload = { data: { id: "1", title: "Product 1" } };
      const state = productsReducer(
        { ...initialState, isLoading: true },
        fetchProductDetails.fulfilled(payload)
      );
      expect(state.isLoading).toBe(false);
      expect(state.productDetails).toEqual({ id: "1", title: "Product 1" });
    });

    test("handles fetchProductDetails.rejected", () => {
      const state = productsReducer(
        { ...initialState, isLoading: true },
        fetchProductDetails.rejected()
      );
      expect(state.isLoading).toBe(false);
      expect(state.productDetails).toBeNull();
    });
  });
});
