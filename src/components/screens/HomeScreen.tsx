import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Heart, Plus, Bell, X, Star, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories, bannerImages } from '@/data/mockData';
import { FoodItem } from '@/types';

export const HomeScreen: React.FC = () => {
  const {
    foodItems,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setActiveTab,
    user,
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(10);
  const [selectedBanner, setSelectedBanner] = useState<number | null>(null);
  const [animatingHearts, setAnimatingHearts] = useState<Record<string, boolean>>({});

  const handleDoubleClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    toggleWishlist(itemId);
    setAnimatingHearts((prev) => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setAnimatingHearts((prev) => ({ ...prev, [itemId]: false }));
    }, 800);
  };

  // Filter food items based on category and search query and price
  const filteredFood = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = item.numericPrice <= maxPrice;
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [foodItems, selectedCategory, searchQuery, maxPrice]);

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Header */}
      <header className="flex items-center justify-between px-5 pt-8 pb-3">
        <button 
          onClick={() => setActiveTab('profile')} 
          className="relative rounded-full ring-2 ring-[#00C2FF]/30 hover:ring-[#00C2FF] transition cursor-pointer"
          aria-label="View Profile"
        >
          {user.isConnected && user.avatar ? (
            <img
              src={user.avatar}
              alt={user.firstName}
              className="w-11 h-11 rounded-full object-cover bg-sky-50"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <span className="text-xs font-bold text-gray-600">Guest</span>
            </div>
          )}
          <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${user.isConnected ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(true)}
            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-xs hover:bg-gray-50 active:scale-95 transition cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-800" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00C2FF] rounded-full animate-pulse"></span>
          </button>
        </div>
      </header>

      {/* Title Section (Left Aligned) */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
          Choose
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
          Your Favorite <span className="text-[#00C2FF]">Food</span>
        </h2>
      </div>

      {/* Search Bar & Filter */}
      <div className="flex items-center gap-3 px-5 mb-5">
        <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2.5 shadow-xs border border-gray-100 focus-within:border-[#00C2FF] transition">
          <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, burger, sandwich..."
            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center justify-center w-11 h-11 bg-[#00C2FF] rounded-full text-white shadow-md shadow-[#00C2FF]/30 active:scale-95 transition cursor-pointer shrink-0"
          aria-label="Filter Options"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 px-5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#00C2FF] text-white shadow-md shadow-[#00C2FF]/30 scale-102'
                    : 'bg-white text-gray-700 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Food Section */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Popular Food</h3>
        <button 
          onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(15); }}
          className="text-xs font-semibold text-[#00C2FF] hover:underline cursor-pointer"
        >
          See All
        </button>
      </div>

      {/* Food Grid / Cards */}
      <div className="px-5 mb-8">
        {filteredFood.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-gray-500 font-medium">No food items matched your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxPrice(10);
              }}
              className="mt-3 text-sm text-[#00C2FF] font-semibold underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredFood.map((item) => {
              const favorited = isWishlisted(item.id);
              return (
                <div
                  key={item.id}
                  onDoubleClick={(e) => handleDoubleClick(e, item.id)}
                  className="group relative bg-white rounded-2xl p-3 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between select-none"
                  title="Double click to favorite!"
                >
                  {/* Card Content & Click to open details */}
                  <div 
                    onClick={() => setSelectedFood(item)}
                    className="cursor-pointer"
                  >
                    <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-gray-100 mb-2.5 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Gentle heart status badge (Non-clickable) */}
                      {favorited && (
                        <div className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-[#00C2FF] shadow-xs">
                          <Heart className="w-3.5 h-3.5 fill-[#00C2FF] text-[#00C2FF]" />
                        </div>
                      )}

                      {/* Double click animated pop heart */}
                      {animatingHearts[item.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 z-20 pointer-events-none rounded-xl animate-fade-in">
                          <div className="animate-ping duration-300">
                            <Heart className="w-10 h-10 text-white fill-white drop-shadow-md" />
                          </div>
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                  </div>

                  {/* Card Bottom: Price and Add Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-gray-900">
                      {item.price}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center justify-center w-7 h-7 bg-[#00C2FF] hover:bg-[#00a8dc] text-white rounded-lg active:scale-90 transition shadow-xs cursor-pointer"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sans Preferred Section */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Sans Preferred</h3>
      </div>

      <div className="mb-6">
        <div className="flex gap-3.5 px-5 overflow-x-auto no-scrollbar py-2">
          {bannerImages.map((bannerUrl, index) => (
            <div
              key={index}
              onClick={() => setSelectedBanner(index)}
              className="relative w-[220px] h-[390px] rounded-[20px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-md shrink-0 cursor-pointer group hover:shadow-xl transition-all duration-300"
            >
              <img
                src={bannerUrl}
                alt={`Sans Preferred Reel Thumbnail ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="inline-block px-2.5 py-0.5 bg-[#00C2FF] text-white text-[10px] font-bold rounded-full w-max mb-1.5 shadow-xs">
                  FEATURED
                </span>
                <span className="text-sm font-bold leading-snug drop-shadow-sm">
                  Special Offer & Deal #{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Details Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-cyan-50 text-[#00C2FF] font-semibold text-xs rounded-full">
                {selectedFood.category}
              </span>
              <button
                onClick={() => setSelectedFood(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{selectedFood.name}</h3>
              <span className="text-xl font-bold text-[#00C2FF]">{selectedFood.price}</span>
            </div>

            <div className="flex items-center gap-1 mb-3 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-xs font-bold text-gray-700">{selectedFood.rating || 4.8}</span>
              <span className="text-xs text-gray-400 ml-1">(120+ reviews)</span>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {selectedFood.description}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  toggleWishlist(selectedFood.id);
                }}
                className={`flex items-center justify-center p-3 rounded-2xl border border-gray-200 cursor-pointer ${
                  isWishlisted(selectedFood.id) ? 'bg-red-50 text-red-500 border-red-200' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted(selectedFood.id) ? 'fill-red-500' : ''}`} />
              </button>
              <button
                onClick={() => {
                  addToCart(selectedFood);
                  setSelectedFood(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold rounded-2xl shadow-lg shadow-[#00C2FF]/30 active:scale-98 transition cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Add to Cart ({selectedFood.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Filter Menu</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                      selectedCategory === cat
                        ? 'bg-[#00C2FF] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Max Price
                </label>
                <span className="text-sm font-bold text-[#00C2FF]">${maxPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="0.5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full accent-[#00C2FF] cursor-pointer"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMaxPrice(10);
                }}
                className="py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-3 px-6 rounded-xl bg-[#00C2FF] text-white text-sm font-bold shadow-md shadow-[#00C2FF]/30 cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#00C2FF]" />
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#00C2FF]">Order Update</span>
                    <span className="text-[10px] text-gray-400">10m ago</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Order ORD-1024 is out for delivery! Driver is 5 mins away.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-600">Special Promo</span>
                    <span className="text-[10px] text-gray-400">2h ago</span>
                  </div>
                  <p className="text-xs text-gray-600">Enjoy 20% off on all Pepperoni Pizzas this week with code SANS20.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Selected Banner Offer Preview */}
      {selectedBanner !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-72">
              <img
                src={bannerImages[selectedBanner]}
                alt="Banner Deal"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedBanner(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <span className="px-2.5 py-0.5 bg-[#00C2FF] text-white text-xs font-bold rounded-full">
                Sans Preferred
              </span>
              <h4 className="text-lg font-bold text-gray-900 mt-2">Chef&apos;s Special Platter</h4>
              <p className="text-xs text-gray-600 mt-1 mb-4">
                Curated selection of our finest recipes made fresh with organic ingredients and artisan sauces.
              </p>
              <button
                onClick={() => {
                  addToCart(foodItems[0]);
                  setSelectedBanner(null);
                }}
                className="w-full py-3 bg-[#00C2FF] text-white font-bold rounded-xl shadow-md shadow-[#00C2FF]/30 cursor-pointer"
              >
                Add Special Deal to Cart ($9.99)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
