import api from './api';

const adminService = {
  getDashboardStats: () => api.get('/admin/stats'),
  getFarmers: () => api.get('/admin/farmers'),
  updateFarmerStatus: (id, status) => api.put(`/admin/farmers/${id}/status`, { status }),
  getOrders: () => api.get('/admin/orders'),
  getUsers: (role) => api.get(`/admin/users${role ? `?role=${role}` : ''}`),
  getProducts: () => api.get('/admin/products'),
};

export default adminService;
