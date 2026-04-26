import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Address from "@/components/shopping-view/address";

// Mock the components used inside Address to focus on Address component logic
vi.mock("@/components/shopping-view/address-card", () => ({
  default: ({ addressInfo, handleEditAddress, handleDeleteAddress }) => (
    <div data-testid={`address-card-${addressInfo.id}`}>
      <span>{addressInfo.address}</span>
      <button onClick={() => handleEditAddress(addressInfo)}>Edit</button>
      <button onClick={() => handleDeleteAddress(addressInfo)}>Delete</button>
    </div>
  ),
}));

vi.mock("@/components/common/form", () => ({
  default: ({ buttonText, onSubmit, isBtnDisabled }) => (
    <form onSubmit={onSubmit} data-testid="common-form">
      <button type="submit" disabled={isBtnDisabled}>
        {buttonText}
      </button>
    </form>
  ),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

const mockReducer = {
  auth: () => ({
    user: { id: "user-1", userName: "John" },
  }),
  shopAddress: (state = { addressList: [] }, action) => {
    if (action.type === 'shopAddress/setList') {
      return { ...state, addressList: action.payload };
    }
    return state;
  },
};

const renderWithProviders = (ui, preloadedState) => {
  const store = configureStore({
    reducer: mockReducer,
    preloadedState,
  });

  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
};

// Mock Redux thunks
vi.mock("@/store/shop/address-slice", () => ({
  addNewAddress: vi.fn().mockResolvedValue({ payload: { success: true } }),
  deleteAddress: vi.fn().mockResolvedValue({ payload: { success: true } }),
  editaAddress: vi.fn().mockResolvedValue({ payload: { success: true } }),
  fetchAllAddresses: vi.fn().mockReturnValue({ type: 'shopAddress/noop' }),
}));

describe("Address Component", () => {
  test("renders add new address initially", () => {
    renderWithProviders(<Address setCurrentSelectedAddress={vi.fn()} />);

    expect(screen.getByText("Add New Address")).toBeInTheDocument();
    expect(screen.getByTestId("common-form")).toBeInTheDocument();
  });

  test("renders list of addresses from redux store", () => {
    const preloadedState = {
      shopAddress: {
        addressList: [
          { id: "1", address: "123 Main St", city: "NY", phone: "123", pincode: "123", notes: "" },
          { id: "2", address: "456 Oak St", city: "LA", phone: "456", pincode: "456", notes: "" },
        ]
      }
    };

    renderWithProviders(<Address setCurrentSelectedAddress={vi.fn()} />, preloadedState);

    expect(screen.getByTestId("address-card-1")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    
    expect(screen.getByTestId("address-card-2")).toBeInTheDocument();
    expect(screen.getByText("456 Oak St")).toBeInTheDocument();
  });

  test("handles edit address flow", async () => {
    const preloadedState = {
      shopAddress: {
        addressList: [
          { id: "1", address: "123 Main St", city: "NY", phone: "123", pincode: "123", notes: "none" },
        ]
      }
    };

    renderWithProviders(<Address setCurrentSelectedAddress={vi.fn()} />, preloadedState);

    // Click edit on the mocked AddressCard
    fireEvent.click(screen.getByText("Edit"));

    // The header should change to Edit Address
    expect(await screen.findByText("Edit Address")).toBeInTheDocument();
  });
});
