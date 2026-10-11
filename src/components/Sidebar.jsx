import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  BarChart3, 
  Share2, 
  LogOut, 
  ShieldCheck,
  Radio,
  Menu,
  X,
  User,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, onLogout, ordersCount, pendingCount }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const navItems = [
    {
      id: 'orders',
      label: 'Customer Orders',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? `${pendingCount} pending` : `${ordersCount}`,
      badgeColor: pendingCount > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
    },
    {
      id: 'menu',
      label: 'Menu Catalog',
      icon: UtensilsCrossed,
      sublabel: 'View all dishes'
    },
    {
      id: 'analytics',
      label: 'Analytics & Revenue',
      icon: BarChart3,
      sublabel: 'Metrics & stats'
    },
    {
      id: 'social',
      label: 'Social Media Campaigns',
      icon: Share2,
      sublabel: 'Part B Automation'
    }
  ];

  const handleSelect = (tabId) => {
    onSelectTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. MOBILE TOP STICKY BAR (< md) */}
      {/* ============================================================ */}
      <header className="md:hidden sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between shadow-lg">
        {/* Mobile Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white tracking-tight leading-tight">Zaiqa Palace</h2>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-orange-400 font-semibold">Admin</span>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <Radio className="w-2 h-2 animate-pulse" />
                <span>Live Supabase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Actions: Current Tab Pill & Hamburger */}
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono border border-amber-500/30 animate-pulse">
              {pendingCount} new
            </span>
          )}

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-750 transition cursor-pointer border border-slate-700"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MOBILE DRAWER SLIDE-OVER (< md) */}
      {/* ============================================================ */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
          />

          {/* Drawer container */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl p-5 z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Top Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Zaiqa Palace</h3>
                    <p className="text-[11px] text-orange-400 font-medium">Operations Dashboard</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Navigation</p>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Info & Logout */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Admin Operator</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">admin@zaiqa.com</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. DESKTOP STICKY FIXED SIDEBAR (>= md) */}
      {/* ============================================================ */}
      <aside className="hidden md:flex md:sticky md:top-0 md:h-screen md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex-col shrink-0 overflow-y-auto no-scrollbar z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight">Zaiqa Palace</h2>
              <p className="text-[11px] text-orange-400 font-medium">Admin Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30" title="Connected to Supabase">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer (Fixed at bottom) */}
        <div className="p-4 border-t border-slate-800 space-y-3 shrink-0">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin Operator</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">admin@zaiqa.com</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
