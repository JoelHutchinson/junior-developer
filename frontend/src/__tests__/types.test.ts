import { EnrichedData, EnrichedSource } from "@/utils/types";

describe("Type Definitions", () => {
  it("has correct EnrichedData structure", () => {
    const data: EnrichedData = {
      id: "test-id",
      category: "test",
      content: "test content",
      sources: [],
    };

    expect(data.id).toBe("test-id");
    expect(data.category).toBe("test");
    expect(data.content).toBe("test content");
    expect(Array.isArray(data.sources)).toBe(true);
  });

  it("has correct EnrichedSource structure", () => {
    const source: EnrichedSource = {
      id: "ref1",
      title: "Test Source",
      source: "https://example.com",
      favicon_url: "https://favicon.com",
      is_cited: true,
    };

    expect(source.id).toBe("ref1");
    expect(source.title).toBe("Test Source");
    expect(source.source).toBe("https://example.com");
    expect(source.favicon_url).toBe("https://favicon.com");
    expect(source.is_cited).toBe(true);
  });
});
