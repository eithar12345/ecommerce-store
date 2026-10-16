import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useCart } from '../context/useCart';

function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: 'Egypt',
    city: '',
    address: '',
    postalCode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/orders', {
        shippingAddress: formData,
        paymentMethod,
      });

      await fetchCart();

      toast.success('Order placed successfully!');
      navigate('/profile/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <div className="checkout-empty-icon">🛒</div>
            <h1 className="checkout-empty-title">Your Cart is Empty</h1>
            <p className="checkout-empty-text">
              Add items to your cart before checking out.
            </p>
            <Link to="/products" className="btn-gold">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.subtotal || 0;
  const discount = cart.discountAmount || 0;
  const shipping = subtotal >= 1000 ? 0 : 50;
  const tax = subtotal * 0.14;
  const total = cart.total + shipping + tax;

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">
            Complete your order in a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className="checkout-step active">
            <span className="checkout-step-num">1</span>
            <span className="checkout-step-label">Cart</span>
          </div>
          <div className="checkout-step-line"></div>
          <div className="checkout-step active">
            <span className="checkout-step-num">2</span>
            <span className="checkout-step-label">Details</span>
          </div>
          <div className="checkout-step-line"></div>
          <div className="checkout-step">
            <span className="checkout-step-num">3</span>
            <span className="checkout-step-label">Done</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* ===== Left: Forms ===== */}
            <div className="checkout-left">
              {/* Shipping Address */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <div className="checkout-card-icon">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="checkout-card-title">Shipping Address</h2>
                    <p className="checkout-card-subtitle">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="form-input-simple"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="01XXXXXXXXX"
                      className="form-input-simple"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="form-input-simple"
                    >
                      <option value="Egypt">Egypt</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="UAE">UAE</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Cairo"
                      className="form-input-simple"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="123 Main Street, Apt 4"
                      className="form-input-simple"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="11511"
                      className="form-input-simple"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <div className="checkout-card-icon">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="checkout-card-title">Payment Method</h2>
                    <p className="checkout-card-subtitle">
                      Choose how you'd like to pay
                    </p>
                  </div>
                </div>

                <div className="payment-options">
                  <label
                    className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-icon">💵</div>
                    <div className="payment-option-content">
                      <h3 className="payment-option-title">Cash on Delivery</h3>
                      <p className="payment-option-text">
                        Pay when your order arrives
                      </p>
                    </div>
                    <div className="payment-option-check">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-icon">💳</div>
                    <div className="payment-option-content">
                      <h3 className="payment-option-title">Credit Card (Stripe)</h3>
                      <p className="payment-option-text">
                        Secure payment with your card
                      </p>
                    </div>
                    <div className="payment-option-check">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ===== Right: Summary ===== */}
            <div className="checkout-right">
              <div className="checkout-summary">
                <h2 className="checkout-summary-title">Order Summary</h2>

                {/* Items */}
                <div className="checkout-summary-items">
                  {cart.items.map((item) => (
                    <div key={item.product} className="checkout-summary-item">
                      <div className="checkout-summary-item-image">
                        <img src={item.image} alt={item.name} />
                        <span className="checkout-summary-item-qty">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="checkout-summary-item-info">
                        <p className="checkout-summary-item-name">{item.name}</p>
                        <p className="checkout-summary-item-price">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="checkout-summary-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="checkout-summary-totals">
                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="checkout-summary-row discount">
                      <span>Discount</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="checkout-summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'free' : ''}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="checkout-summary-row">
                    <span>Tax (14%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="checkout-summary-total">
                  <span>Total</span>
                  <span className="checkout-summary-total-price">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold checkout-submit-btn"
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Place Order
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="checkout-trust">
                  <div className="checkout-trust-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure
                  </div>
                  <div className="checkout-trust-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Safe Payment
                  </div>
                  <div className="checkout-trust-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Verified
                  </div>
                </div>

                <Link to="/cart" className="checkout-back-link">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;