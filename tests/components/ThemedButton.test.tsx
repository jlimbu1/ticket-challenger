import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ThemedButton from "@/components/ThemedButton";

describe("ThemedButton", () => {
  it("renders with default props", () => {
    render(<ThemedButton>Click me</ThemedButton>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("renders with primary variant by default", () => {
    render(<ThemedButton>Primary</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-crimson");
    expect(button.className).toContain("text-gothic-50");
  });

  it("renders with secondary variant", () => {
    render(<ThemedButton variant="secondary">Secondary</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-transparent");
    expect(button.className).toContain("text-gothic-200");
  });

  it("renders with danger variant", () => {
    render(<ThemedButton variant="danger">Danger</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-rose-dark");
    expect(button.className).toContain("text-gothic-50");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<ThemedButton size="sm">Small</ThemedButton>);
    let button = screen.getByRole("button");
    expect(button.className).toContain("px-3");
    expect(button.className).toContain("py-1.5");
    expect(button.className).toContain("text-sm");

    rerender(<ThemedButton size="md">Medium</ThemedButton>);
    button = screen.getByRole("button");
    expect(button.className).toContain("px-5");
    expect(button.className).toContain("py-2.5");
    expect(button.className).toContain("text-base");

    rerender(<ThemedButton size="lg">Large</ThemedButton>);
    button = screen.getByRole("button");
    expect(button.className).toContain("px-8");
    expect(button.className).toContain("py-3.5");
    expect(button.className).toContain("text-lg");
  });

  it("renders as disabled when disabled prop is true", () => {
    render(<ThemedButton disabled>Disabled</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders as disabled when loading prop is true", () => {
    render(<ThemedButton loading>Loading</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows loading text when loading is true", () => {
    render(<ThemedButton loading>Submit</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Submit");
  });

  it("applies custom className", () => {
    render(<ThemedButton className="my-custom-class">Custom</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("my-custom-class");
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<ThemedButton onClick={handleClick}>Click me</ThemedButton>);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ThemedButton disabled onClick={handleClick}>
        Click me
      </ThemedButton>
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ThemedButton loading onClick={handleClick}>
        Click me
      </ThemedButton>
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the button element", () => {
    const ref = vi.fn();
    render(<ThemedButton ref={ref}>Ref button</ThemedButton>);
    expect(ref).toHaveBeenCalled();
    const button = screen.getByRole("button");
    expect(ref).toHaveBeenCalledWith(button);
  });

  it("renders with focus-visible ring classes", () => {
    render(<ThemedButton>Focus</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("focus-visible:outline-none");
    expect(button.className).toContain("focus-visible:ring-2");
    expect(button.className).toContain("focus-visible:ring-crimson");
  });

  it("renders with font-serif class", () => {
    render(<ThemedButton>Serif</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("font-serif");
  });

  it("renders with transition classes", () => {
    render(<ThemedButton>Transition</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("transition-all");
    expect(button.className).toContain("duration-300");
    expect(button.className).toContain("ease-in-out");
  });

  it("renders with border class", () => {
    render(<ThemedButton>Border</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border");
  });

  it("renders with rounded-md class", () => {
    render(<ThemedButton>Rounded</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("rounded-md");
  });

  it("renders with inline-flex class", () => {
    render(<ThemedButton>Flex</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("inline-flex");
  });

  it("renders with items-center class", () => {
    render(<ThemedButton>Center</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("items-center");
  });

  it("renders with justify-center class", () => {
    render(<ThemedButton>Justify</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("justify-center");
  });

  it("renders with gap-2 class", () => {
    render(<ThemedButton>Gap</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("gap-2");
  });

  it("renders with font-semibold class", () => {
    render(<ThemedButton>Semibold</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("font-semibold");
  });

  it("renders with relative class", () => {
    render(<ThemedButton>Relative</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("relative");
  });

  it("renders with type button by default", () => {
    render(<ThemedButton>Type</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders with custom type", () => {
    render(<ThemedButton type="submit">Submit</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders with aria-disabled when loading", () => {
    render(<ThemedButton loading>Loading</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("renders with aria-disabled when disabled", () => {
    render(<ThemedButton disabled>Disabled</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("does not render with aria-disabled when not disabled or loading", () => {
    render(<ThemedButton>Normal</ThemedButton>);
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("aria-disabled");
  });
});