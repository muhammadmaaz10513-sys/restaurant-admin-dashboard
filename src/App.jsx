import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Sidebar from './components/Sidebar';
import OrdersManager from './components/OrdersManager';
import MenuManager from './components/MenuManager';
import AnalyticsOverview from './components/AnalyticsOverview';
import SocialScheduler from './components/SocialScheduler';
import AdminLogin from './components/AdminLogin';
import { fetchAllOrders, updateOrderStatus, supabase } from './supabaseClient';
import { ShoppingBag, UtensilsCrossed, BarChart3, Share2 } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('zaiqa_standalone_admin_token') === 'true';
  });

  // Active Navigation Tab: 'orders' | 'menu' | 'analytics' | 'social'
  const [activeTab, setActiveTab] = useState('orders');

  // Orders State (fetched from Supabase)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load orders from Supabase
  const loadOrders = async () => {
    setLoading(true);
    const result = await fetchAllOrders();
    setLoading(false);
    if (result.success) {
      setOrders(result.data);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();

      // Setup Realtime listener on Supabase 'orders' table
      const channel = supabase
        .channel('admin-orders-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            console.log('Realtime Supabase update:', payload);
            loadOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  // Update order status in Supabase (Pending -> Preparing -> Delivered)
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);

    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setToastMessage(`Status updated to "${newStatus}" in Supabase!`);
      setTimeout(() => setToastMessage(null), 3500);

      if (newStatus === 'Delivered') {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        } catch (e) {}
      }
    } else {
      alert(`Could not update status: ${result.error}`);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('zaiqa_standalone_admin_token');
    setIsAuthenticated(false);
  };

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Responsive Fixed Sticky Sidebar on Desktop & Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        ordersCount={orders.length}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <OrdersManager
            orders={orders}
            loading={loading}
            onRefresh={loadOrders}
            onUpdateStatus={handleUpdateStatus}
            updatingId={updatingId}
          />
        )}

        {/* Tab 2: Menu Catalog (View Only) */}
        {activeTab === 'menu' && <MenuManager />}

        {/* Tab 3: Analytics & Overview */}
        {activeTab === 'analytics' && (
          <AnalyticsOverview
            orders={orders}
            onSelectTab={setActiveTab}
          />
        )}

        {/* Tab 4: Social Media Scheduler (Part B) */}
        {activeTab === 'social' && <SocialScheduler />}
      </main>

      {/* ============================================================ */}
      {/* MOBILE QUICK ACCESS BOTTOM NAVIGATION BAR (< md) */}
      {/* ============================================================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer relative ${
            activeTab === 'orders' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center font-mono">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'menu' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px]">Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'analytics' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'social' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px]">Social</span>
        </button>
      </nav>
    </div>
  );
}
