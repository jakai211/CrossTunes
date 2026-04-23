const API_URL = "http://localhost:3000";

function toSourceParam(platforms) {
  if (!Array.isArray(platforms) || platforms.length === 0) {
    return "spotify,youtube,soundcloud";
  }

  const mapped = platforms.map((platform) => {
    if (platform === "Spotify") return "spotify";
    if (platform === "YouTube") return "youtube";
    if (platform === "SoundCloud") return "soundcloud";
    return "";
  });

  return mapped.filter(Boolean).join(",") || "spotify,youtube,soundcloud";
}

export async function searchSongs(query, platforms = [], limit = 8) {
  const sources = toSourceParam(platforms);
  const url = `${API_URL}/music/search?q=${encodeURIComponent(query)}&limit=${limit}&sources=${encodeURIComponent(sources)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return {
        songs: [],
        error: data.error || "Search failed",
        unavailableSources: data.unavailableSources || [],
      };
    }

    return {
      songs: data.songs || [],
      error: null,
      unavailableSources: data.unavailableSources || [],
    };
  } catch {
    return { songs: [], error: "Network error", unavailableSources: [] };
  }
}
