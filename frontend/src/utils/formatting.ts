export const formatContent = (raw: string) => {
  let refIndex = 1;

  return raw.replace(/\n/g, "<br />").replace(/<ref>(.*?)<\/ref>/g, () => {
    return `<sup>[${refIndex++}]</sup>`;
  });
};

export const formatCategory = (category: string) => {
  const [first, ...rest] = category.split("_");
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ");
};
