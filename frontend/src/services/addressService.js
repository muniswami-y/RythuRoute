import api from './api';

const addressService = {
  getMyAddresses: () => api.get('/addresses/mine'),
  createAddress: (data) => api.post('/addresses', data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`)
};

export default addressService;
