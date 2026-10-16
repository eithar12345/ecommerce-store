import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useCart } from '../context/useCart';
import HomeHero from '../components/HomeHero';

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    api.get('/products?limit=8')
      .then((res) => {
        setFeatured(res.data.products.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    const result = await addToCart(productId, 1);
    if (result.success) toast.success('Added to cart!');
    else toast.error(result.error);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    toast.info('Newsletter subscription coming soon!');
    setEmail('');
  };

  return (
    <div>
      {/* 1. HERO */}
      <HomeHero />

      {/* 2. BENEFITS */}
      <section className="benefits-strip">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Premium Quality</h4>
                <p>Carefully selected products</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Secure Shopping</h4>
                <p>A safe shopping experience</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Easy Shopping</h4>
                <p>A simple and convenient process</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Customer Support</h4>
                <p>We are here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find the perfect pieces for your personal style.</p>
          </div>

          <div className="categories-grid">
            <Link to="/products?category=womens-jewellery" className="category-card">
              <div className="category-image-wrapper">
                <img src="//images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800" alt="Jewelry" className="category-image" />
              </div>
              <div className="category-content">
                <h3 className="category-title">Jewelry</h3>
                <p className="category-subtitle">Elegant details that shine</p>
                <span className="category-link">Explore Collection →</span>
              </div>
            </Link>

            <Link to="/products?category=womens-bags" className="category-card">
              <div className="category-image-wrapper">
                <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800" alt="Handbags" className="category-image" />
              </div>
              <div className="category-content">
                <h3 className="category-title">Handbags</h3>
                <p className="category-subtitle">Your style, beautifully carried</p>
                <span className="category-link">Explore Collection →</span>
              </div>
            </Link>

            <Link to="/products?category=womens-watches" className="category-card">
              <div className="category-image-wrapper">
                <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800" alt="Accessories" className="category-image" />
              </div>
              <div className="category-content">
                <h3 className="category-title">Accessories</h3>
                <p className="category-subtitle">Complete your look</p>
                <span className="category-link">Explore Collection →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div className="featured-header-left">
              <p className="featured-label">Our Selection</p>
              <h2 className="featured-title">Featured Products</h2>
              <p className="featured-subtitle">Discover pieces selected for their timeless appeal.</p>
            </div>
            <Link to="/products" className="featured-view-all">View All Products →</Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="featured-grid">
              {featured.map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} className="product-card">
                  <div className="product-image-wrapper">
                    <img src={p.images?.[0]?.url} alt={p.name} className="product-card-image" />
                    <button className="wishlist-btn" onClick={(e) => e.preventDefault()}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-name">{p.name}</h3>
                    <p className="product-card-category">{p.category}</p>
                    <p className="product-card-price">${p.price}</p>
                    <button className="btn-add-cart" onClick={(e) => handleAddToCart(e, p._id)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. PROMO BANNER */}
      <section className="promo-banner">
        <div className="promo-banner-inner">
          <div className="promo-banner-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200"
              alt="Gift collection"
              className="promo-banner-image"
            />
          </div>
          <div className="promo-banner-content">
            <p className="promo-banner-label">The Art of Gifting</p>
            <h2 className="promo-banner-title">Make Every Moment Special</h2>
            <p className="promo-banner-text">
              Discover thoughtful pieces for yourself or someone you love.
            </p>
            <Link to="/products" className="btn-gold">
              Explore the Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. BRAND STORY */}
      <section className="brand-story">
        <div className="container">
          <div className="brand-story-inner">
            <div className="brand-story-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000"
                alt="MyStore brand"
                className="brand-story-image"
              />
            </div>
            <div>
              <p className="brand-story-label">About MyStore</p>
              <h2 className="brand-story-title">Beauty in Every Detail</h2>
              <p className="brand-story-text">
                At MyStore, we believe that the right details can make everyday style feel extraordinary. Explore a carefully presented collection of accessories and handbags chosen to complement your personal style.
              </p>
              <div className="brand-story-values">
                <div className="brand-value">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Timeless Style
                </div>
                <div className="brand-value">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Thoughtful Selection
                </div>
                <div className="brand-value">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Elegant Details
                </div>
              </div>
              <Link to="/products" className="brand-story-link">
                Discover Our Collection →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <h2 className="newsletter-title">Stay in Style</h2>
            <p className="newsletter-text">
              Discover new arrivals and get inspired by timeless style.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn-gold">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
      
    </div>

    
  );
}

export default Home;