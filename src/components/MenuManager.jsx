import React, { useState, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Search, 
  Clock, 
  Star, 
  Layers 
} from 'lucide-react';
import { DEFAULT_CATEGORIES, INITIAL_DISHES } from '../data/initialMenuData';

export default function MenuManager() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...DEFAULT_CATEGORIES];

  const filteredDishes = useMemo(() => {
    return INITIAL_DISHES.filter((dish) => {
      const matchesCat = selectedCategory === 'All' || dish.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        dish.name.toLowerCase().includes(q) || 
        dish.category.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <UtensilsCrossed className="w-6 h-6 text-orange-400" />
          <span>Restaurant Menu Catalog</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          View all standard dishes, categories, pricing, badges, and prep times.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-750 transition shadow-lg overflow-hidden flex flex-col group"
          >
            {/* Image Container with Badges */}
            <div className="relative h-44 bg-slate-950 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {dish.badge && (
                  <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    {dish.badge}
                  </span>
                )}
                <span className="bg-slate-900/80 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-700/50">
                  {dish.spicyLevel}
                </span>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-orange-500/40 text-amber-400 font-extrabold px-3 py-1 rounded-xl text-xs shadow-lg font-mono">
                Rs. {dish.price} <span className="text-[10px] font-normal text-slate-400">PKR</span>
              </div>
            </div>

            {/* Dish Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="text-orange-400 font-medium">{dish.category}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{dish.prepTime}</span>
                    <span>•</span>
                    <span className="flex items-center text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                      {dish.rating}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                  {dish.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400">
                <span>● Active on Website</span>
                <span className="text-slate-500 font-mono">ID: {dish.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-slate-300 font-semibold text-sm">No dishes found</p>
          <p className="text-xs text-slate-500">No dishes match your search or filter.</p>
        </div>
      )}
    </div>
  );
}
