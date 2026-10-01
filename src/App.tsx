import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { CartScreen } from '@/components/screens/CartScreen';
import { OrdersScreen } from '@/components/screens/OrdersScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { WishlistScreen } from '@/components/screens/WishlistScreen';
import { BottomNav } from '@/components/BottomNav';
import { Smartphone, Monitor, CheckCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'wide'>('mobile');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start sm:py-6 selection:bg-[#00C2FF]/30">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 z-50 px-4 flex justify-center w-full pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 bg-gray-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-xl border border-white/10">
            <CheckCircle className="w-4 h-4 text-[#00C2FF] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Frame Width Switcher for Desktop */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 shadow-xs">
        <span className="text-gray-400 font-normal">View mode:</span>
        <button
          onClick={() => setDeviceFrame('mobile')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition ${
            deviceFrame === 'mobile'
              ? 'bg-[#00C2FF] text-white font-bold'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Mobile Frame
        </button>
        <button
          onClick={() => setDeviceFrame('wide')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition ${
            deviceFrame === 'wide'
              ? 'bg-[#00C2FF] text-white font-bold'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Full Width
        </button>
      </div>

      {/* Main Container Phone Frame / Responsive Canvas */}
      <main
        className={`w-full bg-white relative transition-all duration-300 ${
          deviceFrame === 'mobile'
            ? 'max-w-md sm:min-h-[844px] sm:rounded-[36px] sm:shadow-2xl sm:ring-1 sm:ring-gray-900/5 sm:border sm:border-gray-200'
            : 'max-w-4xl min-h-screen sm:rounded-2xl sm:shadow-md'
        } min-h-screen overflow-x-hidden`}
      >
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
