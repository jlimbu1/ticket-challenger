import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GothicEmptyState from "@/components/GothicEmptyState";

describe("GothicEmptyState", () => {
  it("renders with default props", () => {
    render(<GothicEmptyState />);
    const container = screen.getByRole("status");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-label", "Empty state");
  });

  it("renders custom title", () => {
    render(<GothicEmptyState title="No Records Found" />);
    expect(screen.getByText("No Records Found")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<GothicEmptyState message="The collection is empty." />);
    expect(screen.getByText("The collection is empty.")).toBeInTheDocument();
  });

  it("renders a random default message when no message is provided", () => {
    render(<GothicEmptyState />);
    const defaultMessages = [
      "The void stares back, empty and waiting.",
      "No relics found in this chamber.",
      "The collection lies dormant, awaiting your touch.",
      "Silence echoes through these empty halls.",
      "Not a single artifact remains in this exhibit.",
    ];
    const text = screen.getByRole("status").textContent;
    const hasDefaultMessage = defaultMessages.some((msg) => text?.includes(msg));
    expect(hasDefaultMessage).toBe(true);
  });

  it("renders children", () => {
    render(
      <GothicEmptyState>
        <button>Retry</button>
      </GothicEmptyState>
    );
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<GothicEmptyState className="my-custom-class" />);
    const container = screen.getByRole("status");
    expect(container.className).toContain("my-custom-class");
  });

  it("renders decorative skull element", () => {
    render(<GothicEmptyState />);
    const skull = document.querySelector('[aria-hidden="true"]');
    expect(skull).toBeInTheDocument();
    expect(skull?.innerHTML).toContain("&#9760;");
  });

  it("renders decorative rose element", () => {
    render(<GothicEmptyState />);
    const rose = document.querySelectorAll('[aria-hidden="true"]');
    expect(rose.length).toBeGreaterThanOrEqual(1);
    const roseElement = rose[0]?.querySelector("span");
    expect(roseElement?.innerHTML).toContain("&#127800;");
  });
});