const pool = require('../config/database');

class Product {
  static async create(productData) {
    const { farmer_id, name, description, category, price, unit, quantity_available, image_url } = productData;
    const [result] = await pool.execute(
      `INSERT INTO products 
      (farmer_id, name, description, category, price, unit, quantity_available, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [farmer_id, name, description, category, price, unit, quantity_available, image_url]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.name as farmer_name 
       FROM products p 
       JOIN users u ON p.farmer_id = u.id 
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAll(filters = {}, limit = 20, offset = 0) {
    let query = `
      SELECT p.*, u.name as farmer_name 
      FROM products p 
      JOIN users u ON p.farmer_id = u.id 
      WHERE p.status = 'active'
    `;
    const queryParams = [];

    if (filters.category) {
      query += ` AND p.category = ?`;
      queryParams.push(filters.category);
    }

    if (filters.search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // Default sorting
    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit) || 20, parseInt(offset) || 0);

    // Execute with prepared statements
    const [rows] = await pool.execute(query, queryParams);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM products p WHERE p.status = 'active'`;
    const countParams = [];
    if (filters.category) { countQuery += ` AND p.category = ?`; countParams.push(filters.category); }
    if (filters.search) { countQuery += ` AND (p.name LIKE ? OR p.description LIKE ?)`; countParams.push(`%${filters.search}%`, `%${filters.search}%`); }
    
    const [countRows] = await pool.execute(countQuery, countParams);
    
    return {
      products: rows,
      total: countRows[0].total
    };
  }

  static async findByFarmerId(farmerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC',
      [farmerId]
    );
    return rows;
  }

  static async update(id, farmerId, updateData) {
    const { name, description, category, price, unit, quantity_available, status } = updateData;
    const [result] = await pool.execute(
      `UPDATE products 
       SET name = ?, description = ?, category = ?, price = ?, unit = ?, quantity_available = ?, status = ?
       WHERE id = ? AND farmer_id = ?`,
      [name, description, category, price, unit, quantity_available, status, id, farmerId]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, farmerId) {
    // Soft delete
    const [result] = await pool.execute(
      `UPDATE products SET status = 'inactive' WHERE id = ? AND farmer_id = ?`,
      [id, farmerId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Product;
