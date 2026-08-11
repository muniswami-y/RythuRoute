import api from './api';

const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/mine'),
  getOrderDetails: (id) => api.get(`/orders/${id}`),
  getFarmerOrders: () => api.get('/orders/farmer')
};

export default orderService;
