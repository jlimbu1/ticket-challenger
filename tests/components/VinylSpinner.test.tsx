import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import VinylSpinner from "@/components/VinylSpinner";

describe("VinylSpinner", () => {
  it("renders with default props", () => {
    render(<VinylSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading...");
  });

  it("renders with custom label", () => {
    render(<VinylSpinner label="Fetching records..." />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Fetching records...");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<VinylSpinner size="sm" />);
    const spinner = screen.getByRole("status");
    const vinyl = spinner.firstChild as HTMLElement;
    expect(vinyl.className).toContain("h-12");
    expect(vinyl.className).toContain("w-12");

    rerender(<VinylSpinner size="md" />);
    expect(vinyl.className).toContain("h-20");
    expect(vinyl.className).toContain("w-20");

    rerender(<VinylSpinner size="lg" />);
    expect(vinyl.className).toContain("h-32");
    expect(vinyl.className).toContain("w-32");
  });

  it("applies custom className", () => {
    render(<VinylSpinner className="my-custom-class" />);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("my-custom-class");
  });

  it("renders vinyl grooves and label", () => {
    render(<VinylSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    const vinyl = spinner.firstChild as HTMLElement;
    expect(vinyl).toBeInTheDocument();
    const grooves = vinyl.querySelectorAll("[class*='border-gothic-700']");
    expect(grooves.length).toBeGreaterThanOrEqual(4);
  });
});