export type EnrichedSource = {
  id: string;
  title: string;
  source: string;
  favicon_url: string;
  is_cited: boolean;
};

export type EnrichedData = {
  id: string;
  category: string;
  content: string;
  sources: EnrichedSource[];
  cited_count: number;
};