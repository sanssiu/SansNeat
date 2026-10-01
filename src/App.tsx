import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { CartScreen } from '@/components/screens/CartScreen';
import { OrdersScreen } from '@/components/screens/OrdersScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { WishlistScreen } from '@/components/screens/WishlistScreen';
import { BottomNav } from '@/components/BottomNav';
import { CheckCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-start selection:bg-[#00C2FF]/30">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 z-50 px-4 flex justify-center w-full pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 bg-gray-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-xl border border-white/10">
            <CheckCircle className="w-4 h-4 text-[#00C2FF] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container - Automatically responsive: full-width on mobile, desktop-sized on larger screens */}
      <main className="w-full max-w-4xl min-h-screen bg-white relative no-scrollbar sm:shadow-xs sm:border-x sm:border-gray-200/60 overflow-x-hidden">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'cart' && <CartScreen />}
        {activeTab === 'orders' && <OrdersScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'wishlist' && <WishlistScreen />}

        {/* Global Floating Pill Navigation */}
        <BottomNav />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
