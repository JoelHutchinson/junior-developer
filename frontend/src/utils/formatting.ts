export const formatCategory = (category: string) => {
  const words = category
    .split("_")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    );
  return words.join(" ");
};
