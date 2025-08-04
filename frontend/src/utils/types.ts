export type Source = {
  id: string;
  title: string;
  source: string;
  favicon?: string;
  cited?: boolean;
};

export type Data = {
  category: string;
  sources: Source[];
  content: string;
};
