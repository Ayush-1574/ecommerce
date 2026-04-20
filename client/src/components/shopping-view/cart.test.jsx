import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// 👉 adjust path if needed
import Cart from "./cart";

// 🔥 Mock reducer (since real store may be complex)
const mockReducer = {
  cart: () => ({
    cartItems: [
      {
        _id: "1",
        title: "T-Shirt",
        price: 500,
        quantity: 2,
      },
      {
        _id: "2",
        title: "Shoes",
        price: 1000,
        quantity: 1,
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

describe("Cart Component", () => {
  test("renders cart items from redux", () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText(/T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/Shoes/i)).toBeInTheDocument();
  });

  test("shows correct quantity", () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("calculates total price", () => {
    renderWithProviders(<Cart />);

    // 500*2 + 1000*1 = 2000
    expect(screen.getByText(/2000/)).toBeInTheDocument();
  });

  test("renders cart heading", () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText(/cart/i)).toBeInTheDocument();
  });
});