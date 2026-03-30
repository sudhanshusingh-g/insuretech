const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const resolveAssetUrl = (assetPath) => {
  if (!assetPath) return "";
  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }
  if (!SERVER_BASE_URL) {
    throw new Error("REACT_APP_SERVER_BASE_URL is not configured.");
  }
  return `${SERVER_BASE_URL}${assetPath}`;
};

export { API_BASE_URL, SERVER_BASE_URL, resolveAssetUrl };
