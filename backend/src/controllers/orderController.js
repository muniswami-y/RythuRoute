const Order = require('../models/Order');
const { success, error } = require('../utils/response');

exports.createOrder = async (req, res, next) => {
  try {
    const { address_id, items } = req.body;
    
    if (!address_id || !items || !Array.isArray(items) || items.length === 0) {
      return error(res, 'Address and items are required to create an order', 400);
    }

    const orderData = {
      customer_id: req.user.id,
      address_id
    };

    const orderResult = await Order.createOrder(orderData, items);

    return success(res, orderResult, 'Order created successfully', 201);
  } catch (err) {
    if (err.message.includes('Insufficient stock') || err.message.includes('not found')) {
      return error(res, err.message, 400);
    }
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByCustomer(req.user.id);
    return success(res, orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndCustomer(req.params.id, req.user.id);
    if (!order) return error(res, 'Order not found or access denied', 404);

    const items = await Order.getOrderItems(order.id);
    order.items = items;

    return success(res, order);
  } catch (err) {
    next(err);
  }
};

exports.getFarmerOrders = async (req, res, next) => {
  try {
    const orders = await Order.findForFarmer(req.user.id);
    return success(res, orders);
  } catch (err) {
    next(err);
  }
};
