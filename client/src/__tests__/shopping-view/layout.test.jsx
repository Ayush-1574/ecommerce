import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ShoppingLayout from "@/components/shopping-view/layout.jsx";

import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: () => ({ user: { name: "Test User" }, isAuthenticated: true }),
    shopCart: () => ({ cartItems: { items: [] } })
  }
});

test("renders layout with header and outlet content", () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/shop/home"]}>
        <Routes>
          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="home" element={<div>Test Child</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Test Child")).toBeInTheDocument();
});