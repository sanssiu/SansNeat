import React, { useState } from 'react';
import { ChevronLeft, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const CartScreen: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, placeOrder, setActiveTab } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 1.50 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      placeOrder();
    }, 800);
  };

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
        <h1 className="text-lg font-bold text-gray-900">My Cart</h1>
        <div className="w-10" />
      </header>

      {/* Cart Content */}
      <div className="flex-1 px-5 pt-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Your cart is empty</h2>
            <p className="text-xs text-gray-400 max-w-xs mb-6">
              Looks like you haven&apos;t added any delicious food to your cart yet.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3 bg-[#00C2FF] hover:bg-[#00a8dc] text-white text-sm font-bold rounded-full shadow-md shadow-[#00C2FF]/30 active:scale-95 transition cursor-pointer"
            >
              Explore Food Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
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
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 -mt-1 -mr-1 transition cursor-pointer"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#00C2FF]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-2.5">
                        <button
                          onClick={() => updateQuantity(item.id, 'decrease')}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 min-w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 'increase')}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-[#00C2FF] text-white hover:bg-[#00a8dc] transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2.5 mt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Order Summary</h3>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-800">${deliveryFee.toFixed(2)}</span>
              </div>

              <div className="h-px bg-gray-100 my-2"></div>

              <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total</span>
                <span className="text-lg text-[#00C2FF]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-30 px-5 flex justify-center">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-gray-200 shadow-lg">
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold text-sm rounded-full shadow-md shadow-[#00C2FF]/30 active:scale-98 transition cursor-pointer disabled:opacity-80"
            >
              {isCheckingOut ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Order...</span>
                </div>
              ) : (
                <>
                  <span>Proceed to Checkout (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
