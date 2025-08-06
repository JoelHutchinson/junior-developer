import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../app/page";
import { fetchData } from "../utils/data";
import { mockEnrichedData } from "../utils/mocks";

// Mock the fetch function
global.fetch = jest.fn();

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the main page with title and logo", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEnrichedData],
    });

    render(await Home());

    expect(screen.getByText("Citizens Advice SORT")).toBeInTheDocument();
    expect(screen.getByText("Junior Developer Practical")).toBeInTheDocument();
    expect(screen.getByAltText("Citizens Advice SORT")).toBeInTheDocument();
  });

  it("groups and displays content by category", async () => {
    const mockData = [
      { ...mockEnrichedData, category: "category1" },
      { ...mockEnrichedData, id: "test-id-2", category: "category2" },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(await Home());

    await waitFor(() => {
      expect(screen.getByText("Category1")).toBeInTheDocument();
      expect(screen.getByText("Category2")).toBeInTheDocument();
    });
  });
});

describe("Data Fetching", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches data successfully", async () => {
    const mockResponse = [mockEnrichedData];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchData();

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/data"), {
      cache: "no-store",
    });
  });

  it("handles fetch errors gracefully", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchData();

    expect(result).toBeNull();
  });

  it("handles non-ok response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Not found" }),
    });

    const result = await fetchData();

    expect(result).toBeNull();
  });
});
