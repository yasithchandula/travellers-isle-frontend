export function buildImageUrl(path) {
  if (!path) return null;

  // already absolute
  if (path.startsWith("http")) return path;

  return `${import.meta.env.VITE_APP_BASE_URL}${path}`;
}
