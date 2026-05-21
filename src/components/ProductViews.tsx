import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { MapPin, ShieldCheck, Heart, Star, Sparkles, Filter, SlidersHorizontal, Search, Eye, ShoppingCart, RefreshCw, ChevronRight } from 'lucide-react';

interface ProductViewsProps {
  products: Product[];
  selectedProductId: string | null;
  onSelectProduct: (id: string | null) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: Product[];
  activeCategoryFilter?: string;
}

export default function ProductViews({
  products,
  selectedProductId,
  onSelectProduct,
  onAddToCart,
  onAddToWishlist,
  wishlist,
  activeCategoryFilter = 'all'
}: ProductViewsProps) {
  // SHOP STATE FILTERING
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryFilter);
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [selectedStone, setSelectedStone] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [sortBy, setSortBy] = useState<string>('featured');

  // HD Zooom trigger state inside product details view
  const [zoomScale, setZoomScale] = useState(false);
  const [lensCoords, setLensCoords] = useState({ x: 50, y: 50 });

  // Active Details selected product
  const activeProduct = products.find((p) => p.id === selectedProductId);

  // Process filters
  const filteredProducts = products.filter((p) => {
    // Search matching
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.stone.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // Category matching
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    // Metal matching
    if (selectedMetal !== 'all' && !p.metal.toLowerCase().includes(selectedMetal.toLowerCase())) return false;
    // Stone matching
    if (selectedStone !== 'all' && !p.stone.toLowerCase().includes(selectedStone.toLowerCase())) return false;
    // Max price
    if (p.price > maxPrice) return false;
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.price - a.price; // default to value
  });

  const uniqueMetals = ['Gold', 'Platinum', 'Silver'];
  const uniqueStones = ['Emerald', 'Ruby', 'Sapphire', 'Diamond'];

  // Handle single inspection Details reset
  const handleBackToShop = () => {
    onSelectProduct(null);
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensCoords({ x, y });
  };

  const getGemstoneGlowClass = (stone: string) => {
    const s = stone.toLowerCase();
    if (s.includes('emerald')) return 'hover:border-emerald-500/40 hover:shadow-[0_15px_40px_rgba(16,185,129,0.12)]';
    if (s.includes('ruby')) return 'hover:border-red-500/40 hover:shadow-[0_15px_40px_rgba(239,68,68,0.12)]';
    if (s.includes('sapphire')) return 'hover:border-blue-500/40 hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)]';
    if (s.includes('diamond')) return 'hover:border-white/30 hover:shadow-[0_15px_40px_rgba(255,255,255,0.08)]';
    return 'hover:border-[#BF953F]/40 hover:shadow-[0_15px_40px_rgba(191,149,63,0.12)]';
  };

  const getGemstoneGlowBg = (stone: string) => {
    const s = stone.toLowerCase();
    if (s.includes('emerald')) return 'rgba(16, 185, 129, 0.1)';
    if (s.includes('ruby')) return 'rgba(239, 68, 68, 0.08)';
    if (s.includes('sapphire')) return 'rgba(59, 130, 246, 0.08)';
    if (s.includes('diamond')) return 'rgba(255, 255, 255, 0.08)';
    return 'rgba(212, 175, 55, 0.08)';
  };

  return (
    <div id="product-views-root" className="text-white bg-transparent min-h-[85vh] py-16 px-4 md:px-8 relative">
      {/* Background Soft Spotlight overlays */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-[#BF953F]/5 to-transparent filter blur-[120px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#000]/20 to-transparent filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!selectedProductId ? (
            /* SHOP PAGE LISTING */
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 text-left"
            >
              {/* Category Showcase Header Banner */}
              <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-tr from-[#0F0F0F] via-[#050505] to-[#12141C] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 bottom-0 top-0 w-[40%] opacity-20 pointer-events-none hidden lg:block border-l border-white/5">
                  <img
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600"
                    alt="Luxury Diamond Close Up"
                    className="w-full h-full object-cover filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
                </div>
                <div className="max-w-2xl z-20 relative space-y-4">
                  <span className="text-[10px] font-mono tracking-[0.45em] text-[#D4AF37] uppercase block">Consolidated Catalog</span>
                  <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight font-light leading-none">
                    The Sovereign <span className="text-gold-foil font-normal italic">Vaults</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-xl">
                    Explore peerless masterpieces across sovereign solid gold, platinum mounts, pigeon-blood Birman rubies, or VVS1 solitaires meticulously authenticated by elite global laboratory boards.
                  </p>
                </div>
              </div>

              {/* Advanced Filter Panel Section */}
              <div className="p-8 rounded-2xl card-glass border border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#BF953F]/20 to-transparent" />
                
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
                  {/* Search bar */}
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search GIA diamonds, 22K kundan necklaces..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-gray-500 focus:border-[#BF953F]/40 focus:ring-1 focus:ring-[#BF953F]/30 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Filter selects */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-xl p-3 px-4 pr-8 text-xs text-gray-300 focus:border-[#BF953F]/40 focus:outline-none appearance-none cursor-pointer min-w-[140px] transition-all"
                      >
                        <option value="all">All Ornaments</option>
                        <option value="gold">Gold Collections</option>
                        <option value="silver">Silver Collections</option>
                        <option value="diamond">Diamonds</option>
                        <option value="precious-stones">Gemstones</option>
                        <option value="bridal">Bridal Setups</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                    </div>

                    <div className="relative">
                      <select
                        value={selectedMetal}
                        onChange={(e) => setSelectedMetal(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-xl p-3 px-4 pr-8 text-xs text-gray-300 focus:border-[#BF953F]/40 focus:outline-none appearance-none cursor-pointer min-w-[120px] transition-all"
                      >
                        <option value="all">All Metals</option>
                        {uniqueMetals.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                    </div>

                    <div className="relative">
                      <select
                        value={selectedStone}
                        onChange={(e) => setSelectedStone(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-xl p-3 px-4 pr-8 text-xs text-gray-300 focus:border-[#BF953F]/40 focus:outline-none appearance-none cursor-pointer min-w-[130px] transition-all"
                      >
                        <option value="all">All Stones</option>
                        {uniqueStones.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                    </div>

                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-xl p-3 px-4 pr-8 text-xs text-gray-300 focus:border-[#BF953F]/40 focus:outline-none appearance-none cursor-pointer min-w-[140px] font-mono transition-all"
                      >
                        <option value="featured">Featured Order</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating Grade</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                    </div>
                  </div>
                </div>

                {/* Sub row Slider price limits */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-white/5 pt-5 gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Max limit budget:</span>
                    <span className="text-xs text-[#D4AF37] font-mono font-medium bg-[#D4AF37]/5 border border-[#D4AF37]/10 px-3 py-1 rounded-full">${maxPrice.toLocaleString()} limit</span>
                  </div>
                  <div className="w-full sm:w-1/2 flex items-center gap-4">
                    <input
                      type="range"
                      min="1500"
                      max="30000"
                      step="500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="flex-1 accent-[#D4AF37] h-[3px] bg-white/10 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-gray-500">$30K</span>
                  </div>
                </div>
              </div>

              {/* Masterpiece Grid results count */}
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-wider uppercase border-b border-white/5 pb-3">
                <span>Dossiers Discovered: {sortedProducts.length} items</span>
                <span>Exclusive Curator Access</span>
              </div>

              {/* Grid cards */}
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {sortedProducts.map((p) => {
                    const wishlisted = wishlist.some((w) => w.id === p.id);
                    return (
                      <div
                        key={p.id}
                        id={`shop-card-${p.id}`}
                        onClick={() => onSelectProduct(p.id)}
                        className={`card-glass p-4.5 rounded-2xl flex flex-col justify-between group text-left cursor-pointer transition-all duration-700 relative overflow-hidden ${getGemstoneGlowClass(p.stone)}`}
                      >
                        {/* Shimmer sweep container */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-[#BF953F]/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[40px] rounded-full pointer-events-none -z-10"
                          style={{
                            background: `radial-gradient(circle, ${getGemstoneGlowBg(p.stone)} 0%, transparent 70%)`,
                            width: '120%',
                            height: '120%',
                            top: '-10%',
                            left: '-10%'
                          }}
                        />

                        <div className="relative aspect-square overflow-hidden rounded-xl mb-4 border border-white/5 shadow-inner">
                          <img
                            referrerPolicy="no-referrer"
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-[1.2s] ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-500" />
                          
                          {/* Wishlist button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToWishlist(p);
                            }}
                            className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/90 text-white transition-all cursor-pointer border border-white/10 shadow-lg"
                          >
                            <Heart className={`w-3.5 h-3.5 transition-colors duration-300 ${wishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#D4AF37]">{p.metal}</span>
                            <span className="flex items-center text-[#D4AF37] text-xs font-mono"><Star className="w-3 h-3 fill-current mr-1" /> {p.rating}</span>
                          </div>
                          <h4 className="text-base font-serif font-semibold text-white tracking-tight truncate group-hover:text-gold-foil transition-colors duration-500">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-light leading-relaxed line-clamp-2">
                            {p.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5">
                          <span className="font-mono text-gold-foil font-bold text-base">${p.price.toLocaleString()}</span>
                          <span className="text-[9px] font-mono text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
                            SPEC SHEET <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-28 card-glass border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient(circle, rgba(212,175,55,0.02) 0%, transparent 80%) pointer-events-none" />
                  <SlidersHorizontal className="w-10 h-10 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
                  <h3 className="font-serif text-lg text-white mb-2">No Masterpieces Detected</h3>
                  <p className="text-xs font-light max-w-sm mx-auto text-gray-400 leading-relaxed">
                    Try broadening your budget limits or selecting general metals/stone configurations to find rare signature additions.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            /* PRODUCT DETAILS VIEW */
            activeProduct && (
              <motion.div
                key="product-details"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12 text-left"
              >
                {/* Micro breadcrumb bar */}
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase pb-4 border-b border-white/5">
                  <span className="hover:text-white transition-colors cursor-pointer" onClick={handleBackToShop}>Shop Vault</span>
                  <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer" onClick={() => { setSelectedCategory(activeProduct.category); onSelectProduct(null); }}>{activeProduct.category} Suite</span>
                  <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-white font-medium">{activeProduct.name}</span>
                </div>

                {/* Grid Split Content details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* Visual Gallery with Interactive Zoom control (col 5) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div
                      onMouseEnter={() => setZoomScale(true)}
                      onMouseLeave={() => setZoomScale(false)}
                      onMouseMove={handleImageMouseMove}
                      className="relative rounded-2xl border border-white/10 overflow-hidden aspect-square bg-[#080808] shadow-2xl group cursor-crosshair select-none"
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ease-out ${
                          zoomScale ? 'scale-175' : 'scale-100'
                        }`}
                        style={{
                          transformOrigin: `${lensCoords.x}% ${lensCoords.y}%`
                        }}
                      />
                      
                      {/* Loupe magnification overlay reticle */}
                      {zoomScale && (
                        <div 
                          className="absolute pointer-events-none w-20 h-20 border-2 border-[#D4AF37]/50 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-transparent -translate-x-10 -translate-y-10"
                          style={{
                            left: `${lensCoords.x}%`,
                            top: `${lensCoords.y}%`
                          }}
                        />
                      )}

                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-[8px] tracking-[0.2em] font-mono uppercase text-gray-300 shadow-md">
                        {activeProduct.purity} Gold
                      </div>
                      
                      {/* Live watermark spectrograph stamp overlay */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 opacity-90 border border-white/15 bg-black/80 backdrop-blur-md rounded-lg px-3 py-1.5 text-[8.5px] uppercase tracking-widest font-mono text-[#D4AF37] shadow-lg">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>Hologram Certified</span>
                      </div>
                    </div>
                    <p className="text-center text-[10px] text-gray-500 font-mono tracking-wider">
                      ★ Hover cursor over visual canvas to activate 1.75x high-fidelity zoom magnifier.
                    </p>
                  </div>

                  {/* Purchasing details metadata (col 7) */}
                  <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-3">
                      <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase block">
                        Specimen Card #{activeProduct.id.toUpperCase()}
                      </span>
                      <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-none">
                        {activeProduct.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4.5 pt-2">
                        <span className="text-3xl font-mono text-gold-foil font-bold">${activeProduct.price.toLocaleString()}</span>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <div className="flex text-amber-400 gap-0.5 items-center">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-xs text-white ml-1 font-mono">{activeProduct.rating} ({activeProduct.reviews.length} GIA reviews)</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-xs text-gray-300 font-mono bg-white/5 py-1 px-3.5 rounded-full border border-white/10">{activeProduct.metal}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed tracking-wide">
                      {activeProduct.longDescription}
                    </p>

                    {/* Authenticator specs box */}
                    <div className="p-6 rounded-2xl card-glass-premium border border-[#BF953F]/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full filter blur-xl pointer-events-none" />
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-4 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Authenticity Spectrum Certificate
                      </h4>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-mono">
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Gold/Metal Purity</p>
                          <p className="text-white text-sm font-serif">{activeProduct.purity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Hallmarking Tag</p>
                          <p className="text-[#D4AF37] text-sm font-serif flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> {activeProduct.hallmark}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Ornament Weight</p>
                          <p className="text-white text-sm font-serif">{activeProduct.weight}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Primary Gemstone</p>
                          <p className="text-white text-sm font-serif">{activeProduct.stone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Specifications detail list table */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Detailed Specifications</h4>
                      <div className="divide-y divide-white/5 border-t border-b border-white/5">
                        {Object.entries(activeProduct.specifications).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center py-3 text-xs">
                            <span className="text-gray-400 font-light">{key}</span>
                            <span className="font-mono text-white text-right font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons row */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      {/* Add to cart */}
                      <button
                        onClick={() => onAddToCart(activeProduct)}
                        className="flex-1 sm:flex-initial px-9 py-4 bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:brightness-110 text-black font-mono text-xs tracking-widest uppercase font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#BF953F]/15 active:scale-98 transition-all"
                      >
                        <ShoppingCart className="w-4 h-4 text-black" /> Secure Acquisition
                      </button>

                      {/* Add to Wishlist */}
                      <button
                        onClick={() => onAddToWishlist(activeProduct)}
                        className={`px-6 py-4 rounded-sm border font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                          wishlist.some((w) => w.id === activeProduct.id)
                            ? 'bg-red-950/20 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                            : 'bg-transparent border-white/10 hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <Heart className="w-4 h-4" /> Add to Portfolio
                      </button>

                      <button
                        onClick={handleBackToShop}
                        className="px-6 py-4 border border-white/10 hover:bg-white/5 rounded-sm font-mono text-xs tracking-wider uppercase text-gray-400 cursor-pointer"
                      >
                        Exit Suite
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Reviews Section */}
                <div className="pt-14 border-t border-white/5 space-y-8">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-serif text-white">Sovereign Client Reviews</h3>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Inspected Dossiers Only</span>
                  </div>

                  {activeProduct.reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeProduct.reviews.map((rev, i) => (
                        <div key={i} className="p-6 rounded-2xl card-glass border border-white/5 space-y-4 hover:border-white/10 transition-colors shadow-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-xs font-serif text-white font-medium">{rev.author}</h5>
                              <span className="text-[9px] font-mono text-gray-500">{rev.date}</span>
                            </div>
                            <div className="flex text-amber-400 gap-0.5">
                              {Array.from({ length: rev.rating }).map((_, rIdx) => (
                                <Star key={rIdx} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light italic">
                            &quot;{rev.comment}&quot;
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic py-6">
                      No client reviews have been registered for this ornament yet. Be the first to catalog your acquisition.
                    </p>
                  )}
                </div>

                {/* Related product slider showcase */}
                <div className="pt-14 border-t border-white/5 space-y-6">
                  <h3 className="text-xl md:text-2xl font-serif text-white">Aura Matching Compositions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {products
                      .filter((p) => p.id !== activeProduct.id && p.category === activeProduct.category)
                      .slice(0, 4)
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectProduct(p.id)}
                          className="card-glass p-4 border border-white/5 rounded-xl cursor-pointer hover:border-white/20 transition-all hover:-translate-y-1 duration-500 shadow-md group"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
                            <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700" />
                          </div>
                          <h5 className="text-xs text-white truncate font-serif font-medium group-hover:text-gold-foil transition-colors">{p.name}</h5>
                          <span className="text-[10px] font-mono text-[#D4AF37] font-semibold mt-1 block">${p.price.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
