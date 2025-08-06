import { EnrichedData, EnrichedSource } from "@/utils/types";

export const mockEnrichedData: EnrichedData = {
  id: "test-id-1",
  category: "test_category",
  content: "This is test content with <ref>ref1</ref> reference.",
  sources: [
    {
      id: "ref1",
      title: "Test Source",
      source: "https://example.com",
      favicon_url:
        "https://www.google.com/s2/favicons?sz=16&domain=example.com",
      is_cited: true,
    },
  ],
};

export const mockEnrichedSource: EnrichedSource = {
  id: "ref1",
  title: "Test Source",
  source: "https://example.com",
  favicon_url: "https://www.google.com/s2/favicons?sz=16&domain=example.com",
  is_cited: true,
};
