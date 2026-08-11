const User = require('../models/User');
const { success, error } = require('../utils/response');
const pool = require('../config/database');

exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total Revenue from paid orders
    const [revRows] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE payment_status = 'paid'`
    );
    const totalRevenue = revRows[0]?.total_revenue || 0;

    // 2. Counts
    const [orderCountRows] = await pool.execute(`SELECT COUNT(*) as count FROM orders`);
    const totalOrders = orderCountRows[0]?.count || 0;

    const [userCountRows] = await pool.execute(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role`
    );
    
    let totalCustomers = 0;
    let totalFarmers = 0;
    let totalDrivers = 0;

    userCountRows.forEach(row => {
      if (row.role === 'customer') totalCustomers = row.count;
      else if (row.role === 'farmer') totalFarmers = row.count;
      else if (row.role === 'delivery_partner' || row.role === 'driver') totalDrivers += row.count;
    });

    const [prodCountRows] = await pool.execute(
      `SELECT COUNT(*) as count FROM products WHERE status = 'active'`
    );
    const totalProducts = prodCountRows[0]?.count || 0;

    const [pendingFarmerRows] = await pool.execute(
      `SELECT COUNT(*) as count FROM users WHERE role = 'farmer' AND approval_status = 'pending'`
    );
    const pendingFarmers = pendingFarmerRows[0]?.count || 0;

    // 3. Recent Orders
    const [recentOrders] = await pool.execute(
      `SELECT o.id, o.tracking_id, o.total_amount, o.status, o.payment_status, o.created_at,
              u.name as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM orders o 
       LEFT JOIN users u ON o.customer_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 8`
    );

    return success(res, {
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      total_orders: totalOrders,
      total_customers: totalCustomers,
      total_farmers: totalFarmers,
      total_drivers: totalDrivers,
      total_products: totalProducts,
      pending_farmers: pendingFarmers,
      recent_orders: recentOrders
    });
  } catch (err) {
    next(err);
  }
};

exports.getFarmers = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, email, phone, approval_status, created_at 
       FROM users WHERE role = 'farmer' ORDER BY created_at DESC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
};

exports.updateFarmerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return error(res, 'Invalid status', 400);
    }

    const updated = await User.updateApprovalStatus(id, status);
    if (!updated) {
      return error(res, 'Farmer not found', 404);
    }

    return success(res, null, `Farmer status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              a.recipient_name, a.address, a.city, a.state, a.pincode
       FROM orders o
       LEFT JOIN users u ON o.customer_id = u.id
       LEFT JOIN addresses a ON o.address_id = a.id
       ORDER BY o.created_at DESC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let query = `SELECT id, name, email, phone, role, approval_status, created_at FROM users`;
    const params = [];
    if (role) {
      query += ` WHERE role = ?`;
      params.push(role);
    }
    query += ` ORDER BY created_at DESC`;
    const [rows] = await pool.execute(query, params);
    return success(res, rows);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, u.name as farmer_name, u.email as farmer_email
       FROM products p
       LEFT JOIN users u ON p.farmer_id = u.id
       ORDER BY p.created_at DESC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
};
