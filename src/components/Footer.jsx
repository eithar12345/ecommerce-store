import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              MyStore
            </h3>
            <p className="footer-text">
              Discover elegant accessories and timeless pieces for your everyday style.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/products" className="footer-link">Products</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
          </div>

          <div>
            <h4 className="footer-heading">Customer Service</h4>
            <Link to="/profile" className="footer-link">My Account</Link>
            <Link to="/profile/orders" className="footer-link">Track Order</Link>
          </div>

          <div>
            <h4 className="footer-heading">Contact</h4>
            <p className="footer-text">📧 support@mystore.com</p>
            <p className="footer-text">📱 +20 123 456 7890</p>
            <p className="footer-text">📍 Cairo, Egypt</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 MyStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;