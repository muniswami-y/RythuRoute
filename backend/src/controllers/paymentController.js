const PaymentService = require('../services/paymentService');
const Order = require('../models/Order');
const { success, error } = require('../utils/response');

exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return error(res, 'order_id is required', 400);

    const order = await Order.findByIdAndCustomer(order_id, req.user.id);
    if (!order) return error(res, 'Order not found or unauthorized', 404);
    
    if (order.payment_status === 'paid') {
      return error(res, 'Order is already paid', 400);
    }

    const rzpOrder = await PaymentService.createRazorpayOrder(order.id, order.total_amount);
    
    return success(res, {
      ...rzpOrder,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id'
    }, 'Razorpay order created successfully');
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return error(res, 'Missing payment verification parameters', 400);
    }

    const isValid = await PaymentService.verifyPayment(
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature
    );

    if (isValid) {
      return success(res, null, 'Payment verified successfully');
    } else {
      return error(res, 'Invalid payment signature', 400);
    }
  } catch (err) {
    next(err);
  }
};
