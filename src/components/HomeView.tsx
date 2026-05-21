import React, { useState, MouseEvent } from 'react';
import { PRODUCTS } from '../data';
import { Product, LuxePage } from '../types';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Sparkles, Star, Compass, Crown, Heart } from 'lucide-react';

interface HomeViewProps {
  onSelectProduct: (id: string) => void;
  onNavigate: (page: LuxePage) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function HomeView({ onSelectProduct, onNavigate, onAddToWishlist, wishlist }: HomeViewProps) {
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured);
  const trendingProducts = PRODUCTS.filter((p) => p.isTrending);

  // Mouse coords for interactive lighting spotlight
  const [mouseCoords, setMouseCoords] = useState({ x: 50, y: 50 });
  // Parallax offsets
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseCoords({ x, y });

    // Subtle parallax offset (-10px to +10px)
    const px = (e.clientX - rect.left - rect.width / 2) * 0.015;
    const py = (e.clientY - rect.top - rect.height / 2) * 0.015;
    setParallaxOffset({ x: px, y: py });
  };

  const testimonials = [
    { name: 'Duchess Maria V.', quote: 'Luxeora delivers not just standard ornaments, but physical pieces of history that command respect. The Mughal Emerald Choker is breathtaking.' },
    { name: 'Dr. Kabir Sen', quote: 'Finding authentic Certified solitaires with immutable tracking was a delight. Simply the Cartier of the digital era.' },
    { name: 'Charlotte Rousseau', quote: 'The unboxing experience was emotionally rich. The customized ribbon wrapping and handwritten card made it an unforgettable anniversary.' }
  ];

  return (
    <div id="home-view-root" className="text-white bg-[#030303] font-sans pb-24 overflow-hidden relative">
      
      {/* Gemstone Ambient Glows around page */}
      <div className="absolute top-[800px] left-[-200px] w-[500px] h-[500px] rounded-full blur-glow-emerald animate-glow-pulse pointer-events-none opacity-40" />
      <div className="absolute top-[1800px] right-[-200px] w-[600px] h-[600px] rounded-full blur-glow-ruby animate-glow-pulse pointer-events-none opacity-30" />
      <div className="absolute top-[2800px] left-[-300px] w-[700px] h-[700px] rounded-full blur-glow-gold animate-glow-pulse pointer-events-none opacity-40" />

      {/* Cinematic Fullscreen Hero Section */}
      <section 
        className="relative h-[95vh] flex items-center justify-center overflow-hidden cursor-default select-none border-b border-white/5"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic scale image background as video alternative */}
        <div className="absolute inset-0 z-0">
          <motion.img
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=1500"
            alt="Luxeora Majestic Ring Backdrop"
            className="w-full h-full object-cover opacity-30 filter brightness-50 scale-105"
            style={{
              x: parallaxOffset.x * -1,
              y: parallaxOffset.y * -1,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 100 }}
          />
          {/* Multi-layered dark and lighting gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" />
          
          {/* Interactive Mouse-chasing Spotlight overlay */}
          <div 
            className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle 350px at ${mouseCoords.x}% ${mouseCoords.y}%, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)`
            }}
          />
        </div>

        {/* Floating golden particle circles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-[18%] left-[12%] w-80 h-80 rounded-full bg-[#D4AF37]/5 filter blur-3xl animate-pulse" />
          <div className="absolute bottom-[22%] right-[18%] w-[450px] h-[450px] rounded-full bg-[#D4AF37]/3 filter blur-3xl animate-pulse" />
        </div>

        {/* Hero Typography & CTAs */}
        <div className="relative z-20 text-center max-w-4xl px-4 mt-8">
          <motion.span
            className="text-[10px] font-mono tracking-[0.55em] text-[#D4AF37] uppercase block mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Sovereign Craftsmanship Since 1886
          </motion.span>
          
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gold-foil">Crafted Brilliance.</span> <br />
            <span className="italic text-white font-light">Timeless Luxury.</span>
          </motion.h1>

          <motion.p
            className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto mb-12 leading-relaxed tracking-wider font-sans opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
          >
            Welcome to the digital palace of elite jewelry. Explore certified solitaires, sovereign gold harams, and Zambian emeralds paired with digital unboxing and 360° virtual showroom walkovers.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-black font-mono text-[11px] tracking-widest uppercase font-bold rounded-sm hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-lg shadow-[#BF953F]/15"
            >
              Acquire Masterpieces
            </button>
            <button
              onClick={() => onNavigate('showroom')}
              className="w-full sm:w-auto px-9 py-4 border border-[#BF953F]/40 text-white font-mono text-[11px] tracking-widest uppercase rounded-sm bg-black/30 hover:bg-[#BF953F]/10 hover:border-[#BF953F] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#BF953F] animate-spin-slow" /> Enter 360° Lounge
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Row */}
      <section className="bg-[#020202] border-b border-white/5 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-2xl font-mono text-gold-foil font-bold block">100%</span>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400">BIS 916 Hallmarked Gold</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-mono text-gold-foil font-bold block">GIA / IGI</span>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400">Certified Solitaires</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-mono text-gold-foil font-bold block">Secure</span>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400">Armored Guard Logistics</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-mono text-gold-foil font-bold block">Lifetime</span>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400">Anti-Tarnish Assurances</p>
          </div>
        </div>
      </section>

      {/* Featured Masterworks Carousel Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center">
        <span className="text-[10px] font-mono tracking-[0.5em] text-[#D4AF37] uppercase block mb-2">The Crown Selection</span>
        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight mt-1 mb-16">Featured Masterpieces</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredProducts.map((p) => {
            const hasWishlisted = wishlist.some((w) => w.id === p.id);
            return (
              <div
                key={p.id}
                id={`featured-card-${p.id}`}
                onClick={() => onSelectProduct(p.id)}
                className="card-glass-premium rounded-2xl p-5 flex flex-col justify-between group text-left cursor-pointer hover:border-[#D4AF37]/50 transition-all duration-700 hover:shadow-[0_15px_45px_rgba(212,175,55,0.06)] hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Micro reflection lines overlay on card hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-[#BF953F]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative aspect-square overflow-hidden rounded-xl mb-5 border border-white/5">
                  <img
                    referrerPolicy="no-referrer"
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:bg-black/0 transition-all duration-500" />
                  
                  {/* Hearts action button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(p);
                    }}
                    className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/90 text-white transition-all cursor-pointer border border-white/10"
                  >
                    <Heart className={`w-4 h-4 transition-colors duration-300 ${hasWishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#D4AF37]">{p.metal}</span>
                      <span className="flex items-center text-[#D4AF37] text-xs font-mono"><Star className="w-3 h-3 fill-current mr-1" /> {p.rating}</span>
                    </div>
                    <h3 className="text-lg font-serif text-white mb-3 font-semibold tracking-wide truncate transition-colors group-hover:text-gold-foil">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed mb-6">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                    <span className="font-mono text-gold-foil font-bold text-xl">${p.price.toLocaleString()}</span>
                    <button className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors">
                      Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cinematic Bridal Showcase Banner */}
      <section className="relative my-16 py-28 bg-gradient-to-r from-red-950/30 via-black to-[#0F0A0B] border-y border-white/5 overflow-hidden">
        {/* Soft atmospheric red light overlay */}
        <div className="absolute top-0 right-0 w-[400px] h-full bg-red-500/5 filter blur-3xl pointer-events-none" />
        
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden md:block border-l border-white/5">
          <img
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
            alt="Traditional Bridal Setup"
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl text-left space-y-6">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#D4AF37]" /> Royal Wedding Vaults
            </span>
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight text-white">
              The Sovereign <br />
              <span className="text-gold-foil italic font-light">Bridal Collections</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed font-light opacity-90">
              Adorn your matrimonial milestone with royal heritage jewelry designs. Our Bridal collections include ancient Kundan harams, Colombian emerald encrusted chokers, and multi-tier crowns compiled exclusively by royal decree.
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('bridal')}
                className="px-8 py-3.5 bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] transition-all font-mono text-[10px] tracking-widest uppercase cursor-pointer"
              >
                Inspect Bridal Range
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Quick mini display cards */}
            <div 
              onClick={() => onSelectProduct('luxe-01')}
              className="w-48 card-glass p-3.5 rounded-xl border border-white/5 space-y-3 cursor-pointer group hover:border-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-500 shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=200"
                  alt="Imperial Choker"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h5 className="text-[11px] font-serif truncate text-white group-hover:text-gold-foil transition-colors">Mughal Emerald Choker</h5>
                <span className="text-[10px] font-mono text-[#D4AF37]">$18,400</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Jewelry Gallery Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-14">
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase block mb-1">VOGUE SELECTIONS</span>
            <h2 className="text-2xl md:text-4xl font-serif text-white tracking-tight mt-1">Trending Masterpieces</h2>
          </div>
          <button onClick={() => onNavigate('shop')} className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-gold-foil tracking-widest uppercase hover:text-white transition-colors cursor-pointer">
            Expand Shop Vault ➔
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p.id)}
              className="card-glass border border-white/5 rounded-xl p-4 flex flex-col justify-between group cursor-pointer hover:border-white/20 hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] transition-all duration-500"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4 border border-white/5">
                <img
                  referrerPolicy="no-referrer"
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-out"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-[8px] font-mono tracking-widest text-[#D4AF37] px-2 py-0.5 rounded-sm uppercase border border-white/5">
                  Trending
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-serif text-white truncate font-medium group-hover:text-gold-foil transition-colors">{p.name}</h4>
                <p className="text-[9px] font-mono text-gray-500">{p.stone}</p>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4">
                <span className="text-xs sm:text-sm font-mono text-gold-foil font-bold">${p.price.toLocaleString()}</span>
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider">BIS certified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Heritage Story Banner */}
      <section className="py-24 bg-[#020202] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 80%) pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.5em] text-[#D4AF37] uppercase block">OUR LEGACY</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">The Luxeora Lineage</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light font-sans max-w-2xl mx-auto opacity-90">
            Founded initially inside Parisian diamond ateliers in 1886, Luxeora remains coordinated with standard ancient hand-filigree artisans and ethical GIA-inspected solitaire extractors to ensure the purity of every gem set on platinum cuffs. We do not design simple products – we forge legendary emotional emblems.
          </p>
          <div className="pt-3">
            <button
              onClick={() => onNavigate('stories')}
              className="px-8 py-3 border border-white/10 hover:border-white rounded-sm text-[10px] font-mono uppercase tracking-widest text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Read Artisanal Sagas
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Column Slider */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase block mb-2">CLIENT TRIBUTES</span>
        <h3 className="text-2xl sm:text-3xl font-serif text-white mb-16">What Devotees Proclaim</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="p-7 rounded-2xl card-glass border border-white/5 text-left flex flex-col justify-between hover:border-white/10 transition-colors duration-500 shadow-md">
              <p className="text-xs sm:text-sm italic text-gray-300 leading-relaxed font-light">
                &quot;{test.quote}&quot;
              </p>
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/5 justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white font-medium">{test.name}</span>
                <span className="flex text-[#D4AF37] gap-0.5"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter signup row */}
      <section className="bg-black py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020202] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.45em] text-[#D4AF37] uppercase block">EXCLUSIVITIES LIST</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white">Aura Chronicles Newsletter</h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light max-w-md mx-auto">
            Receive private notifications of upcoming limited solitaire clearances and private showroom appointments.
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              className="flex-1 bg-zinc-900/60 border border-white/10 focus:ring-1 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] rounded-sm px-4 py-3 text-xs text-white"
              placeholder="Enter your refined email account..."
            />
            <button className="bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-black font-mono text-[10px] font-semibold px-8 py-3 tracking-widest uppercase rounded-sm hover:brightness-110 active:scale-98 transition-all cursor-pointer" onClick={() => alert('Sovereign welcome message dispatched to your account.')}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
