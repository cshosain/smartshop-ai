import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./features/auth/authSlice";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import {
  CustomerRoute,
  ProtectedRoute,
  AdminRoute,
} from "./components/common/ProtectedRoutes";
import CartDrawer from "./components/cart/CartDrawer";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Silently try to restore session
    // If no cookie exists this will fail quietly — user stays as guest
    dispatch(fetchProfile())
      .unwrap()
      .catch(() => {
        // Not logged in — that is fine, do nothing
      });
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer-only Routes — logged in but not admin */}
          <Route element={<CustomerRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Protected Routes — must be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Routes — must be admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
