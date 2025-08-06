import { formatCategory } from "@/utils/formatting";

describe("Formatting Utils", () => {
  it("formats category names correctly", () => {
    expect(formatCategory("test_category")).toBe("Test category");
    expect(formatCategory("another_test")).toBe("Another test");
    expect(formatCategory("SINGLE")).toBe("Single");
  });

  it("handles empty and special characters", () => {
    expect(formatCategory("")).toBe("");
    expect(formatCategory("test-category")).toBe("Test-category");
  });
});
