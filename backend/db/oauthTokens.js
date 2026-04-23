import pool from "./pool.js";

export async function ensureOAuthTokenTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_oauth_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      provider VARCHAR(32) NOT NULL,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      token_type VARCHAR(32),
      scope TEXT,
      expires_at DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_provider (user_id, provider),
      INDEX idx_user_provider (user_id, provider)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export async function upsertSpotifyToken({
  userId,
  accessToken,
  refreshToken,
  tokenType,
  scope,
  expiresAt,
}) {
  await ensureOAuthTokenTable();

  await pool.query(
    `
      INSERT INTO user_oauth_tokens
        (user_id, provider, access_token, refresh_token, token_type, scope, expires_at)
      VALUES (?, 'spotify', ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        access_token = VALUES(access_token),
        refresh_token = VALUES(refresh_token),
        token_type = VALUES(token_type),
        scope = VALUES(scope),
        expires_at = VALUES(expires_at)
    `,
    [userId, accessToken, refreshToken, tokenType, scope, expiresAt]
  );
}

export async function getSpotifyConnectionStatus(userId) {
  await ensureOAuthTokenTable();

  const [rows] = await pool.query(
    `
      SELECT provider, expires_at, updated_at
      FROM user_oauth_tokens
      WHERE user_id = ? AND provider = 'spotify'
      LIMIT 1
    `,
    [userId]
  );

  if (rows.length === 0) {
    return { connected: false };
  }

  const token = rows[0];
  return {
    connected: true,
    provider: token.provider,
    expiresAt: token.expires_at,
    updatedAt: token.updated_at,
  };
}
