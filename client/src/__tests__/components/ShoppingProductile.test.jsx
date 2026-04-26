import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

// Mock config to ensure categories and brands map correctly
vi.mock("@/config", () => ({
  brandOptionsMap: {
    nike: "Nike",
    adidas: "Adidas",
  },
  categoryOptionsMap: {
    men: "Men",
    women: "Women",
  },
}));

import ShoppingProductTile from "@/components/shopping-view/ShoppingProductile";

describe("ShoppingProductTile Component", () => {
  const mockProduct = {
    id: "prod-1",
    title: "Awesome Sneaker",
    image: "https://example.com/sneaker.jpg",
    category: "men",
    brand: "nike",
    price: 100,
    salePrice: 80,
    totalStock: 50,
  };

  test("renders product details correctly", () => {
    render(<ShoppingProductTile product={mockProduct} />);

    // Check title
    expect(screen.getByText("Awesome Sneaker")).toBeInTheDocument();
    
    // Check category and brand
    expect(screen.getByText("Men")).toBeInTheDocument();
    expect(screen.getByText("Nike")).toBeInTheDocument();

    // Check price and sale price
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("$80")).toBeInTheDocument();
    
    // Check discount badge (100 - 80) / 100 * 100 = 20%
    expect(screen.getByText("-20%")).toBeInTheDocument();
  });

  test("handles product detail click", () => {
    const handleGetProductDetails = vi.fn();
    render(
      <ShoppingProductTile 
        product={mockProduct} 
        handleGetProductDetails={handleGetProductDetails} 
      />
    );

    // Click the title
    fireEvent.click(screen.getByText("Awesome Sneaker"));
    expect(handleGetProductDetails).toHaveBeenCalledWith("prod-1");
  });

  test("handles add to cart click", () => {
    const handleAddtoCart = vi.fn();
    render(
      <ShoppingProductTile 
        product={mockProduct} 
        handleAddtoCart={handleAddtoCart} 
      />
    );

    // Click Add to Cart button
    fireEvent.click(screen.getByText(/Add to Cart/i));
    expect(handleAddtoCart).toHaveBeenCalledWith("prod-1", 50);
  });

  test("renders Out of Stock when totalStock is 0", () => {
    const outOfStockProduct = { ...mockProduct, totalStock: 0 };
    render(<ShoppingProductTile product={outOfStockProduct} />);

    expect(screen.getByText("Sold Out")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock")).toBeDisabled();
  });

  test("renders Low Stock badge when totalStock is less than 10", () => {
    const lowStockProduct = { ...mockProduct, totalStock: 5 };
    render(<ShoppingProductTile product={lowStockProduct} />);

    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });
});
