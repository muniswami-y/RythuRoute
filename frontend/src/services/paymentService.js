import api from './api';

const paymentService = {
  createPaymentOrder: (order_id) => api.post('/payments/create', { order_id }),
  verifyPayment: (data) => api.post('/payments/verify', data)
};

export default paymentService;
