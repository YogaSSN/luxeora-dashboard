import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../contexts/DataContext';
import { Product, ShowroomZone } from '../types';
import { Compass, Sparkles, Orbit, ShoppingBag, Eye, Heart, ArrowRight } from 'lucide-react';

const getHotspotTheme = (prod?: Product) => {
  if (!prod) return { bg: 'bg-[#D4AF37]', glow: 'rgba(212,175,55,0.6)', border: 'border-[#D4AF37]' };
  const name = prod.name.toLowerCase();
  const stone = (prod.stone || '').toLowerCase();
  if (stone.includes('emerald') || name.includes('emerald')) {
    return { bg: 'bg-emerald-400', glow: 'rgba(52,211,153,0.8)', border: 'border-emerald-400' };
  }
  if (stone.includes('ruby') || name.includes('ruby')) {
    return { bg: 'bg-rose-500', glow: 'rgba(244,63,94,0.8)', border: 'border-rose-500' };
  }
  if (stone.includes('sapphire') || name.includes('sapphire')) {
    return { bg: 'bg-sky-400', glow: 'rgba(56,189,248,0.8)', border: 'border-sky-400' };
  }
  if (stone.includes('diamond') || name.includes('diamond') || name.includes('solitaire') || name.includes('tiara')) {
    return { bg: 'bg-white', glow: 'rgba(255,255,255,0.8)', border: 'border-white' };
  }
  return { bg: 'bg-[#D4AF37]', glow: 'rgba(212,175,55,0.8)', border: 'border-[#D4AF37]' };
};

interface VirtualShowroomProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function VirtualShowroom({
  products,
  onSelectProduct,
  onAddToWishlist,
  wishlist
}: VirtualShowroomProps) {
  const { showroomZones: SHOWROOM_ZONES } = useData();
  const [activeZoneId, setActiveZoneId] = useState<string>('diamond');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedProductPreview, setSelectedProductPreview] = useState<Product | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const startAngleRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeZone = SHOWROOM_ZONES.find((z) => z.id === activeZoneId) || SHOWROOM_ZONES[0];

  // Random floating gold particles
  const [particles] = useState(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 4
    }))
  );

  // Mouse drag handles
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // 1px translates to 0.5 degrees
    const nextAngle = (startAngleRef.current - deltaX * 0.5) % 360;
    setRotationAngle(nextAngle < 0 ? nextAngle + 360 : nextAngle);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch swipe handles
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    const nextAngle = (startAngleRef.current - deltaX * 0.5) % 360;
    setRotationAngle(nextAngle < 0 ? nextAngle + 360 : nextAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Rotate camera by 1 degree on an idle animation loop
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.15) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <div id="virtual-showroom-container" className="text-white min-h-[85vh] bg-[#050505] py-12 px-4 relative overflow-hidden">
      {/* Dynamic Background Ambiance Overlay */}
      <div
        className="absolute inset-0 transition-all duration-1000 opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${activeZone.bgHex} 0%, rgba(3,3,3,1) 75%)`
        }}
      />
      
      {/* Auxiliary Ambient gemstone glow spotlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-25 filter blur-[100px] pointer-events-none transition-all duration-1000"
        style={{
          background: activeZoneId === 'diamond' 
            ? 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)'
            : activeZoneId === 'gold'
            ? 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)'
            : activeZoneId === 'bridal'
            ? 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(239,68,68,0.05) 50%, transparent 70%)'
        }}
      />

      {/* Floating Gold Dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-[#D4AF37] rounded-full opacity-35 filter blur-[0.5px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.15, 0.45, 0.15]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Heading */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono tracking-[0.4em] text-[#D4AF37] uppercase flex items-center justify-center gap-2">
            <Orbit className="w-4 h-4 animate-spin-slow" /> 360° Immersive Palace
          </span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mt-2 text-white">
            Grand Virtual Showroom
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-400 mt-3 font-light leading-relaxed">
            Drag left or right to sweep your sightline across our signature pillars. Press glowing gemstones to reveal floating product vaults.
          </p>
        </div>

        {/* Showroom Zones Switcher Tab */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {SHOWROOM_ZONES.map((zone) => {
            const isActive = activeZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => {
                  setActiveZoneId(zone.id);
                  setSelectedProductPreview(null);
                  setRotationAngle(0);
                }}
                className={`px-6 py-3 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-500 flex items-center gap-2 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-gold-foil text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.35)] border-transparent'
                    : 'card-glass text-gray-300 border-white/5 hover:border-[#D4AF37]/35 hover:text-white'
                }`}
              >
                {/* Subtle shine sweep inside active button */}
                {isActive && (
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                )}
                {zone.id === 'diamond' && <Sparkles className="w-3.5 h-3.5" />}
                {zone.id === 'gold' && <Orbit className="w-3.5 h-3.5" />}
                {zone.id === 'bridal' && <Heart className="w-3.5 h-3.5" />}
                {zone.id === 'stones' && <Sparkles className="w-3.5 h-3.5" />}
                <span>{zone.name}</span>
              </button>
            );
          })}
        </div>

        {/* Showroom Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Panoramic Simulation Box */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-black rounded-3xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-500 cursor-grab active:cursor-grabbing select-none shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(0,0,0,0.95)]"
            >
              {/* Virtual Spotlights & Pillars Backdrop depending on rotationAngle */}
              <div
                className="absolute inset-0 w-[300%] h-full flex transition-transform duration-300 ease-out select-none"
                style={{
                  transform: `translateX(${-((rotationAngle / 360) * 100) / 3}%)`,
                  backgroundImage: `url('${activeZone.imageUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Visual shadow overlay inside the panorama */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />
              </div>

              {/* Holographic Hotspots relative to angle */}
              <AnimatePresence>
                {activeZone.hotspots.map((hs) => {
                  // Standard coordinate 0-100 shifted horizontally based on rotation offset
                  const baseOffset = hs.x;
                  // For a circular feel, hotspots map to 360 deg.
                  // Angle maps 1 to 1.
                  const hsAngle = (hs.x / 100) * 360;
                  const diffAngle = (hsAngle - rotationAngle + 540) % 360 - 180;

                  // Show if hotspot is within standard 90 deg field of view
                  const isVisible = Math.abs(diffAngle) < 95;
                  
                  // Project perspective X coordinate
                  const projectedX = 50 + (diffAngle / 90) * 50;

                  if (!isVisible) return null;

                  const prod = products.find((p) => p.id === hs.productId);
                  const theme = getHotspotTheme(prod);

                  return (
                    <motion.button
                      key={hs.id}
                      onClick={() => {
                        if (prod) {
                          setSelectedProductPreview(prod);
                        }
                      }}
                      className="absolute z-30 group cursor-pointer"
                      style={{
                        left: `${projectedX}%`,
                        top: `${hs.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.15 }}
                    >
                      {/* Concentric Luxury Rings */}
                      <span 
                        className={`absolute w-8 h-8 rounded-full border border-dashed animate-spin-slow opacity-60 -left-2 -top-2 ${theme.border}`}
                        style={{ animationDuration: '8s' }}
                      />
                      <span className={`absolute w-6 h-6 rounded-full border opacity-30 animate-pulse -left-1 -top-1 ${theme.border}`} />
                      
                      {/* Glowing Aura */}
                      <div 
                        className={`absolute w-4 h-4 rounded-full filter blur-[4px] opacity-80 -left-0 -top-0 ${theme.bg}`}
                        style={{ boxShadow: `0 0 10px 4px ${theme.glow}` }}
                      />

                      {/* Central Jewel */}
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border border-white/30 shadow-lg relative ${theme.bg}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
                      </div>

                      {/* Tooltip Overlay */}
                      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 card-glass border border-gold-foil/30 px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-40 pointer-events-none">
                        <div className="text-gray-300 font-light flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#D4AF37] animate-pulse" />
                          {hs.title}
                        </div>
                        <div className="text-[#D4AF37] font-semibold mt-0.5">{hs.price}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {/* Foreground Center HUD overlay */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-[#D4AF37]/20 px-6 py-2.5 rounded-full pointer-events-none shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {/* Outer rotating dial dots */}
                  <div className="absolute inset-0 border border-dotted border-[#D4AF37]/35 rounded-full animate-spin-slow" />
                  {/* Inner compass arrow rotating with user navigation angle */}
                  <motion.div 
                    style={{ rotate: -rotationAngle }}
                    className="text-[#D4AF37] flex items-center justify-center"
                  >
                    <Compass className="w-4 h-4 stroke-[1.5]" />
                  </motion.div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#D4AF37]/60 uppercase">CHRONO SCANNER</span>
                  <span className="font-mono text-xs tracking-widest text-white font-medium">
                    RADAR: <span className="text-[#D4AF37]">{Math.round(rotationAngle)}°</span> N
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction footnote */}
            <div className="text-center mt-3 text-xs text-gray-500 font-mono">
              ★ Active Zone: {activeZone.description}
            </div>
          </div>

          {/* Interactive Inspection Desk side-panel */}
          <div className="lg:col-span-4 card-glass-premium rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#D4AF37]/15">
            {/* Background glowing gradient accents */}
            <div className="absolute top-0 right-0 w-32 h-32 blur-glow-gold opacity-30 pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="pb-4 border-b border-white/10 mb-5">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase block">
                    Exhibition Table
                  </span>
                  <h3 className="text-xl font-serif text-white tracking-tight mt-1">Masterpiece Spectrometry</h3>
                </div>

                <AnimatePresence mode="wait">
                  {selectedProductPreview ? (
                    <motion.div
                      key={selectedProductPreview.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="flex flex-col gap-4 text-left"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-white/10 shadow-2xl">
                        <img
                          referrerPolicy="no-referrer"
                          src={selectedProductPreview.image}
                          alt={selectedProductPreview.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                          <div>
                            <span className="bg-black/60 backdrop-blur-md text-[9px] uppercase font-mono px-2.5 py-1 rounded tracking-widest text-[#D4AF37] border border-[#D4AF37]/25">
                              {selectedProductPreview.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-serif text-white tracking-tight leading-snug">
                          {selectedProductPreview.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-lg font-mono text-gold-foil font-semibold">
                            ${selectedProductPreview.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase border border-white/10 px-2 py-0.5 rounded">
                            {selectedProductPreview.metal}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        {selectedProductPreview.description}
                      </p>

                      <table className="w-full text-[11px] font-mono border-t border-white/10 mt-2">
                        <thead>
                          <tr className="border-b border-white/10 text-left">
                            <th className="py-2 text-gray-400 font-serif text-[11px] tracking-widest font-normal uppercase">Spec Attribute</th>
                            <th className="py-2 text-right text-gray-400 font-serif text-[11px] tracking-widest font-normal uppercase">Certification Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5">
                            <td className="py-2.5 text-gray-400 font-serif text-xs italic tracking-wider">Hallmark Standard</td>
                            <td className="py-2.5 text-right font-mono text-[10px] text-gray-200">{selectedProductPreview.hallmark}</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-2.5 text-gray-400 font-serif text-xs italic tracking-wider">Net Weight</td>
                            <td className="py-2.5 text-right font-mono text-[10px] text-[#D4AF37]">{selectedProductPreview.weight}</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-2.5 text-gray-400 font-serif text-xs italic tracking-wider">Material Purity</td>
                            <td className="py-2.5 text-right font-mono text-[10px] text-gray-200">{selectedProductPreview.purity}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {/* Detailed View CTA */}
                        <button
                          onClick={() => onSelectProduct(selectedProductPreview.id)}
                          className="flex items-center justify-center gap-2 bg-gold-foil text-black rounded-xl py-3 text-xs font-mono tracking-widest uppercase transition-all duration-300 font-semibold cursor-pointer hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        >
                          Inspect <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Add to Wishlist */}
                        <button
                          onClick={() => onAddToWishlist(selectedProductPreview)}
                          className={`flex items-center justify-center gap-2 border rounded-xl py-3 text-xs font-mono tracking-widest uppercase transition-all duration-500 cursor-pointer ${
                            wishlist.some((w) => w.id === selectedProductPreview.id)
                              ? 'bg-rose-950/30 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                              : 'bg-transparent border-white/10 text-white hover:bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlist.some((w) => w.id === selectedProductPreview.id) ? 'fill-rose-500 stroke-rose-500' : ''}`} /> 
                          <span>Wishlist</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="flex flex-col items-center justify-center py-20 text-center px-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                        {/* Concentric rotating scanner rings */}
                        <div className="absolute inset-0 border border-dashed border-[#D4AF37]/20 rounded-full animate-spin-slow" />
                        <div className="absolute inset-2 border border-dotted border-white/10 rounded-full" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />
                        <Orbit className="w-8 h-8 stroke-[1] text-[#D4AF37] animate-pulse" />
                      </div>
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                        Spectrometer Scan Required
                      </p>
                      <p className="text-[11px] font-light mt-3 max-w-[240px] text-gray-400 leading-relaxed">
                        Select a glowing target coordinate on the 360° radar display to begin high-fidelity spectroscopic inspection.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
