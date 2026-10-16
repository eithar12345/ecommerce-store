import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useCart } from '../context/useCart';

function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [viewMode, setViewMode] = useState('grid');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    api.get('/products?limit=100')
      .then((res) => {
        setAllProducts(res.data.products);
        setProducts(res.data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered = filtered.filter((p) => p.price <= maxPrice);

    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

    setProducts(filtered);
  }, [category, search, sort, maxPrice, allProducts]);

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

  const toggleWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'womens-jewellery', label: 'Jewellery' },
    { value: 'womens-bags', label: 'Bags' },
    { value: 'womens-watches', label: 'Watches' },
    { value: 'sunglasses', label: 'Sunglasses' },
  ];

  return (
    <div className="home-products">
      <div className="container">
        <div className="home-products-layout">
          {/* SIDEBAR */}
          <aside className="home-filters-sidebar">
            <div className="home-filter-header">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Products
            </div>

            <div className="home-filter-group">
              <div className="home-filter-group-title">
                Categories
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              {categories.map((c) => (
                <label
                  key={c.value}
                  className={`home-filter-option ${category === c.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={category === c.value}
                    onChange={() => setCategory(c.value)}
                  />
                  {c.label}
                </label>
              ))}
            </div>

            <div className="home-filter-group">
              <div className="home-filter-group-title">Price Range</div>
              <div className="home-price-range">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="home-price-slider"
                />
                <div className="home-price-values">
                  <span>$0</span>
                  <span>$100+</span>
                </div>
              </div>
            </div>

            <div className="home-sidebar-quote">
              <p className="home-sidebar-quote-text">
                Better Things<br />Are Coming
              </p>
              <span className="home-sidebar-quote-heart">♥</span>
            </div>
          </aside>

          {/* MAIN */}
          <main className="home-products-main">
            {/* Toolbar */}
            <div className="home-products-toolbar">
              <div className="home-search-wrapper">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="home-search-input"
                />
              </div>

              <div className="home-sort-wrapper">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="home-sort-select">
                  <option value="default">Sort by: Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="home-view-toggles">
                  <button
                    className={`home-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    className={`home-view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="spinner"></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No products found</h3>
                <p className="empty-text">Try different filters or search</p>
              </div>
            ) : (
              <div className={`home-products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {products.map((p) => (
                  <Link key={p._id} to={`/products/${p._id}`} className="home-product-card">
                    <div className="home-product-image-wrapper">
                      <img src={p.images?.[0]?.url} alt={p.name} className="home-product-card-image" />
                      <button
                        className={`home-wishlist-btn ${wishlist.includes(p._id) ? 'active' : ''}`}
                        onClick={(e) => toggleWishlist(e, p._id)}
                      >
                        <svg width="18" height="18" fill={wishlist.includes(p._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="home-product-card-body">
                      <h3 className="home-product-card-name">{p.name}</h3>
                      <p className="home-product-card-category">{p.category}</p>
                      <p className="home-product-card-price">${p.price}</p>
                      <button className="home-btn-add-cart" onClick={(e) => handleAddToCart(e, p._id)}>
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
          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;