import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get('/orders/my')
      .then((res) => setOrders(res.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.patch(`/orders/my/${orderId}/cancel`);
      toast.success('Order cancelled');

      const res = await api.get('/orders/my');
      setOrders(res.data.orders);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };

  const getStatusClass = (status) => {
    const map = {
      pending: 'pending',
      confirmed: 'processing',
      processing: 'processing',
      shipped: 'shipped',
      delivered: 'delivered',
      cancelled: 'cancelled',
      returned: 'cancelled',
    };
    return map[status] || 'pending';
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const filters = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="orders-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="orders-empty">
            <div className="orders-empty-icon"></div>
            <h1 className="orders-empty-title">No Orders Yet</h1>
            <p className="orders-empty-text">
              You haven't placed any orders yet. Start shopping!
            </p>
            <Link to="/products" className="btn-gold">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">
              Track and manage your orders
            </p>
          </div>
          <Link to="/products" className="btn-gold orders-shop-btn">
            Continue Shopping
          </Link>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`orders-filter ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value === 'all' && (
                <span className="filter-count">{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="orders-empty-small">
            <p>No orders match this filter.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                {/* Header */}
                <div className="order-header">
                  <div className="order-header-left">
                    <div className="order-id-row">
                      <span className="order-id-label">Order</span>
                      <span className="order-id">#{order._id.slice(-8)}</span>
                    </div>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="order-items-preview">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="order-preview-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-preview-image"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="order-preview-more">
                      +{order.items.length - 4}
                    </div>
                  )}
                  <div className="order-preview-info">
                    <p className="order-preview-count">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <p className="order-preview-total">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="order-actions">
                  <button
                    className="order-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>

                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      className="order-cancel-btn"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Order Details Modal ===== */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="order-modal-header">
              <div>
                <h2 className="order-modal-title">
                  Order #{selectedOrder._id.slice(-8)}
                </h2>
                <p className="order-modal-date">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                className="order-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="order-modal-body">
              {/* Status */}
              <div className="order-modal-section">
                <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Items */}
              <div className="order-modal-section">
                <h3 className="order-modal-subtitle">Items</h3>
                <div className="order-modal-items">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="order-modal-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-modal-item-image"
                      />
                      <div className="order-modal-item-info">
                        <p className="order-modal-item-name">{item.name}</p>
                        <p className="order-modal-item-qty">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="order-modal-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              {selectedOrder.shippingAddress && (
                <div className="order-modal-section">
                  <h3 className="order-modal-subtitle">Shipping Address</h3>
                  <div className="order-modal-address">
                    <p><strong>{selectedOrder.shippingAddress.fullName}</strong></p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                    <p>
                      {selectedOrder.shippingAddress.address},{' '}
                      {selectedOrder.shippingAddress.city},{' '}
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="order-modal-section">
                <h3 className="order-modal-subtitle">Order Summary</h3>
                <div className="order-modal-totals">
                  <div className="order-modal-total-row">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="order-modal-total-row discount">
                      <span>Discount</span>
                      <span>−${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="order-modal-total-row">
                    <span>Shipping</span>
                    <span>${selectedOrder.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="order-modal-total-row">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="order-modal-total-row final">
                    <span>Total</span>
                    <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="order-modal-section">
                <h3 className="order-modal-subtitle">Payment Method</h3>
                <p className="order-modal-payment">
                  {selectedOrder.paymentMethod === 'cash'
                    ? '💵 Cash on Delivery'
                    : '💳 Card (Stripe)'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="order-modal-footer">
              {(selectedOrder.status === 'pending' ||
                selectedOrder.status === 'confirmed') && (
                <button
                  className="order-cancel-btn"
                  onClick={() => {
                    handleCancel(selectedOrder._id);
                    setSelectedOrder(null);
                  }}
                >
                  Cancel Order
                </button>
              )}
              <button
                className="btn-gold"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;