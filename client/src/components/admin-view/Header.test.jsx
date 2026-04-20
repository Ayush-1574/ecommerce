import { render, screen } from "@testing-library/react";
import Header from "../components/admin-view/Header";

test("renders header component", () => {
  render(<Header />);
  
  // adjust based on actual header content
  const heading = screen.queryByRole("heading");
  expect(heading).toBeInTheDocument();
});