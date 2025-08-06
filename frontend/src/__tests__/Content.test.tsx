import Content from "../components/Content";
import { render, screen } from "@testing-library/react";
import { mockEnrichedData } from "../utils/mocks";

describe("Content Component", () => {
  it("renders content with advice section", () => {
    render(<Content data={mockEnrichedData} />);

    expect(screen.getByText("Advice")).toBeInTheDocument();
    expect(
      screen.getByText(/This is test content with/, { exact: false })
    ).toBeInTheDocument();
  });

  it("renders references section", () => {
    render(<Content data={mockEnrichedData} />);

    expect(screen.getByText("References")).toBeInTheDocument();
  });

  it("displays all sources in references", () => {
    render(<Content data={mockEnrichedData} />);

    expect(screen.getByText("Test Source")).toBeInTheDocument();
  });

  it("handles content with HTML safely", () => {
    const dataWithHtml = {
      ...mockEnrichedData,
      content: "Content with <strong>bold</strong> text",
    };

    render(<Content data={dataWithHtml} />);

    expect(
      screen.getByText(/Content with/, { exact: false })
    ).toBeInTheDocument();
  });
});
