import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/admin-view/Header";

const store = configureStore({
  reducer: {
    auth: () => ({ user: { name: "Admin Test" } })
  }
});

test("renders header component", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  );
  
  // adjust based on actual header content
  const button = screen.getByRole("button", { name: /toggle/i, hidden: true });
  // The header usually has a menu button, etc. 
  expect(button).toBeInTheDocument();
});