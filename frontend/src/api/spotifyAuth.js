const API_URL = "http://localhost:3000";

export function startSpotifyConnect(userId) {
  const url = `${API_URL}/auth/spotify/start?userId=${encodeURIComponent(String(userId))}`;
  window.location.href = url;
}

export async function fetchSpotifyStatus(userId) {
  try {
    const response = await fetch(`${API_URL}/auth/spotify/status?userId=${encodeURIComponent(String(userId))}`);
    const data = await response.json();

    if (!response.ok) {
      return { connected: false, error: data.error || "Failed to fetch Spotify status" };
    }

    return {
      connected: Boolean(data.connected),
      expiresAt: data.expiresAt || null,
      updatedAt: data.updatedAt || null,
      error: null,
    };
  } catch {
    return { connected: false, error: "Network error" };
  }
}
