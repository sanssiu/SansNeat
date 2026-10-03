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
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { setActiveTab, orders, user, logout, triggerSansCountsAuth } = useApp();
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

      {/* When NOT logged in: Show ONLY the 1 single item: "Sign in with SansCounts" */}
      {!user.isConnected ? (
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#00C2FF] shadow-sm mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            SansCounts Account
          </h2>
          <p className="text-xs text-gray-400 max-w-xs mb-8 leading-relaxed">
            Please sign in with your SansCounts ID to access your profile, track active food deliveries, and manage orders.
          </p>

          {/* 1 Single Clean Action Button */}
          <button
            onClick={triggerSansCountsAuth}
            className="w-full max-w-xs py-4 px-6 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold text-sm rounded-2xl shadow-xl shadow-[#00C2FF]/30 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2.5"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Sign in with SansCounts</span>
          </button>
        </div>
      ) : (
        /* When Logged In: Show User Profile, Full Menu, and Logout */
        <>
          {/* User Info Header */}
          <div className="flex flex-col items-center pt-6 pb-6 px-5">
            <div className="relative mb-3">
              <img
                src={user.avatar || 'https://i.pravatar.cc/300'}
                alt={user.firstName}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-[#00C2FF]/30 shadow-md bg-sky-50"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">@{user.username}</p>
            {user.email && <p className="text-[11px] text-gray-400">{user.email}</p>}

            {/* Logout button */}
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-2 px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer border border-red-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
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
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 text-gray-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-0.5 font-bold text-xs rounded-full bg-sky-50 text-[#00C2FF]">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              );
            })}

            {/* Logout Row */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-between bg-white rounded-2xl p-4 border border-red-100 shadow-xs hover:bg-red-50/50 active:scale-99 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 text-red-500">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-red-500">Logout</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-300" />
            </button>
          </div>
        </>
      )}

      {/* Interactive Detail Modal (Only when logged in) */}
      {activeModal && user.isConnected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900 capitalize">
                {activeModal === 'personal' && 'Personal Information'}
                {activeModal === 'addresses' && 'Delivery Addresses'}
                {activeModal === 'payment' && 'Payment Methods'}
                {activeModal === 'settings' && 'App Settings'}
                {activeModal === 'help' && 'Help & Support'}
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
                    defaultValue={`${user.firstName} ${user.lastName}`}
                    className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-400">SansCounts ID</label>
                  <input
                    type="text"
                    disabled
                    value={`@${user.username}`}
                    className="w-full mt-1 p-2.5 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-400">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
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
                    <span className="font-semibold text-gray-800">SansPay / Card</span>
                    <p className="text-gray-400 text-[10px]">Connected via SansCounts</p>
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
                <p>Need assistance with your SansNeat delivery or SansCounts account? We are here 24/7.</p>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold text-gray-800">Support Helpline</span>
                  <p className="text-gray-500 mt-0.5">1-800-SANS-FOOD</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="font-bold text-gray-800">Email</span>
                  <p className="text-gray-500 mt-0.5">sanscounts@gmail.com</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold rounded-xl shadow-md shadow-[#00C2FF]/30 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
