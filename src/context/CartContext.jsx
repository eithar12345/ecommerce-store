import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart(null);
        setItemCount(0);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get('/carts');
        setCart(res.data);
        setItemCount(res.data.itemCount || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCart(null);
      setItemCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/carts');
      setCart(res.data);
      setItemCount(res.data.itemCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post('/carts/items', { productId, quantity });
      setCart(res.data);
      setItemCount(res.data.itemCount);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to add',
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.patch('/carts/items', { productId, quantity });
      setCart(res.data);
      setItemCount(res.data.itemCount);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to update',
      };
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/carts/items/${productId}`);
      setCart(res.data);
      setItemCount(res.data.itemCount);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to remove',
      };
    }
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/carts/coupon', { code });
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid coupon',
      };
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await api.delete('/carts/coupon');
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}