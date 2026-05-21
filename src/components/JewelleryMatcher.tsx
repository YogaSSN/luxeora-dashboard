import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { Sparkles, Check, Flame, Trophy, Info, Star, Plus } from 'lucide-react';

interface JewelleryMatcherProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (id: string) => void;
}

export default function JewelleryMatcher({ products, onAddToCart, onSelectProduct }: JewelleryMatcherProps) {
  // Categorize for matching
  const necklaces = products.filter((p) => p.name.includes('Choker') || p.name.includes('Necklace') || p.name.includes('Haram'));
  const earrings = products.filter((p) => p.name.includes('Earrings'));
  const bracelets = products.filter((p) => p.name.includes('Kada') || p.name.includes('Bracelet') || p.name.includes('Chain'));

  const [selectedNecklace, setSelectedNecklace] = useState<Product>(necklaces[0] || products[0]);
  const [selectedEarring, setSelectedEarring] = useState<Product>(earrings[0] || products[0]);
  const [selectedBracelet, setSelectedBracelet] = useState<Product>(bracelets[0] || products[0]);

  const [celebrityInspo, setCelebrityInspo] = useState<string>('Red Carpet Imperial');

  // Calculates a dynamic harmony score based on metal compatibility and gemstone types
  const getHarmonyMetrics = () => {
    let score = 70;
    const notes: string[] = [];

    // Metal compatibility
    const neckMetal = selectedNecklace.metal.toLowerCase();
    const earMetal = selectedEarring.metal.toLowerCase();
    const braceMetal = selectedBracelet.metal.toLowerCase();

    const isAllGold = neckMetal.includes('gold') && earMetal.includes('gold') && braceMetal.includes('gold');
    const isAllSilverOrPlatinum = (neckMetal.includes('platinum') || neckMetal.includes('silver')) &&
                                  (earMetal.includes('platinum') || earMetal.includes('silver')) &&
                                  (braceMetal.includes('platinum') || braceMetal.includes('silver'));

    if (isAllGold) {
      score += 15;
      notes.push('Unified precious gold metals reflect absolute royal symmetry.');
    } else if (isAllSilverOrPlatinum) {
      score += 15;
      notes.push('Icy platinum and silver base tones provide a pristine, modernist glow.');
    } else {
      score -= 5;
      notes.push('Bespoke metal contrasting (Gold + Platinum pairing) projects avant-garde complexity.');
    }

    // Stones compatibility
    const neckStone = selectedNecklace.stone.toLowerCase();
    const earStone = selectedEarring.stone.toLowerCase();
    const braceStone = selectedBracelet.stone.toLowerCase();

    if (neckStone.includes('emerald') && earStone.includes('emerald')) {
      score += 10;
      notes.push('Twin emerald accents create a high-contrast deep green spectrum.');
    }
    if (neckStone.includes('diamond') && earStone.includes('diamond')) {
      score += 10;
      notes.push('Cascading diamond facets double the scintillation index under evening lighting.');
    }
    if (neckStone.includes('ruby') && braceStone.includes('ruby')) {
      score += 10;
      notes.push('Coordinating Birman ruby accents unify the wrist and collar lines.');
    }

    if (score > 90) {
      return { score: Math.min(score, 100), label: 'Sovereign Match', gradient: 'from-[#D4AF37] to-amber-500', notes };
    } else if (score > 80) {
      return { score, label: 'Grand Elegance Affinity', gradient: 'from-emerald-400 to-teal-500', notes };
    } else {
      return { score, label: 'Avant-Garde Counterpoint', gradient: 'from-red-400 to-rose-500', notes };
    }
  };

  const { score, label, gradient, notes } = getHarmonyMetrics();

  // Combine bundle pricing with a discount
  const originalTotal = (selectedNecklace?.price || 0) + (selectedEarring?.price || 0) + (selectedBracelet?.price || 0);
  const bundleDiscounted = Math.round(originalTotal * 0.90); // 10% sovereign discount

  const handleAutoRecommend = () => {
    // Pick matched elements of same material
    const findGold = necklaces.find((p) => p.metal.includes('Gold'));
    const findGoldEar = earrings.find((p) => p.metal.includes('Gold')) || earrings[0];
    const findGoldBrace = bracelets.find((p) => p.metal.includes('Gold')) || bracelets[0];
    
    if (findGold) setSelectedNecklace(findGold);
    setSelectedEarring(findGoldEar);
    setSelectedBracelet(findGoldBrace);
    setCelebrityInspo('Royal Durbar Queen');
  };

  return (
    <div id="jewellery-matcher-root" className="bg-[#080808] border-y border-white/5 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono tracking-[0.4em] text-[#D4AF37] uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Infinite Styling Matrix
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight mt-2 text-white">
            Prestige Jewelry Matcher
          </h2>
          <p className="max-w-xl mx-auto text-sm text-gray-400 mt-2 font-light">
            Layer and match necklaces, studs, and heavy cuffed kadas. Analyze metal tones and gem alignment to generate a bespoke signature look.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Picker columns (left) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-5 rounded-2xl bg-zinc-950/40 border border-white/5">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-3">1. Select Collar Jewel</h3>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {necklaces.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNecklace(n)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center gap-3 transition-colors ${
                      selectedNecklace.id === n.id ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white' : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={n.image} alt={n.name} className="w-8 h-8 rounded object-cover" />
                    <div className="truncate">
                      <p className="font-medium truncate text-white">{n.name}</p>
                      <p className="text-[10px] opacity-75 font-mono">${n.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950/40 border border-white/5">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-3">2. Select Ear Accents</h3>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {earrings.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEarring(e)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center gap-3 transition-colors ${
                      selectedEarring.id === e.id ? 'bg-emerald-550/10 border-[#D4AF37] text-white' : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={e.image} alt={e.name} className="w-8 h-8 rounded object-cover" />
                    <div className="truncate">
                      <p className="font-medium truncate text-white">{e.name}</p>
                      <p className="text-[10px] opacity-75 font-mono">${e.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950/40 border border-white/5">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-3">3. Select Wrist Sovereign</h3>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {bracelets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBracelet(b)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center gap-3 transition-colors ${
                      selectedBracelet.id === b.id ? 'bg-yellow-550/10 border-[#D4AF37] text-white' : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={b.image} alt={b.name} className="w-8 h-8 rounded object-cover" />
                    <div className="truncate">
                      <p className="font-medium truncate text-white">{b.name}</p>
                      <p className="text-[10px] opacity-75 font-mono">${b.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Layered Showcase Preview (center) */}
          <div className="lg:col-span-4 flex flex-col gap-4 items-center">
            <div className="w-full aspect-[4/5] bg-gradient-to-b from-[#111] to-[#040404] rounded-3xl border border-white/5 p-6 flex flex-col justify-between items-center relative overflow-hidden">
              {/* Radial spotlight behind */}
              <div className="absolute top-1/4 w-36 h-36 bg-[#D4AF37]/5 rounded-full filter blur-2xl pointer-events-none" />

              <div className="text-center w-full pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] block">CELEBRITY SILHOUETTE</span>
                <span className="text-xs text-gray-400 italic">Style: &quot;{celebrityInspo}&quot;</span>
              </div>

              {/* Layered Stack visuals */}
              <div className="relative flex-1 flex flex-col justify-center items-center gap-4 w-full">
                {/* 1. Necklace Layer */}
                <motion.div
                  key={selectedNecklace.id}
                  className="w-40 h-10 border border-white/10 bg-black/60 rounded-xl flex items-center p-1.5 gap-2 shadow-lg relative cursor-pointer"
                  onClick={() => onSelectProduct(selectedNecklace.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img referrerPolicy="no-referrer" src={selectedNecklace.image} alt="" className="w-8 h-full rounded object-cover" />
                  <div className="truncate text-left">
                    <p className="text-[10px] font-serif truncate text-white leading-none">{selectedNecklace.name}</p>
                    <span className="text-[8px] font-mono text-gray-500">Tier 1 • Collar</span>
                  </div>
                </motion.div>

                {/* 2. Earring Layer */}
                <motion.div
                  key={selectedEarring.id}
                  className="w-36 h-10 border border-white/10 bg-black/60 rounded-xl flex items-center p-1.5 gap-2 shadow-lg relative cursor-pointer"
                  onClick={() => onSelectProduct(selectedEarring.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img referrerPolicy="no-referrer" src={selectedEarring.image} alt="" className="w-8 h-full rounded object-cover" />
                  <div className="truncate text-left">
                    <p className="text-[10px] font-serif truncate text-white leading-none">{selectedEarring.name}</p>
                    <span className="text-[8px] font-mono text-gray-500">Tier 2 • Ear</span>
                  </div>
                </motion.div>

                {/* 3. Bracelet Layer */}
                <motion.div
                  key={selectedBracelet.id}
                  className="w-40 h-10 border border-white/10 bg-black/60 rounded-xl flex items-center p-1.5 gap-2 shadow-lg relative cursor-pointer"
                  onClick={() => onSelectProduct(selectedBracelet.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img referrerPolicy="no-referrer" src={selectedBracelet.image} alt="" className="w-8 h-full rounded object-cover" />
                  <div className="truncate text-left">
                    <p className="text-[10px] font-serif truncate text-white leading-none">{selectedBracelet.name}</p>
                    <span className="text-[8px] font-mono text-gray-500">Tier 3 • Wrist</span>
                  </div>
                </motion.div>
              </div>

              {/* Quick Preset Actions inside stacking viewer */}
              <div className="flex gap-2 w-full pt-3 border-t border-white/5">
                <button
                  onClick={handleAutoRecommend}
                  className="flex-1 py-1.5 border border-white/10 hover:border-[#D4AF37]/55 text-[9px] uppercase tracking-wider font-mono text-gray-300 rounded"
                >
                  Symmetric Match
                </button>
                <button
                  onClick={() => {
                    setSelectedNecklace(necklaces[Math.floor(Math.random() * necklaces.length)] || selectedNecklace);
                    setSelectedEarring(earrings[Math.floor(Math.random() * earrings.length)] || selectedEarring);
                    setSelectedBracelet(bracelets[Math.floor(Math.random() * bracelets.length)] || selectedBracelet);
                    setCelebrityInspo('Avant-Garde Gala');
                  }}
                  className="py-1.5 px-3 border border-white/10 text-[9px] uppercase tracking-wider font-mono text-gray-400 rounded"
                >
                  Contrasting
                </button>
              </div>
            </div>
          </div>

          {/* Styling Diagnostics (right column) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 bg-zinc-950/60 rounded-3xl border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">Empirical Analysis</span>
              <h3 className="text-xl font-serif">Aura Harmony Score</h3>

              {/* Dynamic Score Dial */}
              <div className="flex items-center gap-4 my-4">
                <div className="relative w-24 h-24 rounded-full border-4 border-white/5 flex flex-col items-center justify-center">
                  <span className="text-2xl font-mono font-bold">{score}%</span>
                  <span className="text-[8px] font-mono tracking-wider text-gray-500 uppercase">Match Score</span>
                  <div
                    className="absolute inset-[2px] rounded-full border-2 border-dashed pointer-events-none animate-spin-slow"
                    style={{ borderColor: score > 90 ? '#D4AF37' : '#EF4444' }}
                  />
                </div>
                <div>
                  <h4 className="font-serif text-[#D4AF37] text-md">{label}</h4>
                  <p className="text-[11px] text-gray-400 leading-tight mt-1 font-light">
                    Evaluating atomic metal weights, refractive facets, and stone compatibility index.
                  </p>
                </div>
              </div>

              {/* Styling Advice list */}
              <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                {notes.map((note, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="font-light">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Bundle Box */}
            <div className="p-6 rounded-3xl bg-[#0F0D0A] border border-[#D4AF37]/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>Standard Total</span>
                  <span className="line-through">${originalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-sm text-gray-200">Sovereign Bundle Set</span>
                  <span className="text-2xl font-mono text-[#D4AF37] font-semibold">${bundleDiscounted.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-light mb-4">
                  ★ Save 10% when acquiring our auto-synchronized matching sets. Inspected and certificate stamped as a consolidated collection.
                </p>
              </div>

              <button
                onClick={() => {
                  onAddToCart(selectedNecklace);
                  onAddToCart(selectedEarring);
                  onAddToCart(selectedBracelet);
                }}
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black rounded-lg text-xs font-mono font-medium tracking-widest uppercase transition-colors text-center cursor-pointer"
              >
                Acquire Consolidating Set (3 Items)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
