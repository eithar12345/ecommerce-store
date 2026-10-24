import { Link } from 'react-router-dom';
import './HomeHero.css';

export default function HomeHero() {
  return (
    <section className="home-hero">
      <div className="home-hero-overlay"></div>
      <img
        src="/images/home-hero.png"
        alt="Luxury gold accessories"
        className="home-hero-image"
      />

      <div className="home-hero-content">
        <div className="home-hero-inner">
          <div className="home-hero-text-box">
            <p className="home-hero-label">Premium Collection</p>
            <h1 className="text-6xl font-serif text-[#C49B63] leading-tight mb-6">
  Shop the Collection
</h1>
            <p className="home-hero-subtitle">
              Style, quality and elegance — all in one place.
            </p>
            <Link to="/products" className="home-hero-btn">
              Explore Now
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="home-hero-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </section>
  );
}