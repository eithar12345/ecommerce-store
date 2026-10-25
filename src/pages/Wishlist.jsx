import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/wishlists/my');
        // الباك إند بيرجع { user, products } أو { products }
        setWishlist(data.products || data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <div className="text-center py-20 text-2xl font-serif">Loading Wishlist...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-6xl mb-4 block">🤍</span>
          <h2 className="text-2xl font-serif text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite items here.</p>
          <Link to="/products" className="bg-[#C49B63] text-white px-8 py-3 rounded-xl hover:bg-[#b08856] transition-colors">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-[#C49B63] font-bold">${product.price}</p>
                <Link to={`/products/${product._id}`} className="mt-4 block text-center bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100">
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;