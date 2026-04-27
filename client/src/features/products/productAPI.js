import axiosInstance from '../../utils/axiosInstance';

export const getProducts       = (params) => axiosInstance.get('/products', { params });
export const getProductById    = (id)     => axiosInstance.get(`/products/${id}`);
export const getCategories     = ()       => axiosInstance.get('/products/categories/all');
export const getSimilarProducts= (id)     => axiosInstance.get(`/products/${id}/similar`);
export const getRecommendations= ()       => axiosInstance.get('/users/recommendations');
export const postReview        = (id, data) => axiosInstance.post(`/products/${id}/reviews`, data);
export const getReviews        = (id)     => axiosInstance.get(`/products/${id}/reviews`);