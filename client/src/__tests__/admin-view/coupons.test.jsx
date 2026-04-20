import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import AdminCoupons from "@/pages/admin-view/coupons";

const mockReducer = {
  adminCoupon: () => ({
    isLoading: false,
    couponList: [
      {
        id: "1",
        code: "SAVE10",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 50,
      },
      {
        id: "2",
        code: "MINUS5",
        discountType: "fixed",
        discountValue: 5,
        minOrderAmount: 20,
      },
    ],
  }),
};

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: mockReducer,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("AdminCoupons Component", () => {
  test("renders add new coupon button", () => {
    renderWithProviders(<AdminCoupons />);
    expect(screen.getByText(/Add New Coupon/i)).toBeInTheDocument();
  });

  test("renders coupon list from redux store", () => {
    renderWithProviders(<AdminCoupons />);
    
    expect(screen.getByText("SAVE10")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    
    expect(screen.getByText("MINUS5")).toBeInTheDocument();
    expect(screen.getByText("$5")).toBeInTheDocument();
  });
});
