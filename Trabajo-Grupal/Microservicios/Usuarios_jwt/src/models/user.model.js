const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  static async create(userData) {
    const { email, password, full_name, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, full_name, role]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  static async updateRole(id, role) {
    const [result] = await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );
    return result.affectedRows;
  }

  static async deactivate(id) {
    const [result] = await pool.execute(
      'UPDATE users SET is_active = FALSE WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserModel;