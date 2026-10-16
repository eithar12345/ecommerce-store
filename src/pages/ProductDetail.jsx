import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useCart } from '../context/useCart';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {
        toast.error('Product not found');
        navigate('/products');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(id, quantity);
    setAddingToCart(false);

    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [{ url: '' }];
  const inStock = product.stock > 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* ===== Left: Images ===== */}
          <div className="product-images">
            <div className="product-main-image">
              <img
                src={images[selectedImage]?.url}
                alt={product.name}
                className="product-main-image-img"
              />
              {inStock ? (
                <span className="product-stock-badge in-stock">In Stock</span>
              ) : (
                <span className="product-stock-badge out-stock">Out of Stock</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-thumbnail ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img.url} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== Right: Info ===== */}
          <div className="product-info">
            {/* Category */}
            <p className="product-info-category">{product.category}</p>

            {/* Title */}
            <h1 className="product-info-title">{product.name}</h1>

            {/* Rating */}
            <div className="product-info-rating">
              <div className="product-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="18"
                    height="18"
                    fill={star <= Math.round(product.averageRating || 0) ? '#C49A52' : 'none'}
                    stroke="#C49A52"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              <span className="product-rating-value">
                {product.averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="product-rating-count">
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="product-info-price">${product.price.toFixed(2)}</div>

            {/* Description */}
            <p className="product-info-description">{product.description}</p>

            {/* Meta */}
            <div className="product-info-meta">
              <div className="product-meta-row">
                <span className="product-meta-label">Brand:</span>
                <span className="product-meta-value">{product.brand || 'Generic'}</span>
              </div>
              <div className="product-meta-row">
                <span className="product-meta-label">Category:</span>
                <span className="product-meta-value" style={{ textTransform: 'capitalize' }}>
                  {product.category}
                </span>
              </div>
              <div className="product-meta-row">
                <span className="product-meta-label">Availability:</span>
                <span className={`product-meta-value ${inStock ? 'text-green' : 'text-red'}`}>
                  {inStock ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="product-actions">
                <div className="product-qty">
                  <button
                    className="product-qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="product-qty-value">{quantity}</span>
                  <button
                    className="product-qty-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn-gold product-add-btn"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <>
                      <span className="btn-spinner"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Features */}
            <div className="product-features">
              <div className="product-feature">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                Authentic Product
              </div>
              <div className="product-feature">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                Secure Packaging
              </div>
              <div className="product-feature">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                Free Shipping Over $1000
              </div>
            </div>
          </div>
        </div>

        {/* ===== Reviews ===== */}
        <div className="product-reviews">
          <h2 className="reviews-title">
            Customer Reviews ({product.reviews?.length || 0})
          </h2>

          {product.reviews?.length === 0 ? (
            <div className="reviews-empty">
              <div className="reviews-empty-icon"></div>
              <p className="reviews-empty-text">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((review, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      {review.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="review-author">
                      <h4 className="review-name">{review.name}</h4>
                      <div className="review-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="14"
                            height="14"
                            fill={star <= review.rating ? '#C49A52' : 'none'}
                            stroke="#C49A52"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;