export const truncateText = (html: string, length: number) => {
  if (!html) return "";

  const strippedText = html.replace(/<[^>]+>/g, "").trim();
  return strippedText.length > length ? strippedText.slice(0, length) + "..." : strippedText;
};
