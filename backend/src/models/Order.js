const pool = require('../config/database');

class Order {
  static async createOrder(orderData, orderItems) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Verify stock and calculate totals
      let subtotalAmount = 0;
      for (const item of orderItems) {
        const [products] = await connection.execute(
          'SELECT quantity_available, price, farmer_id FROM products WHERE id = ?',
          [item.product_id]
        );

        if (products.length === 0) {
          throw new Error(`Product ${item.product_id} not found`);
        }

        const product = products[0];
        
        if (product.quantity_available < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.product_id}`);
        }

        item.price = product.price; // Trust DB price
        item.farmer_id = product.farmer_id;
        item.subtotal = item.price * item.quantity;
        subtotalAmount += item.subtotal;

        // Decrement stock
        await connection.execute(
          'UPDATE products SET quantity_available = quantity_available - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Calculate taxes and fees
      const gstAmount = parseFloat((subtotalAmount * 0.05).toFixed(2));
      const transportCost = 50.00;
      const totalAmount = parseFloat((subtotalAmount + gstAmount + transportCost).toFixed(2));

      // 2. Create Order
      const trackingId = `RYR-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (customer_id, address_id, total_amount, tracking_id) VALUES (?, ?, ?, ?)`,
        [orderData.customer_id, orderData.address_id, totalAmount, trackingId]
      );
      
      const orderId = orderResult.insertId;

      // 3. Create Order Items
      for (const item of orderItems) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.farmer_id, item.quantity, item.price, item.subtotal]
        );
      }

      await connection.commit();
      
      return {
        orderId,
        trackingId,
        subtotalAmount,
        gstAmount,
        transportCost,
        totalAmount
      };

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async findByCustomer(customerId) {
    const [rows] = await pool.execute(
      `SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`,
      [customerId]
    );
    return rows;
  }

  static async findByIdAndCustomer(id, customerId) {
    const [rows] = await pool.execute(
      `SELECT * FROM orders WHERE id = ? AND customer_id = ?`,
      [id, customerId]
    );
    return rows[0];
  }

  static async findForFarmer(farmerId) {
    const [rows] = await pool.execute(
      `SELECT o.id as order_id, o.tracking_id, o.status as order_status, o.payment_status, o.created_at,
              oi.quantity, oi.price, oi.subtotal,
              p.name as product_name, p.image_url, p.unit,
              u.name as customer_name, u.phone as customer_phone,
              a.address, a.city, a.state, a.pincode
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       JOIN users u ON o.customer_id = u.id
       JOIN addresses a ON o.address_id = a.id
       WHERE oi.farmer_id = ? AND o.payment_status = 'paid'
       ORDER BY o.created_at DESC`,
      [farmerId]
    );
    return rows;
  }

  static async getOrderItems(orderId) {
    const [rows] = await pool.execute(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }

  static async updateStatus(orderId, newStatus) {
    // Basic status machine check could be implemented here
    const [result] = await pool.execute(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [newStatus, orderId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Order;
