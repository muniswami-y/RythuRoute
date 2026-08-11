const pool = require('../config/database');

class User {
  static async create(userData) {
    const { name, email, phone, password, role, approval_status } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, phone, password, role, approval_status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, password, role || 'customer', approval_status || 'approved']
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, approval_status, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updateApprovalStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE users SET approval_status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
