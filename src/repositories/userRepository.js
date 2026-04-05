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
    const { username, passwordHash, role, kitchen_id, full_name, title } = user;
    const [result] = await db.execute(
      'INSERT INTO users (username, full_name, title, password_hash, role, kitchen_id) VALUES (?, ?, ?, ?, ?, ?)',
      [username, full_name || null, title || null, passwordHash, role, kitchen_id || null]
    );
    return result.insertId;
  }

  async findAll() {
    const [rows] = await db.execute(`
      SELECT u.id, u.username, u.full_name, u.title, u.role, u.kitchen_id, k.kitchen_name 
      FROM users u 
      LEFT JOIN kitchens k ON u.kitchen_id = k.id 
      ORDER BY u.created_at DESC
    `);
    return rows;
  }

  async update(id, userData) {
    const { kitchen_id, role, full_name, title } = userData;
    await db.execute(
      'UPDATE users SET kitchen_id = ?, role = ?, full_name = ?, title = ? WHERE id = ?',
      [kitchen_id || null, role, full_name || null, title || null, id]
    );
  }

  async delete(id) {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
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
