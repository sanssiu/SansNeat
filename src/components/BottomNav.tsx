import React from 'react';
import { Home, Heart, ShoppingBag, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, wishlist } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav 
        className="pointer-events-auto flex items-center justify-between w-full max-w-sm px-6 py-3.5 rounded-full shadow-lg transition-transform duration-200"
        style={{
          backgroundColor: '#00C2FF',
          boxShadow: '0 8px 24px -2px rgba(0, 194, 255, 0.45)',
        }}
      >
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all cursor-pointer ${
            activeTab === 'home' ? 'scale-110 text-white' : 'text-white/80 hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {activeTab === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1"></span>}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all cursor-pointer ${
            activeTab === 'wishlist' ? 'scale-110 text-white' : 'text-white/80 hover:text-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-6 h-6 ${activeTab === 'wishlist' ? 'fill-white stroke-[2.5]' : 'stroke-2'}`} />
          {wishlist.length > 0 && activeTab !== 'wishlist' && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white" />
          )}
          {activeTab === 'wishlist' && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1"></span>}
        </button>

        {/* Cart */}
        <button
          onClick={() => setActiveTab('cart')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all cursor-pointer ${
            activeTab === 'cart' ? 'scale-110 text-white' : 'text-white/80 hover:text-white'
          }`}
          aria-label="Cart"
        >
          <ShoppingBag className={`w-6 h-6 ${activeTab === 'cart' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-[#00C2FF] bg-white rounded-full shadow-sm">
              {totalCartCount}
            </span>
          )}
          {activeTab === 'cart' && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1"></span>}
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all cursor-pointer ${
            activeTab === 'profile' ? 'scale-110 text-white' : 'text-white/80 hover:text-white'
          }`}
          aria-label="Profile"
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {activeTab === 'profile' && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1"></span>}
        </button>
      </nav>
    </div>
  );
};
