import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectCartItems, selectCartTotal,
  removeFromCart, updateQuantity, clearCart,
} from '../features/cart/cartSlice';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <FiTrash2 className="text-xs" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item._id} className="card p-4 flex gap-4">
              <img
                src={item.images?.[0] || `https://picsum.photos/seed/${item._id}/100/100`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`}
                      className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 text-sm">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                <p className="text-primary-600 font-bold mt-1">${item.price?.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  >−</button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 />
                </button>
                <p className="font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items ({items.reduce((a, i) => a + i.quantity, 0)})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-center block py-3 mt-4">
            Proceed to Checkout
          </Link>
          <Link to="/products" className="btn-secondary w-full text-center block py-2.5 mt-2 text-sm">
            <FiArrowLeft className="inline mr-1 text-xs" />Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;