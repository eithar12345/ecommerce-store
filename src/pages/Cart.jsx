import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/useCart';

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');

  const handleQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const result = await updateQuantity(productId, quantity);
    if (!result.success) toast.error(result.error);
  };

  const handleRemove = async (productId) => {
    if (!window.confirm('Remove this item?')) return;
    const result = await removeItem(productId);
    if (result.success) toast.success('Item removed');
    else toast.error(result.error);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const result = await applyCoupon(couponCode.toUpperCase());
    if (result.success) {
      toast.success('Coupon applied!');
      setCouponCode('');
    } else {
      toast.error(result.error);
    }
  };

  const handleRemoveCoupon = async () => {
    const result = await removeCoupon();
    if (result.success) toast.success('Coupon removed');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon"></div>
          <h1 className="cart-empty-title">Your Cart is Empty</h1>
          <p className="cart-empty-text">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/products" className="btn-gold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product} className="cart-item">
                <Link to={`/products/${item.product}`} className="cart-item-image-link">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                </Link>

                <div className="cart-item-info">
                  <Link to={`/products/${item.product}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>

                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantity(item.product, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantity(item.product, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.product)}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            {/* Coupon */}
            {cart.coupon?.code ? (
              <div className="coupon-applied">
                <span>✓ {cart.coupon.code}</span>
                <button onClick={handleRemoveCoupon} className="coupon-remove">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button type="submit" className="coupon-btn">
                  Apply
                </button>
              </form>
            )}

            {/* Summary Rows */}
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cart.subtotal?.toFixed(2)}</span>
              </div>

              {cart.discountAmount > 0 && (
                <div className="summary-row summary-discount">
                  <span>Discount</span>
                  <span>−${cart.discountAmount?.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span className="summary-free">
                  {cart.subtotal >= 1000 ? 'Free' : '$50.00'}
                </span>
              </div>

              <div className="summary-row">
                <span>Tax (14%)</span>
                <span>${(cart.subtotal * 0.14).toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="summary-total">
              <span>Total</span>
              <span className="summary-total-price">
                $
                {(
                  cart.total +
                  (cart.subtotal >= 1000 ? 0 : 50) +
                  cart.subtotal * 0.14
                ).toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              className="btn-gold checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;