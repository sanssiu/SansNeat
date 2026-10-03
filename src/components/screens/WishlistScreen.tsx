import React from 'react';
import { ChevronLeft, Heart, ShoppingBag, X, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const WishlistScreen: React.FC = () => {
  const { wishlist, foodItems, addToCart, toggleWishlist, setActiveTab } = useApp();

  const wishlistedItems = foodItems.filter((item) => wishlist.includes(item.id));

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F8F9FA] pb-32">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-white/95 backdrop-blur-xs border-b border-gray-100">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition cursor-pointer"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Favorites</h1>
        <div className="w-10" />
      </header>

      {/* Wishlist Items List */}
      <div className="flex-1 px-5 pt-4">
        {wishlistedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Your wishlist is empty</h2>
            <p className="text-xs text-gray-400 max-w-xs mb-6">
              Double click on any food item card on the home page to save your favorite dishes here.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3 bg-[#00C2FF] text-white text-sm font-bold rounded-full shadow-md shadow-[#00C2FF]/30 cursor-pointer"
            >
              Discover Food
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {wishlistedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100"
                />

                <div className="flex-1 flex flex-col justify-between h-20 py-0.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 transition cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#00C2FF]">
                      {item.price}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00C2FF] hover:bg-[#00a8dc] text-white rounded-xl text-xs font-bold active:scale-95 transition cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
