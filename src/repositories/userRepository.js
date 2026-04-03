const db = require('../config/db');

class UserRepository {
  async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async create(user) {
    const { username, passwordHash, role } = user;
    const [result] = await db.execute(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, passwordHash, role]
    );
    return result.insertId;
  }

  async saveRefreshToken(userId, token, expiresAt) {
    await db.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );
  }

  async findRefreshToken(userId, token) {
    const [rows] = await db.execute(
      'SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ? AND expires_at > NOW()',
      [userId, token]
    );
    return rows[0];
  }

  async deleteRefreshToken(token) {
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  }
}

module.exports = new UserRepository();
