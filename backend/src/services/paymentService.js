const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../config/database');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

class PaymentService {
  /**
   * Create a Razorpay Order and link it to our internal Order
   */
  static async createRazorpayOrder(internalOrderId, amountINR) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = !keyId || keyId === 'rzp_test_mock_id' || !keySecret;

    const options = {
      amount: Math.round(amountINR * 100), // Amount in paise
      currency: 'INR',
      receipt: `ryr_receipt_${internalOrderId}`
    };

    let rzpOrder;
    if (isMock) {
      // Return a simulated Razorpay Order to prevent crashing without real keys
      rzpOrder = {
        id: `mock_order_${Date.now()}`,
        amount: options.amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created'
      };
    } else {
      const razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      rzpOrder = await razorpayInstance.orders.create(options);
    }

    // Save payment record linking Razorpay order to internal order
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        `INSERT INTO payments (order_id, razorpay_order_id, amount, status) VALUES (?, ?, ?, ?)`,
        [internalOrderId, rzpOrder.id, amountINR, 'created']
      );
    } finally {
      connection.release();
    }

    return rzpOrder;
  }

  static async verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
    const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_mock_id' || !process.env.RAZORPAY_KEY_SECRET;
    let isAuthentic = false;

    if (isMock) {
      // In mock mode, simply verify that the signature matches our mock secret
      isAuthentic = razorpay_signature === 'mock_success_signature';
    } else {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret';
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

      isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // 1. Update Payment record
        await connection.execute(
          `UPDATE payments SET status = ?, razorpay_payment_id = ?, signature = ? WHERE razorpay_order_id = ?`,
          ['captured', razorpay_payment_id, razorpay_signature, razorpay_order_id]
        );

        // 2. Fetch the corresponding internal order id
        const [paymentRows] = await connection.execute(
          `SELECT order_id FROM payments WHERE razorpay_order_id = ?`,
          [razorpay_order_id]
        );
        const internalOrderId = paymentRows[0].order_id;

        // 3. Update Order status
        await connection.execute(
          `UPDATE orders SET payment_status = ?, status = ? WHERE id = ?`,
          ['paid', 'Paid', internalOrderId]
        );

        await connection.commit();
        return true;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
    } else {
      return false;
    }
  }
}

module.exports = PaymentService;
