import { render, screen } from "@testing-library/react";
import Reference from "../components/Reference";
import { mockEnrichedSource } from "../utils/mocks";

describe("Reference Component", () => {
  it("renders reference with title and link", () => {
    render(<Reference source={mockEnrichedSource} number={1} />);

    expect(screen.getByText("Test Source")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });

  it("displays reference number", () => {
    render(<Reference source={mockEnrichedSource} number={1} />);

    expect(screen.getByText("1.")).toBeInTheDocument();
  });
});
