import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../features/orders/orderSlice';
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard } from 'react-icons/fi';

const CheckoutPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(selectCartItems);
  const total     = useSelector(selectCartTotal);
  const { loading } = useSelector((s) => s.orders);

  const [address, setAddress] = useState({
    address: '', city: '', postalCode: '', country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');

    const orderData = {
      items: items.map((i) => ({
        product:  i._id,
        name:     i.name,
        quantity: i.quantity,
        price:    i.price,
        image:    i.images?.[0] || '',
      })),
      shippingAddress: address,
      paymentMethod,
      totalPrice: total,
    };

    const result = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders`);
    } else {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Shipping */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="text-primary-600" />
              <h2 className="font-semibold text-gray-800">Shipping Address</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: 'address',    label: 'Street Address', placeholder: '123 Main Street' },
                { key: 'city',       label: 'City',           placeholder: 'Dhaka' },
                { key: 'postalCode', label: 'Postal Code',    placeholder: '1200' },
                { key: 'country',    label: 'Country',        placeholder: 'Bangladesh' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                  <input
                    type="text"
                    required
                    placeholder={placeholder}
                    value={address[key]}
                    onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiCreditCard className="text-primary-600" />
              <h2 className="font-semibold text-gray-800">Payment Method</h2>
            </div>
            <div className="space-y-2">
              {['Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200
                                               hover:border-primary-300 cursor-pointer transition-colors
                                               has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="text-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="card p-5 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">
            Order Summary ({items.length} items)
          </h2>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {items.map((item) => (
              <div key={item._id} className="flex gap-3">
                <img
                  src={item.images?.[0] || `https://picsum.photos/seed/${item._id}/60/60`}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;