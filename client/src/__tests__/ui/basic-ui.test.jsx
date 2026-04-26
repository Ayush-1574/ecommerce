import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

describe("UI Components", () => {
  describe("Button", () => {
    test("renders button with text", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    test("calls onClick handler", () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      fireEvent.click(screen.getByRole("button", { name: "Click me" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test("can be disabled", () => {
      render(<Button disabled>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeDisabled();
    });

    test("renders different variants", () => {
      const { container } = render(<Button variant="destructive">Delete</Button>);
      expect(container.firstChild).toHaveClass("bg-destructive");
    });
    
    test("renders different sizes", () => {
      const { container } = render(<Button size="sm">Small</Button>);
      expect(container.firstChild).toHaveClass("h-8");
    });
  });

  describe("Badge", () => {
    test("renders badge with text", () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText("New")).toBeInTheDocument();
    });

    test("renders different variants", () => {
      const { container } = render(<Badge variant="destructive">Alert</Badge>);
      expect(container.firstChild).toHaveClass("bg-destructive");
    });

    test("renders outline variant", () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>);
      expect(container.firstChild).toHaveClass("text-foreground");
    });
    
    test("renders secondary variant", () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>);
      expect(container.firstChild).toHaveClass("bg-secondary");
    });
  });

  describe("Input", () => {
    test("renders input field", () => {
      render(<Input placeholder="Enter name" />);
      expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    });

    test("allows typing", () => {
      render(<Input placeholder="Enter name" />);
      const input = screen.getByPlaceholderText("Enter name");
      fireEvent.change(input, { target: { value: "John" } });
      expect(input.value).toBe("John");
    });

    test("can be disabled", () => {
      render(<Input placeholder="Enter name" disabled />);
      expect(screen.getByPlaceholderText("Enter name")).toBeDisabled();
    });

    test("applies custom className", () => {
      const { container } = render(<Input className="custom-input" />);
      expect(container.firstChild).toHaveClass("custom-input");
    });
  });

  describe("Textarea", () => {
    test("renders textarea field", () => {
      render(<Textarea placeholder="Enter bio" />);
      expect(screen.getByPlaceholderText("Enter bio")).toBeInTheDocument();
    });

    test("allows typing", () => {
      render(<Textarea placeholder="Enter bio" />);
      const textarea = screen.getByPlaceholderText("Enter bio");
      fireEvent.change(textarea, { target: { value: "Hello world" } });
      expect(textarea.value).toBe("Hello world");
    });

    test("can be disabled", () => {
      render(<Textarea placeholder="Enter bio" disabled />);
      expect(screen.getByPlaceholderText("Enter bio")).toBeDisabled();
    });
  });

  describe("Label", () => {
    test("renders label with text", () => {
      render(<Label htmlFor="email">Email Address</Label>);
      expect(screen.getByText("Email Address")).toBeInTheDocument();
    });

    test("applies peer-disabled classes", () => {
      const { container } = render(<Label>Disabled Peer</Label>);
      expect(container.firstChild).toHaveClass("peer-disabled:cursor-not-allowed");
    });
  });

  describe("Separator", () => {
    test("renders horizontal separator by default", () => {
      render(<Separator data-testid="separator" />);
      const separator = screen.getByTestId("separator");
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    test("renders vertical separator", () => {
      render(<Separator orientation="vertical" data-testid="separator" />);
      const separator = screen.getByTestId("separator");
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });
  });

  describe("Skeleton", () => {
    test("renders skeleton with custom class", () => {
      const { container } = render(<Skeleton className="w-10 h-10" />);
      expect(container.firstChild).toHaveClass("w-10");
      expect(container.firstChild).toHaveClass("h-10");
      expect(container.firstChild).toHaveClass("animate-pulse");
    });
  });
});
