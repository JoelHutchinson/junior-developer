import { EnrichedData } from "./types";

export const fetchData = async (): Promise<EnrichedData[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/data`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }

    return response.json() as Promise<EnrichedData[]>;
  } catch (error) {
    throw new Error(
      `Error fetching data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
