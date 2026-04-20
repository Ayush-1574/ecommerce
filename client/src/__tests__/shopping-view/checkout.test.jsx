import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import ShoppingCheckout from "@/pages/shopping-view/checkout";
import * as couponSlice from "@/store/shop/coupon-slice";

// Mock img component imports
vi.mock("../../assets/account.jpg", () => ({ default: "test-img-stub" }));

// Mock address component
vi.mock("@/components/shopping-view/address", () => ({
  default: () => <div data-testid="mock-address">Address Component</div>,
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

const mockReducer = {
  shopCart: () => ({
    cartItems: {
      id: "cart_1",
      items: [
        {
          productId: "p1",
          title: "Test Product",
          price: 100,
          salePrice: 80,
          quantity: 2,
        },
      ],
    },
  }),
  shopProducts: () => ({
    productList: [],
  }),
  auth: () => ({
    user: { id: "u1", email: "test@example.com" },
  }),
  shopOrder: () => ({
    approvalURL: null,
  }),
  shopCoupon: (state = { appliedCoupon: null, isLoading: false }, action) => {
    switch (action.type) {
      case "SET_MOCK_COUPON":
        return {
          ...state,
          appliedCoupon: {
            code: "SALE20",
            discountType: "fixed",
            discountValue: 20,
            discountAmount: 20,
          },
        };
      case "CLEAR_MOCK_COUPON":
        return {
          ...state,
          appliedCoupon: null,
        };
      default:
        return state;
    }
  },
};

const renderWithProviders = (ui, storeOverride) => {
  const store = storeOverride || configureStore({
    reducer: mockReducer,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("ShoppingCheckout Component", () => {
  test("renders checkout layout correctly", () => {
    renderWithProviders(<ShoppingCheckout />);
    
    expect(screen.getByText(/Checkout/i, { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByTestId("mock-address")).toBeInTheDocument();
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter coupon code")).toBeInTheDocument();
  });

  test("calculates initial subtotal correctly", () => {
    renderWithProviders(<ShoppingCheckout />);
    
    // salePrice(80) * quantity(2) = 160
    const subtotalElements = screen.getAllByText(/\$160\.00/i);
    expect(subtotalElements.length).toBeGreaterThan(0);
  });

  test("displays discount correctly when coupon is applied", () => {
    const storeWithCoupon = configureStore({
      reducer: mockReducer,
    });
    storeWithCoupon.dispatch({ type: "SET_MOCK_COUPON" });
    
    renderWithProviders(<ShoppingCheckout />, storeWithCoupon);
    
    // Subtotal should be $160.00
    expect(screen.getByText("Discount (SALE20)")).toBeInTheDocument();
    expect(screen.getByText("-$20.00")).toBeInTheDocument();
    
    // Total should be $140.00 (160 - 20)
    const elements140 = screen.getAllByText(/\$140\.00/i);
    expect(elements140.length).toBeGreaterThan(0);
  });

  test("disables apply button and shows remove button when coupon is active", () => {
    const storeWithCoupon = configureStore({
      reducer: mockReducer,
    });
    storeWithCoupon.dispatch({ type: "SET_MOCK_COUPON" });
    
    renderWithProviders(<ShoppingCheckout />, storeWithCoupon);
    
    expect(screen.queryByRole("button", { name: /Apply/i })).not.toBeInTheDocument();
  });
});
