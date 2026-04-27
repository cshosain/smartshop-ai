import axiosInstance from '../../utils/axiosInstance';

export const register      = (data) => axiosInstance.post('/auth/register', data);
export const login         = (data) => axiosInstance.post('/auth/login', data);
export const logout        = ()     => axiosInstance.post('/auth/logout');
export const refreshToken  = ()     => axiosInstance.post('/auth/refresh');
export const getProfile    = ()     => axiosInstance.get('/users/profile');
export const updateProfile = (data) => axiosInstance.put('/users/profile', data);