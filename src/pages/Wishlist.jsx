import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/wishlists/my');
        setWishlist(data.products || []);
      } catch (error) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      // بنبعت طلب المسح للباك إند
      await api.delete(`/wishlists/remove/${productId}`);
      
      // بنشيل المنتج من الشاشة فوراً (من غير ما نستنى السيرفر يرد تاني)
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
      console.error(error);
    }
  };

  // ستايلات الصفحة
  const styles = {
    page: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' },
    breadcrumb: { fontSize: '14px', color: '#888', marginBottom: '30px' },
    breadcrumbLink: { color: '#C49B63', textDecoration: 'none' },
    header: { marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
    title: { fontSize: '32px', fontFamily: 'serif', color: '#333', margin: '0 0 10px 0' },
    subtitle: { color: '#777', fontSize: '15px', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' },
    card: { border: '1px solid #eee', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', transition: 'box-shadow 0.3s' },
    imageWrapper: { height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden' },
    image: { width: '100%', height: '100%', objectFit: 'contain' },
    category: { fontSize: '12px', color: '#C49B63', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold' },
    name: { fontSize: '16px', fontWeight: '600', color: '#333', margin: '0 0 10px 0' },
    price: { fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '20px' },
    actionButtons: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' },
    viewBtn: { textAlign: 'center', backgroundColor: '#C49B63', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
    removeBtn: { textAlign: 'center', backgroundColor: '#fff', color: '#d32f2f', border: '1px solid #eee', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    empty: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#FAF8F5', borderRadius: '12px', border: '1px dashed #ddd' },
    emptyIcon: { fontSize: '50px', marginBottom: '15px', color: '#C49B63' },
    emptyTitle: { fontSize: '24px', fontFamily: 'serif', color: '#333', marginBottom: '10px' },
    emptyText: { color: '#777', marginBottom: '25px' },
    exploreBtn: { backgroundColor: '#C49B63', color: 'white', padding: '12px 25px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px', color: '#C49B63' }}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Home</Link> / <span>My Wishlist</span>
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>My Wishlist</h1>
        <p style={styles.subtitle}>Your saved items and favorite products.</p>
      </div>

      {wishlist.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>♡</div>
          <h2 style={styles.emptyTitle}>Your wishlist is waiting</h2>
          <p style={styles.emptyText}>You haven't saved any products yet.</p>
          <Link to="/products" style={styles.exploreBtn}>Explore Products</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {wishlist.map((product) => (
            <div key={product._id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img src={product.images?.[0]?.url} alt={product.name} style={styles.image} />
              </div>
              
              <p style={styles.category}>{product.category || 'Collection'}</p>
              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.price}>${Number(product.price || 0).toFixed(2)}</p>
              
              <div style={styles.actionButtons}>
                <Link to={`/products/${product._id}`} style={styles.viewBtn}>View Product</Link>
                <button onClick={() => removeFromWishlist(product._id)} style={styles.removeBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;