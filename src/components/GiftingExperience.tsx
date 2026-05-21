import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, GiftFinderConfig } from '../types';
import { Gift, Sparkles, Heart, CheckCircle2, RefreshCw, Send, ArrowRight } from 'lucide-react';

interface GiftingExperienceProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

const OCCASIONS = ['Anniversary', 'Wedding', 'Engagement', 'Royal Birthday', 'Corporate Honors', 'Blessing Feast'];
const RELATIONSHIPS = ['Queen / Wife', 'Princess / Daughter', 'Devoted Mother', 'Self Reward', 'Golden King / Husband'];
const RIBBONS = [
  { name: 'Sovereign Gold', hex: '#D4AF37' },
  { name: 'Velvet Rose Gold', hex: '#E0A899' },
  { name: 'Imperial Emerald', hex: '#10B981' },
  { name: 'Royal Crimson', hex: '#BE123C' },
  { name: 'Brilliant Diamond Silver', hex: '#E2E8F0' }
];

export default function GiftingExperience({ products, onSelectProduct, onAddToCart }: GiftingExperienceProps) {
  // Config
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [budget, setBudget] = useState(15000);
  const [gemstone, setGemstone] = useState('All Stones');
  const [ribbon, setRibbon] = useState(RIBBONS[0]);
  const [messageText, setMessageText] = useState('With my deepest adoration and eternal love, always.');
  
  // Results
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [activeStep, setActiveStep] = useState<'picker' | 'unboxing' | 'done'>('picker');
  const [unboxStage, setUnboxStage] = useState<'idle' | 'ribbon' | 'lid' | 'reveal'>('idle');

  const handleFindGifts = () => {
    // Filter client side based on budget and relationship
    const filtered = products.filter((p) => {
      // price limit
      if (p.price > budget) return false;
      // stone limit
      if (gemstone !== 'All Stones' && !p.stone.toLowerCase().includes(gemstone.toLowerCase())) return false;
      return true;
    });

    // select the highest matching product or default to first
    const selected = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : products[0];
    setRecommendedProduct(selected);
    setActiveStep('unboxing');
    setUnboxStage('idle');
  };

  const startUnboxingSeq = () => {
    setUnboxStage('ribbon');
    setTimeout(() => {
      setUnboxStage('lid');
      setTimeout(() => {
        setUnboxStage('reveal');
      }, 1000);
    }, 1200);
  };

  const resetGiftFinder = () => {
    setActiveStep('picker');
    setRecommendedProduct(null);
    setUnboxStage('idle');
  };

  return (
    <div id="gifting-experience-root" className="bg-black/95 text-white min-h-[85vh] py-16 px-4 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono tracking-[0.4em] text-[#D4AF37] uppercase flex items-center justify-center gap-2">
            <Gift className="w-4 h-4" /> Personal Gifting Concierge
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight mt-2 text-white">
            Transform Gifting into Art
          </h2>
          <p className="max-w-xl mx-auto text-sm text-gray-400 mt-3 font-light">
            Design an unforgettable unboxing event with personalized messages, royal custom ribbon bindings, and gemstone recommendations.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {activeStep === 'picker' && (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-zinc-950/60 p-6 md:p-10 rounded-3xl border border-white/5"
            >
              {/* Form Controls */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-serif text-[#D4AF37] mb-4">Define The Royal Milestone</h3>
                  
                  {/* Occasions picker */}
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">
                    1. Celebration Occasions
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        onClick={() => setOccasion(occ)}
                        className={`py-2 px-3 text-xs rounded border transition-colors ${
                          occasion === occ
                            ? 'bg-white text-black border-white'
                            : 'bg-black/30 border-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">
                    2. For Whom is this Tribute?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RELATIONSHIPS.map((rel) => (
                      <button
                        key={rel}
                        onClick={() => setRelationship(rel)}
                        className={`py-2 px-3 text-xs rounded border transition-colors ${
                          relationship === rel
                            ? 'bg-white text-black border-white'
                            : 'bg-black/30 border-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget slide */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                      3. Maximum Target Budget
                    </label>
                    <span className="text-sm font-mono text-[#D4AF37]">${budget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="30000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] h-1 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                    <span>$2,000</span>
                    <span>$16,000</span>
                    <span>$30,000</span>
                  </div>
                </div>

                {/* Gemstone preferences */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">
                    4. Crystal or Gemstone Preference
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['All Stones', 'Emerald', 'Diamond', 'Sapphire', 'Ruby', 'Pearl'].map((stoneOpt) => (
                      <button
                        key={stoneOpt}
                        onClick={() => setGemstone(stoneOpt)}
                        className={`py-1.5 px-4 rounded-full text-xs border transition-colors ${
                          gemstone === stoneOpt
                            ? 'bg-white text-black border-white'
                            : 'bg-black/20 border-white/5 text-gray-300 hover:border-zinc-800'
                        }`}
                      >
                        {stoneOpt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personalization Setup (Col 5) */}
              <div className="md:col-span-5 bg-black/60 rounded-2xl border border-white/5 p-6 flex flex-col justify-between h-full min-h-[380px]">
                <div className="space-y-4">
                  <h4 className="text-lg font-serif border-b border-white/10 pb-2">Custom Wrapping Aesthetics</h4>
                  
                  {/* Ribbon choice */}
                  <div>
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-2">Custom Ribbon Theme</label>
                    <div className="flex gap-2">
                      {RIBBONS.map((ribOpt) => (
                        <button
                          key={ribOpt.name}
                          onClick={() => setRibbon(ribOpt)}
                          title={ribOpt.name}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            ribbon.name === ribOpt.name
                              ? 'border-white scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: ribOpt.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Message box */}
                  <div>
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-1">Engraved Card Tribute</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      maxLength={150}
                      rows={4}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none text-white placeholder-gray-600 resize-none leading-relaxed"
                      placeholder="Write your customized dedication..."
                    />
                  </div>
                </div>

                <button
                  onClick={handleFindGifts}
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#b8952b] text-black rounded-xl font-mono text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Forging Ideal Gift Combo
                </button>
              </div>
            </motion.div>
          )}

          {activeStep === 'unboxing' && recommendedProduct && (
            <motion.div
              key="unboxing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-10"
            >
              {/* Box Simulator Stage */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center mb-8">
                {/* Simulated Box 3D Layering using standard motion cards */}
                <AnimatePresence>
                  {unboxStage === 'idle' && (
                    <motion.div
                      className="absolute inset-0 bg-[#0B0B0B] border-4 border-[#D4AF37] rounded-3xl flex flex-col items-center justify-center shadow-2xl relative"
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Wrapping Ribbon Cross */}
                      <div className="absolute top-0 bottom-0 w-8 pointer-events-none" style={{ backgroundColor: ribbon.hex }} />
                      <div className="absolute left-0 right-0 h-8 pointer-events-none" style={{ backgroundColor: ribbon.hex }} />
                      
                      <div className="relative z-10 text-center p-6 bg-black/90 mx-6 rounded-2xl border border-white/5">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] block mb-1">
                          Royal Gift Box Assemble
                        </span>
                        <p className="text-xs text-gray-300 font-light leading-relaxed mb-4">
                          Bound with a beautiful {ribbon.name} silk satin bowtie, featuring your handwritten note.
                        </p>
                        <button
                          onClick={startUnboxingSeq}
                          className="px-5 py-2.5 bg-white text-black font-mono text-xs tracking-wider uppercase rounded hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          Cut Ribbon & Open Box
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {unboxStage === 'ribbon' && (
                    <motion.div
                      className="absolute inset-0 bg-[#0B0B0B] border-4 border-[#D4AF37] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [-2, 2, -2, 2, 0] }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-serif text-[#D4AF37] animate-pulse">Unraveling Satin...</span>
                      </div>
                    </motion.div>
                  )}

                  {unboxStage === 'lid' && (
                    <motion.div
                      className="absolute inset-0 bg-[#151515] border-4 border-[#D4AF37] rounded-3xl shadow-xl flex items-center justify-center"
                      initial={{ y: 0 }}
                      animate={{ y: -300, opacity: 0 }}
                      transition={{ duration: 0.9, ease: 'easeIn' }}
                    >
                      <span className="text-[#D4AF37] font-serif uppercase tracking-widest text-sm">Lifting Wooden Lid</span>
                    </motion.div>
                  )}

                  {/* Revealed Masterpiece on velvet padding */}
                  {unboxStage === 'reveal' && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#120F10] to-[#250F11] rounded-3xl border-2 border-red-900/30 p-6 flex flex-col items-center justify-between shadow-2xl"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 85 }}
                    >
                      {/* Premium velvet aura background glow */}
                      <div className="absolute inset-x-0 top-1/4 h-24 bg-red-600/10 rounded-full filter blur-xl pointer-events-none" />

                      <div className="text-center">
                        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
                          Sovereign Relic Unveiled
                        </span>
                        <h4 className="text-lg font-serif">{recommendedProduct.name}</h4>
                      </div>

                      <div className="w-40 h-40 rounded-full overflow-hidden border border-[#D4AF37]/30 shadow-inner relative group cursor-pointer my-2" onClick={() => onSelectProduct(recommendedProduct.id)}>
                        <img
                          referrerPolicy="no-referrer"
                          src={recommendedProduct.image}
                          alt={recommendedProduct.name}
                          className="w-full h-full object-cover transform scale-110 group-hover:scale-120 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
                      </div>

                      <div className="text-center w-full z-10">
                        <p className="text-[#D4AF37] font-mono text-sm mb-3">${recommendedProduct.price.toLocaleString()}</p>
                        
                        {/* Beautiful greeting card display */}
                        <div className="bg-amber-950/20 border border-[#D4AF37]/20 p-3 rounded-lg mx-2 mb-3">
                          <p className="text-[10px] font-serif italic text-gray-300 leading-normal">
                             &quot; {messageText} &quot;
                          </p>
                          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mt-1">
                            — For {relationship} • {occasion} wrap
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onAddToCart(recommendedProduct)}
                            className="flex-1 py-1.5 bg-[#D4AF37] text-black font-mono text-[10px] tracking-wide uppercase rounded font-semibold hover:bg-yellow-600 transition-colors cursor-pointer"
                          >
                            Acquire Tribute
                          </button>
                          <button
                            onClick={resetGiftFinder}
                            className="px-3 border border-white/10 hover:bg-white/5 rounded text-gray-300 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress HUD bar */}
              <div className="flex gap-3 text-xs text-gray-500 font-mono mt-4">
                <span className={unboxStage === 'idle' ? 'text-white' : ''}>1. Wrap Vault</span>
                <span>➔</span>
                <span className={unboxStage === 'ribbon' || unboxStage === 'lid' ? 'text-white' : ''}>2. Opening Cycle</span>
                <span>➔</span>
                <span className={unboxStage === 'reveal' ? 'text-[#D4AF37]' : ''}>3. Present Treasure</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
