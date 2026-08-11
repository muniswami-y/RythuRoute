const pool = require('../config/database');

class Address {
  static async create(addressData) {
    const { customer_id, recipient_name, phone, address, city, state, pincode, latitude, longitude } = addressData;
    
    const [result] = await pool.execute(
      `INSERT INTO addresses 
       (customer_id, recipient_name, phone, address, city, state, pincode, latitude, longitude) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, recipient_name, phone, address, city, state, pincode, latitude || null, longitude || null]
    );
    
    return result.insertId;
  }

  static async findByCustomer(customerId) {
    const [rows] = await pool.execute(
      `SELECT * FROM addresses WHERE customer_id = ? ORDER BY created_at DESC`,
      [customerId]
    );
    return rows;
  }

  static async findByIdAndCustomer(id, customerId) {
    const [rows] = await pool.execute(
      `SELECT * FROM addresses WHERE id = ? AND customer_id = ?`,
      [id, customerId]
    );
    return rows[0];
  }

  static async delete(id, customerId) {
    const [result] = await pool.execute(
      `DELETE FROM addresses WHERE id = ? AND customer_id = ?`,
      [id, customerId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Address;
