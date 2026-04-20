import { render, screen } from "@testing-library/react";
import ShoppingLayout from "./layout.jsx";

test("renders children inside layout", () => {
  render(
    <ShoppingLayout>
      <div>Test Child</div>
    </ShoppingLayout>
  );

  expect(screen.getByText("Test Child")).toBeInTheDocument();
});