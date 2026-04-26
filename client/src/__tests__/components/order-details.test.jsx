import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ShoppingOrderDetailsView from "@/components/shopping-view/order-details";
import { Dialog } from "@/components/ui/dialog";

const mockReducer = {
  auth: () => ({
    user: {
      id: "user-1",
      userName: "John Doe",
      email: "john@example.com",
    },
  }),
};

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: mockReducer,
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

describe("ShoppingOrderDetailsView Component", () => {
  const mockOrderDetails = {
    id: "order-123",
    orderDate: "2023-10-27T10:00:00Z",
    totalAmount: "150.50",
    paymentMethod: "paypal",
    paymentStatus: "paid",
    orderStatus: "confirmed",
    cartItems: [
      { title: "Product A", quantity: 2, price: "50.00" },
      { title: "Product B", quantity: 1, price: "50.50" },
    ],
    addressInfo: {
      address: "123 Main St",
      city: "New York",
      pincode: "10001",
      phone: "1234567890",
      notes: "Leave at door",
    },
  };

  test("renders order basic details correctly", () => {
    renderWithProviders(
      <Dialog open={true}>
        <ShoppingOrderDetailsView orderDetails={mockOrderDetails} />
      </Dialog>
    );

    expect(screen.getByText("order-123")).toBeInTheDocument();
    expect(screen.getByText("2023-10-27")).toBeInTheDocument();
    expect(screen.getByText("$150.50")).toBeInTheDocument();
    expect(screen.getByText("paypal")).toBeInTheDocument();
    expect(screen.getByText("paid")).toBeInTheDocument();
    expect(screen.getByText("confirmed")).toBeInTheDocument();
  });

  test("renders cart items correctly", () => {
    renderWithProviders(
      <Dialog open={true}>
        <ShoppingOrderDetailsView orderDetails={mockOrderDetails} />
      </Dialog>
    );

    expect(screen.getByText("Title: Product A")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText("Price: $50.00")).toBeInTheDocument();

    expect(screen.getByText("Title: Product B")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 1")).toBeInTheDocument();
    expect(screen.getByText("Price: $50.50")).toBeInTheDocument();
  });

  test("renders shipping info and user details correctly", () => {
    renderWithProviders(
      <Dialog open={true}>
        <ShoppingOrderDetailsView orderDetails={mockOrderDetails} />
      </Dialog>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("10001")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Leave at door")).toBeInTheDocument();
  });
});
