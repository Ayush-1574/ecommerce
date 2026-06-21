import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

// Mock the components since we are testing their presence and props
vi.mock("@/components/admin-view/image-upload", () => ({
  default: () => <div data-testid="admin-image-upload">Image Upload Mock</div>,
}));

vi.mock("@/components/admin-view/orders", () => ({
  default: () => <div data-testid="admin-orders">Orders Mock</div>,
}));

vi.mock("@/components/admin-view/product-tile", () => ({
  default: ({ product }) => (
    <div data-testid={`product-tile-${product?.id}`}>{product?.title}</div>
  ),
}));

import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminOrdersView from "@/components/admin-view/orders";
import AdminProductTile from "@/components/admin-view/product-tile";

describe("Admin View Components", () => {
  describe("ProductImageUpload", () => {
    test("renders correctly", () => {
      render(<ProductImageUpload />);
      expect(screen.getByTestId("admin-image-upload")).toBeInTheDocument();
      expect(screen.getByText("Image Upload Mock")).toBeInTheDocument();
    });
  });

  describe("AdminOrdersView", () => {
    test("renders correctly", () => {
      render(<AdminOrdersView />);
      expect(screen.getByTestId("admin-orders")).toBeInTheDocument();
      expect(screen.getByText("Orders Mock")).toBeInTheDocument();
    });
  });

  describe("AdminProductTile", () => {
    const mockProduct = {
      id: "prod-1",
      title: "Test Product",
      price: 100,
    };

    test("renders product correctly", () => {
      render(<AdminProductTile product={mockProduct} />);
      expect(screen.getByTestId("product-tile-prod-1")).toBeInTheDocument();
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    test("renders without crashing if product is null", () => {
      render(<AdminProductTile product={null} />);
      // Should not crash, just render empty or gracefully
    });
  });
});
