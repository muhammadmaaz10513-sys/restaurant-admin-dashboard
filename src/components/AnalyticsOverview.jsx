import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

export default function AnalyticsOverview({ orders, onSelectTab }) {
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'Preparing').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const statCards = [
    {
      title: 'Total Revenue (COD)',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      sub: 'All orders gross value',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400'
    },
    {
      title: 'Total Orders Placed',
      value: orders.length,
      sub: 'Recorded in Supabase',
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400'
    },
    {
      title: 'Orders In Queue',
      value: pendingOrders,
      sub: 'Awaiting confirmation',
      icon: Clock,
      color: 'from-amber-500 to-yellow-600',
      textColor: 'text-amber-400'
    },
    {
      title: 'Cooking in Kitchen',
      value: preparingOrders,
      sub: 'Currently preparing',
      icon: ChefHat,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400'
    },
    {
      title: 'Delivered Successfully',
      value: deliveredOrders,
      sub: 'Completed orders',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400'
    },
    {
      title: 'Average Order Value',
      value: `Rs. ${avgOrderValue.toLocaleString()}`,
      sub: 'Per customer ticket',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Executive Analytics & Overview
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics calculated from your live Supabase database
        </p>
      </div>

      {/* 6 Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className={`text-2xl font-black ${stat.textColor} font-mono tracking-tight`}>
                  {stat.value}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Activity */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white">Recent Orders Stream</h3>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No orders recorded yet.</p>
        ) : (
          <div className="space-y-2.5">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{order.customer_name}</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      #{String(order.id).slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {order.items_summary || (Array.isArray(order.dishes) ? order.dishes.map(d=>d.name).join(', ') : 'Dishes')}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="font-bold text-amber-400 font-mono">
                    Rs. {Number(order.total).toLocaleString()} PKR
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : order.status === 'Preparing'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

