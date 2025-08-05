export const fetchData = async () => {
  try {
    // No caching, as the data may change frequently. Change to 'force-cache' if caching is desired.
    const response = await fetch(`/${process.env.API_URL}/data`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};
