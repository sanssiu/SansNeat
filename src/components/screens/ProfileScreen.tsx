import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { setActiveTab, orders } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      action: () => setActiveModal('personal'),
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: ShoppingBag,
      badge: `${orders.length}`,
      action: () => setActiveTab('orders'),
    },
    {
      id: 'addresses',
      title: 'Addresses',
      icon: MapPin,
      action: () => setActiveModal('addresses'),
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: CreditCard,
      action: () => setActiveModal('payment'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      action: () => setActiveModal('settings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      action: () => setActiveModal('help'),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: LogOut,
      color: 'text-red-500',
      action: () => setActiveModal('logout'),
    },
  ];

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
        <h1 className="text-lg font-bold text-gray-900">Profile</h1>
        <div className="w-10" />
      </header>

      {/* User Info Header */}
      <div className="flex flex-col items-center pt-6 pb-6 px-5">
        <div className="relative mb-3">
          <img
            src="https://i.pravatar.cc/300"
            alt="Sophia Williams"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-[#00C2FF]/20 shadow-md"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sophia Williams</h2>
        <p className="text-xs text-gray-400 mt-0.5">sophia@gmail.com</p>
      </div>

      {/* Menu Items */}
      <div className="px-5 space-y-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:bg-gray-50 active:scale-99 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    item.color ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    item.color ? item.color : 'text-gray-800'
                  }`}
                >
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 bg-sky-50 text-[#00C2FF] font-bold text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Profile Detail Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900 capitalize">
                {activeModal === 'personal' && 'Personal Information'}
                {activeModal === 'addresses' && 'Delivery Addresses'}
                {activeModal === 'payment' && 'Payment Methods'}
                {activeModal === 'settings' && 'App Settings'}
                {activeModal === 'help' && 'Help & Support'}
                {activeModal === 'logout' && 'Confirm Logout'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {activeModal === 'personal' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-400">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Sophia Williams"
                    className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-400">Email Address</label>
                  <input
                    type="email"
                    defaultValue="sophia@gmail.com"
                    className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-400">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 019-2834"
                    className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            )}

            {activeModal === 'addresses' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-sky-50/50 border border-[#00C2FF]/30 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#00C2FF]">Home (Default)</span>
                    <p className="text-gray-600 mt-0.5">742 Evergreen Terrace, Springfield</p>
                  </div>
                  <Check className="w-4 h-4 text-[#00C2FF]" />
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="font-bold text-gray-800">Office</span>
                  <p className="text-gray-500 mt-0.5">100 Tech Boulevard, Suite 400</p>
                </div>
              </div>
            )}

            {activeModal === 'payment' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-gray-900 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm tracking-wider">•••• •••• •••• 4242</span>
                    <p className="text-gray-400 text-[10px] mt-1">Expires 12/28</p>
                  </div>
                  <span className="text-xs font-bold text-[#00C2FF]">Primary</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-800">Apple Pay / Google Pay</span>
                    <p className="text-gray-400 text-[10px]">Connected</p>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'settings' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Push Notifications</span>
                  <input type="checkbox" defaultChecked className="accent-[#00C2FF]" />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Dark Mode</span>
                  <span className="text-gray-400 text-[11px]">System</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Order Updates SMS</span>
                  <input type="checkbox" defaultChecked className="accent-[#00C2FF]" />
                </div>
              </div>
            )}

            {activeModal === 'help' && (
              <div className="space-y-2.5 text-xs text-gray-600">
                <p>Need assistance with your delivery or recent orders? We are here 24/7.</p>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold text-gray-800">Customer Helpline</span>
                  <p className="text-gray-500 mt-0.5">1-800-SANS-FOOD</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold text-gray-800">Support Email</span>
                  <p className="text-gray-500 mt-0.5">support@sansneat.com</p>
                </div>
              </div>
            )}

            {activeModal === 'logout' && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to log out of your SansNeat account?
                </p>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold rounded-xl shadow-md shadow-[#00C2FF]/30 cursor-pointer"
            >
              {activeModal === 'logout' ? 'Confirm' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
