import api from './api';

const productService = {
  createProduct: (formData) => api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getMyProducts: () => api.get('/products/farmer/mine'),
  getProducts: (params) => api.get('/products', { params }),
  getProductDetails: (id) => api.get(`/products/${id}`),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productService;
