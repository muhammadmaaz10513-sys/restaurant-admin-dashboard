import React, { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChefHat, 
  AlertCircle, 
  ExternalLink,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';

export default function OrdersManager({ orders, loading, onRefresh, onUpdateStatus, updatingId }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch =
      order.customer_name?.toLowerCase().includes(q) ||
      order.customer_phone?.toLowerCase().includes(q) ||
      order.customer_address?.toLowerCase().includes(q) ||
      order.items_summary?.toLowerCase().includes(q) ||
      String(order.id).toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const copyReceipt = (order) => {
    const text = `🍽️ ORDER #${String(order.id).slice(0, 8)}
Customer: ${order.customer_name}
Phone: ${order.customer_phone}
Address: ${order.customer_address}
Dishes: ${order.items_summary || JSON.stringify(order.dishes)}
Total: Rs. ${Number(order.total).toLocaleString()} PKR (COD)
Status: ${order.status}`;

    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Customer Orders Management
          </h1>
          <p className="text-xs text-slate-400">
            Real-time Supabase sync • Live status updater (Pending → Preparing → Delivered)
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Orders'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Preparing', label: 'Preparing' },
            { id: 'Delivered', label: 'Delivered' }
          ].map((tab) => {
            const count = tab.id === 'all' 
              ? orders.length 
              : orders.filter((o) => o.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-black/25 px-1.5 py-0.2 rounded-full font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, Ref ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-400" />
          <span>Connecting to Supabase and fetching live orders...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-slate-300 font-semibold text-sm">No orders found</p>
          <p className="text-xs text-slate-500">
            {orders.length === 0
              ? 'No orders received yet in Supabase.'
              : 'No orders match your filter/search criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4 hover:border-slate-750 transition shadow-lg"
              >
                {/* Top Row: Customer Info, Time, Ref ID, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white">
                        {order.customer_name}
                      </h3>
                      <span className="font-mono text-xs bg-slate-950 px-2 py-0.5 rounded text-orange-400 font-bold border border-slate-800">
                        Ref: #{String(order.id).slice(0, 8)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-orange-400" />
                        <a href={`tel:${order.customer_phone}`} className="hover:underline font-mono">
                          {order.customer_phone}
                        </a>
                        <a
                          href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5"
                          title="Message on WhatsApp"
                        >
                          <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
                        </a>
                      </div>

                      <span>•</span>

                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {new Date(order.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Copy Receipt Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyReceipt(order)}
                      className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                      title="Copy receipt summary"
                    >
                      {copiedId === order.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[11px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : order.status === 'Preparing'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      ● {order.status}
                    </span>
                  </div>
                </div>

                {/* Middle: Dishes & Delivery Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 text-xs">
                  <div className="md:col-span-7 space-y-1.5">
                    <p className="font-semibold text-slate-400 text-[11px]">Items Ordered:</p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200">
                      {order.items_summary || (
                        Array.isArray(order.dishes) 
                          ? order.dishes.map((d) => `${d.name} (x${d.quantity})`).join(', ')
                          : JSON.stringify(order.dishes)
                      )}
                    </div>
                    {order.notes && (
                      <p className="text-[11px] text-amber-400/90 italic pt-0.5">
                        Instructions: "{order.notes}"
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-5 space-y-1.5">
                    <p className="font-semibold text-slate-400 text-[11px]">Delivery Address:</p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{order.customer_address}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Total Bill & Live Status Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">Total Bill (COD):</span>
                    <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                      Rs. {Number(order.total).toLocaleString()} PKR
                    </span>
                  </div>

                  {/* Status Stepper Controls: Pending -> Preparing -> Delivered */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Change Status:</span>

                    <button
                      onClick={() => onUpdateStatus(order.id, 'Pending')}
                      disabled={isUpdating || order.status === 'Pending'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'Pending'
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 cursor-default'
                          : 'bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-750'
                      }`}
                    >
                      {isUpdating && order.status !== 'Pending' ? '...' : 'Pending'}
                    </button>

                    <button
                      onClick={() => onUpdateStatus(order.id, 'Preparing')}
                      disabled={isUpdating || order.status === 'Preparing'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'Preparing'
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 cursor-default'
                          : 'bg-slate-800 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 border border-slate-750'
                      }`}
                    >
                      {isUpdating && order.status !== 'Preparing' ? '...' : 'Preparing'}
                    </button>

                    <button
                      onClick={() => onUpdateStatus(order.id, 'Delivered')}
                      disabled={isUpdating || order.status === 'Delivered'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 cursor-default'
                          : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-750'
                      }`}
                    >
                      {isUpdating && order.status !== 'Delivered' ? '...' : 'Delivered'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

