import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user)               return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/"    replace />;
  return <Outlet />;
};

// NEW — blocks admin from customer-only pages
export const CustomerRoute = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') {
    toast.error('Admin accounts cannot access customer pages');
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};