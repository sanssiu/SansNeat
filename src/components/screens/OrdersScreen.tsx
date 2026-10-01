import React, { useState } from 'react';
import { ChevronLeft, Receipt, Clock, CheckCircle2, Truck, Package, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Order } from '@/types';

export const OrdersScreen: React.FC = () => {
  const { orders, setActiveTab } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-[#0284C7] border border-sky-100">
            <Truck className="w-3 h-3" />
            In Transit
          </span>
        );
      case 'Preparing':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-3 h-3 animate-spin" />
            Preparing
          </span>
        );
    }
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
        <h1 className="text-lg font-bold text-gray-900">My Orders</h1>
        <div className="w-10" />
      </header>

      {/* Orders List */}
      <div className="flex-1 px-5 pt-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <Receipt className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">No orders found</h2>
            <p className="text-xs text-gray-400 max-w-xs mb-6">
              When you place an order, you can track its delivery status right here.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3 bg-[#00C2FF] text-white text-sm font-bold rounded-full shadow-md shadow-[#00C2FF]/30 cursor-pointer"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-3.5 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={order.image}
                  alt={order.id}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100"
                />

                <div className="flex-1 flex flex-col justify-between h-20 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-1">{order.items}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400">{order.date}</span>
                    <span className="text-sm font-bold text-[#00C2FF]">{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Order Details</span>
                <h3 className="text-lg font-bold text-gray-900">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-4">
              <img
                src={selectedOrder.image}
                alt="Order item"
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-700 font-semibold">{selectedOrder.items}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">{selectedOrder.date}</span>
                  <span className="text-sm font-bold text-[#00C2FF]">{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Delivery Timeline
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Order Confirmed</p>
                    <p className="text-[11px] text-gray-400">Kitchen received your order</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    selectedOrder.status !== 'Preparing' ? 'bg-emerald-500 text-white' : 'bg-[#00C2FF] text-white animate-pulse'
                  }`}>
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Prepared & Packed</p>
                    <p className="text-[11px] text-gray-400">Freshly made by top culinary chef</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    selectedOrder.status === 'Delivered' 
                      ? 'bg-emerald-500 text-white' 
                      : selectedOrder.status === 'In Transit' 
                        ? 'bg-[#00C2FF] text-white animate-bounce' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Out for Delivery</p>
                    <p className="text-[11px] text-gray-400">Courier on the way to your door</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-[#00C2FF] text-white font-bold rounded-xl shadow-md shadow-[#00C2FF]/30 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
