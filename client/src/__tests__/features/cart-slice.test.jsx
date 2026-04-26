import cartReducer, {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartQuantity,
} from "@/store/shop/cart-slice";
import { describe, test, expect } from "vitest";

describe("cartSlice Reducer", () => {
  const initialState = {
    cartItems: [],
    isLoading: false,
  };

  test("should return initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("addToCart extraReducers", () => {
    test("handles addToCart.pending", () => {
      const state = cartReducer(initialState, addToCart.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles addToCart.fulfilled", () => {
      const payload = { data: [{ productId: "1", quantity: 2 }] };
      const state = cartReducer({ ...initialState, isLoading: true }, addToCart.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual(payload.data);
    });

    test("handles addToCart.rejected", () => {
      const state = cartReducer({ ...initialState, isLoading: true }, addToCart.rejected());
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual([]);
    });
  });

  describe("fetchCartItems extraReducers", () => {
    test("handles fetchCartItems.pending", () => {
      const state = cartReducer(initialState, fetchCartItems.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles fetchCartItems.fulfilled", () => {
      const payload = { data: [{ productId: "1", quantity: 2 }] };
      const state = cartReducer({ ...initialState, isLoading: true }, fetchCartItems.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual(payload.data);
    });

    test("handles fetchCartItems.rejected", () => {
      const state = cartReducer({ ...initialState, isLoading: true }, fetchCartItems.rejected());
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual([]);
    });
  });

  describe("updateCartQuantity extraReducers", () => {
    test("handles updateCartQuantity.pending", () => {
      const state = cartReducer(initialState, updateCartQuantity.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles updateCartQuantity.fulfilled", () => {
      const payload = { data: [{ productId: "1", quantity: 3 }] };
      const state = cartReducer({ ...initialState, isLoading: true }, updateCartQuantity.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual(payload.data);
    });

    test("handles updateCartQuantity.rejected", () => {
      const state = cartReducer({ ...initialState, isLoading: true }, updateCartQuantity.rejected());
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual([]);
    });
  });

  describe("deleteCartItem extraReducers", () => {
    test("handles deleteCartItem.pending", () => {
      const state = cartReducer(initialState, deleteCartItem.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles deleteCartItem.fulfilled", () => {
      const payload = { data: [] };
      const state = cartReducer({ ...initialState, isLoading: true }, deleteCartItem.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual([]);
    });

    test("handles deleteCartItem.rejected", () => {
      const state = cartReducer({ ...initialState, isLoading: true }, deleteCartItem.rejected());
      expect(state.isLoading).toBe(false);
      expect(state.cartItems).toEqual([]);
    });
  });
});
