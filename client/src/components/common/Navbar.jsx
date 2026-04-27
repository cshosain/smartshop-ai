import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiGrid,
} from "react-icons/fi";
import { logoutUser } from "../../features/auth/authSlice";
import { toggleCart } from "../../features/cart/cartSlice";
import { selectCartItemCount } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartItemCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
    setUserMenu(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiGrid className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-primary-700">
              SmartShop<span className="text-accent-500">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              ...(user?.role === "admin"
                ? [{ to: "/admin", label: "Admin Panel" }]
                : []),
            ].map(({ to, label }) => {
              // Exact match for home, startsWith for others
              const isActive =
                to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  className={`font-medium transition-colors text-sm pb-0.5 border-b-2 ${
                    isActive
                      ? "text-primary-600 border-primary-600"
                      : "text-gray-600 hover:text-primary-600 border-transparent"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Button — only for non-admin users */}
            {user?.role !== "admin" && (
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown */}
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiUser className="text-gray-400" /> Profile
                    </Link>
                    {user.role !== "admin" && (
                      <Link
                        to="/orders"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FiPackage className="text-gray-400" /> My Orders
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-gray-50"
                      >
                        <FiSettings className="text-accent-500" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <FiLogOut className="text-red-400" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary  text-sm py-1.5 px-4"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {menuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Products
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Profile
                </Link>
                {user.role != "admin" && (
                    <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  My Orders
                </Link>
                  )}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-accent-600 hover:bg-gray-50 rounded-lg"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary text-sm flex-1 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary  text-sm flex-1 text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
