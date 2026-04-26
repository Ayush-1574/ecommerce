import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import CommonForm from "@/components/common/form";

// Mocking UI components
vi.mock("@/components/ui/input", () => ({
  Input: ({ onChange, ...props }) => (
    <input data-testid="mock-input" onChange={onChange} {...props} />
  ),
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: ({ onChange, ...props }) => (
    <textarea data-testid="mock-textarea" onChange={onChange} {...props} />
  ),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, value }) => (
    <div data-testid="mock-select" data-value={value}>
      <select onChange={(e) => onValueChange(e.target.value)} value={value}>
        {/* We just simulate a basic select for testing the onChange handler */}
        <option value="">Select Option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
}));

describe("CommonForm Component", () => {
  const formControls = [
    {
      name: "username",
      label: "Username",
      placeholder: "Enter username",
      componentType: "input",
      type: "text",
    },
    {
      name: "role",
      label: "Role",
      placeholder: "Select role",
      componentType: "select",
      options: [
        { id: "option1", label: "Admin" },
        { id: "option2", label: "User" },
      ],
    },
    {
      name: "bio",
      label: "Bio",
      placeholder: "Enter bio",
      componentType: "textarea",
    },
  ];

  test("renders form controls correctly", () => {
    const formData = { username: "", role: "", bio: "" };
    render(
      <CommonForm
        formControls={formControls}
        formData={formData}
        setFormData={vi.fn()}
        buttonText="Save"
      />
    );

    // Check labels
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getAllByText("Role").length).toBeGreaterThan(0);
    expect(screen.getByText("Bio")).toBeInTheDocument();

    // Check components
    expect(screen.getByTestId("mock-input")).toBeInTheDocument();
    expect(screen.getByTestId("mock-select")).toBeInTheDocument();
    expect(screen.getByTestId("mock-textarea")).toBeInTheDocument();

    // Check button
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  test("calls setFormData on input change", () => {
    const formData = { username: "", role: "", bio: "" };
    const setFormData = vi.fn();

    render(
      <CommonForm
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
    );

    const input = screen.getByTestId("mock-input");
    fireEvent.change(input, { target: { value: "john_doe" } });

    expect(setFormData).toHaveBeenCalledWith({
      ...formData,
      username: "john_doe",
    });
  });

  test("calls onSubmit when form is submitted", () => {
    const formData = { username: "john", role: "option1", bio: "hello" };
    const onSubmit = vi.fn((e) => e.preventDefault());

    render(
      <CommonForm
        formControls={formControls}
        formData={formData}
        setFormData={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const button = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalled();
  });

  test("disables submit button when isBtnDisabled is true", () => {
    render(
      <CommonForm
        formControls={formControls}
        formData={{}}
        setFormData={vi.fn()}
        isBtnDisabled={true}
      />
    );

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();
  });
});
