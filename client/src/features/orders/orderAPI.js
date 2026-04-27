import axiosInstance from '../../utils/axiosInstance';

export const placeOrder    = (data) => axiosInstance.post('/orders', data);
export const getMyOrders   = ()     => axiosInstance.get('/orders/myorders');
export const getOrderById  = (id)   => axiosInstance.get(`/orders/${id}`);
export const payOrder      = (id)   => axiosInstance.put(`/orders/${id}/pay`);
export const getAdminStats = ()     => axiosInstance.get('/orders/admin/stats');
export const getAllOrders   = ()     => axiosInstance.get('/orders');
export const updateStatus  = (id, status) => axiosInstance.put(`/orders/${id}/status`, { status });