import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// 👉 adjust path if needed
import Cart from "@/components/shopping-view/cart-wrapper";
import { Sheet } from "@/components/ui/sheet";

// 🔥 Mock reducer (since real store may be complex)
const mockReducer = {
  shopCart: () => ({
    cartItems: {
      items: [
        {
          productId: "1",
          title: "T-Shirt",
          price: 500,
          quantity: 2,
        },
        {
          productId: "2",
          title: "Shoes",
          price: 1000,
          quantity: 1,
        },
      ]
    },
  }),
  shopProducts: () => ({
    productList: [],
  }),
  auth: () => ({
    user: { id: "u1" },
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
  const dummyCartItems = [
    { productId: "1", title: "T-Shirt", price: 500, quantity: 2 },
    { productId: "2", title: "Shoes", price: 1000, quantity: 1 }
  ];

  test("renders cart items from redux", () => {
    renderWithProviders(<Sheet><Cart cartItems={dummyCartItems} /></Sheet>);

    expect(screen.getByText(/T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/Shoes/i)).toBeInTheDocument();
  });

  test("shows correct quantity", () => {
    renderWithProviders(<Sheet><Cart cartItems={dummyCartItems} /></Sheet>);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("calculates total price", () => {
    renderWithProviders(<Sheet><Cart cartItems={dummyCartItems} /></Sheet>);

    // 500*2 + 1000*1 = 2000
    expect(screen.getByText(/2000/)).toBeInTheDocument();
  });

  test("renders cart heading", () => {
    renderWithProviders(<Sheet><Cart cartItems={dummyCartItems} /></Sheet>);

    expect(screen.getByText(/cart/i)).toBeInTheDocument();
  });
});