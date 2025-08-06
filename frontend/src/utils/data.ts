import { EnrichedData } from "./types";

export const fetchData = async (): Promise<EnrichedData[] | null> => {
  try {
    const response = await fetch(`${process.env.API_URL}/data`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }

    return response.json() as Promise<EnrichedData[]>;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};
