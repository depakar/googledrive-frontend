export const getFileIcon = (type) => {
  if (!type) return "📄";
  if (type.includes("pdf")) return "📕";
  if (type.includes("image")) return "🖼️";
  if (type.includes("zip")) return "🗜️";
  if (type.includes("video")) return "🎬";
  return "📄";
};
