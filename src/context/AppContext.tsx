import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, CartItem, Order, TabType, SansCountsUser } from '@/types';
import { initialFoodItems, initialOrders } from '@/data/mockData';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, doc, setDoc, onSnapshot, getDocs } from 'firebase/firestore';

interface AppContextType {
  foodItems: FoodItem[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  activeTab: TabType;
  toastMessage: string | null;
  user: SansCountsUser;
  loginWithSansCounts: (user: SansCountsUser) => void;
  logout: () => void;
  triggerSansCountsAuth: () => void;
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

const defaultGuestUser: SansCountsUser = {
  username: '',
  email: '',
  firstName: 'Guest',
  lastName: '',
  avatar: '',
  isConnected: false,
};

const SANSCOUNTS_CLIENT_ID = 'sc_client_sansneat_live';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  
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

  // User auth state with local storage persistence
  const [user, setUser] = useState<SansCountsUser>(() => {
    try {
      const saved = localStorage.getItem('sanscounts_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isConnected) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return defaultGuestUser;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Seed initial food items to Firestore if empty
  useEffect(() => {
    const seedFoodItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'food_items'));
        if (snapshot.empty) {
          for (const item of initialFoodItems) {
            await setDoc(doc(db, 'food_items', item.id), item);
          }
        }
      } catch (err) {
        console.warn('Initial Firestore seed check:', err);
      }
    };
    seedFoodItems();
  }, []);

  // Listen to Firestore real-time updates for food_items
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'food_items'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: FoodItem[] = [];
          snapshot.forEach((doc) => {
            items.push(doc.data() as FoodItem);
          });
          setFoodItems(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'food_items');
      }
    );
    return () => unsub();
  }, []);

  // Listen to Firestore real-time updates for orders
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const fetchedOrders: Order[] = [];
        snapshot.forEach((doc) => {
          fetchedOrders.push(doc.data() as Order);
        });
        if (fetchedOrders.length > 0) {
          setOrders(fetchedOrders);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
      }
    );
    return () => unsub();
  }, []);

  const loginWithSansCounts = (newUser: SansCountsUser) => {
    setUser(newUser);
    try {
      localStorage.setItem('sanscounts_session', JSON.stringify(newUser));
      
      // Sync user profile to Firestore
      const userProfile = {
        username: newUser.username || 'sanssiu',
        email: newUser.email || `${newUser.username || 'sanssiu'}@sanscounts.san`,
        firstName: newUser.firstName || 'Sans',
        lastName: newUser.lastName || 'Counts',
        avatar: newUser.avatar || '',
        updatedAt: new Date().toISOString(),
      };
      setDoc(doc(db, 'users', userProfile.username), userProfile).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `users/${userProfile.username}`)
      );
    } catch {
      // ignore
    }
    showToast(`Signed in as @${newUser.username || 'user'}`);
  };

  const logout = () => {
    setUser(defaultGuestUser);
    try {
      localStorage.removeItem('sanscounts_session');
    } catch {
      // ignore
    }
    showToast('Logged out');
  };

  const triggerSansCountsAuth = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const liveOAuthUrl = `https://sanscounts.sanssiu.com/oauth/authorize?client_id=${SANSCOUNTS_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    const width = 540;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const authWindow = window.open(
      liveOAuthUrl,
      'sanscounts_oauth_popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );

    if (!authWindow) {
      window.location.href = liveOAuthUrl;
    }
  };

  // Cross-origin popup listener for OAuth 2.0 flow
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SANSCOUNTS_AUTH_SUCCESS' || event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { username, email, token, firstName, lastName } = event.data;
        const rawUser = username || (email ? email.split('@')[0] : '') || 'sanscounts_user';
        const cleanUser = rawUser.trim().toLowerCase().replace(/@.*$/, '');
        
        const authenticatedUser: SansCountsUser = {
          username: cleanUser,
          email: email || `${cleanUser}@sanscounts.san`,
          firstName: firstName || (cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1)),
          lastName: lastName || 'SansCounts',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
          token: token || 'sc_token_live',
          isConnected: true,
        };
        loginWithSansCounts(authenticatedUser);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Check URL params on redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code') || params.get('auth_code');
    const userParam = params.get('username') || params.get('user');
    const emailParam = params.get('email');
    if (codeParam || userParam || emailParam) {
      const rawUname = userParam || (emailParam ? emailParam.split('@')[0] : '') || 'sanscounts_user';
      const uname = rawUname.trim().toLowerCase().replace(/@.*$/, '');
      const userObj: SansCountsUser = {
        username: uname,
        email: emailParam || `${uname}@sanscounts.san`,
        firstName: uname.charAt(0).toUpperCase() + uname.slice(1),
        lastName: 'SansCounts',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${uname}`,
        token: `sc_token_${codeParam || 'live'}`,
        isConnected: true,
      };
      loginWithSansCounts(userObj);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
      const newWishlist = exists ? prev.filter((i) => i !== id) : [...prev, id];
      
      const item = foodItems.find(f => f.id === id);
      showToast(exists ? 'Removed from favorites' : `Saved ${item ? item.name : 'item'} to favorites!`);

      // Sync wishlist item to Firestore
      const wishDocId = `${user.username || 'sanssiu'}_${id}`;
      setDoc(doc(db, 'wishlists', wishDocId), {
        username: user.username || 'sanssiu',
        foodId: id,
        createdAt: new Date().toISOString(),
      }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `wishlists/${wishDocId}`)
      );

      return newWishlist;
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

    // Save order to Firestore
    setDoc(doc(db, 'orders', newOrder.id), {
      ...newOrder,
      username: user.username || 'sanssiu',
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        setActiveTab('orders');
        showToast('🎉 Order placed and saved to Firestore!');
      })
      .catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`);
      });
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
        user,
        loginWithSansCounts,
        logout,
        triggerSansCountsAuth,
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
