import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import {
  selectCartItems, selectCartTotal, selectCartIsOpen,
  closeCart, removeFromCart, updateQuantity,
} from '../../features/cart/cartSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const isOpen   = useSelector(selectCartIsOpen);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl
                       transform transition-transform duration-300
                       ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4"
             style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiShoppingBag className="text-5xl mb-3 text-gray-300" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add some products to get started</p>
              <button
                onClick={() => dispatch(closeCart())}
                className="mt-4 btn-primary text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                {/* Product Image */}
                <img
                  src={item.images?.[0] || 'https://picsum.photos/seed/default/80/80'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-primary-600 font-semibold text-sm mt-0.5">
                    ${item.price?.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Item Total + Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                  <p className="text-sm font-bold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900 text-base">${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => dispatch(closeCart())}
              className="btn-primary w-full text-center block py-3 text-base"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={() => dispatch(closeCart())}
              className="btn-secondary w-full text-center block py-2.5 text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;