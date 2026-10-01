import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, CartItem, Order, TabType } from '@/types';
import { initialFoodItems, initialOrders } from '@/data/mockData';

interface AppContextType {
  foodItems: FoodItem[];
  cart: CartItem[];
  wishlist: string[]; // foodItem IDs
  orders: Order[];
  activeTab: TabType;
  toastMessage: string | null;
  addToCart: (item: FoodItem) => void;
  updateQuantity: (id: string, action: 'increase' | 'decrease') => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  placeOrder: () => void;
  setActiveTab: (tab: TabType) => void;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems] = useState<FoodItem[]>(initialFoodItems);
  
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Hamburger',
      category: 'Burger',
      price: 2.50,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    },
    {
      id: '2',
      name: 'Pepperoni Pizza',
      category: 'Pizza',
      price: 8.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    },
  ]);

  const [wishlist, setWishlist] = useState<string[]>(['1']);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.numericPrice,
          quantity: 1,
          image: item.image,
        },
      ];
    });
    showToast(`Added ${item.name} to cart!`);
  };

  const updateQuantity = (id: string, action: 'increase' | 'decrease') => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter((i) => i !== id);
      } else {
        const item = foodItems.find(f => f.id === id);
        showToast(`Saved ${item ? item.name : 'item'} to favorites!`);
        return [...prev, id];
      }
    });
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAmount = (subtotal + 1.50).toFixed(2);
    const itemsDescription = cart.map((i) => `${i.quantity}x ${i.name}`).join(', ');

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now',
      status: 'Preparing',
      total: `$${totalAmount}`,
      items: itemsDescription,
      image: cart[0].image,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveTab('orders');
    showToast('🎉 Order placed successfully! Tracking your delivery.');
  };

  return (
    <AppContext.Provider
      value={{
        foodItems,
        cart,
        wishlist,
        orders,
        activeTab,
        toastMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        placeOrder,
        setActiveTab,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
