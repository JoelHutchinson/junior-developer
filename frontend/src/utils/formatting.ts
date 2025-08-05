export const formatCategory = (category: string) => {
  const [first, ...rest] = category.split("_");
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ");
};
