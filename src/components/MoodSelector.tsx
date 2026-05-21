import { LuxuryMood } from '../types';
import { LUXURY_MOODS_CONFIG } from '../data';
import { motion } from 'motion/react';
import { Sparkles, Crown, Heart, ShieldAlert, Compass, Eye } from 'lucide-react';

interface MoodSelectorProps {
  currentMood: LuxuryMood;
  onMoodSelect: (mood: LuxuryMood) => void;
}

export default function MoodSelector({ currentMood, onMoodSelect }: MoodSelectorProps) {
  const moods = Object.keys(LUXURY_MOODS_CONFIG) as LuxuryMood[];

  const getIcon = (mood: LuxuryMood) => {
    switch (mood) {
      case 'royal':
        return <Crown className="w-5 h-5 text-[#D4AF37]" />;
      case 'romantic':
        return <Heart className="w-5 h-5 text-[#E0A899]" />;
      case 'elegant':
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'minimal':
        return <Eye className="w-5 h-5 text-zinc-600" />;
      case 'vintage':
        return <Compass className="w-5 h-5 text-[#C29F6C]" />;
      case 'bold':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div id="mood-selector" className="py-8 border-y border-white/10 my-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] uppercase opacity-70">
              Aura Configuration
            </span>
            <h2 className="text-2xl font-serif tracking-tight mt-1">
              Select Your Shopping Ambiance
            </h2>
            <p className="text-sm opacity-80 mt-2 max-w-xl">
              Curated tones, colorways, and background lighting change to echo the emotion of your desired masterpiece.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full md:w-auto">
            {moods.map((mood) => {
              const active = currentMood === mood;
              const conf = LUXURY_MOODS_CONFIG[mood];

              return (
                <button
                  key={mood}
                  id={`mood-btn-${mood}`}
                  onClick={() => onMoodSelect(mood)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-500 overflow-hidden ${
                    active
                      ? 'bg-white/5 border-white/30 shadow-md ring-1 ring-white/10'
                      : 'bg-black/20 border-white/5 opacity-60 hover:opacity-100 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getIcon(mood)}
                    <span className="text-xs font-mono uppercase tracking-wider block">
                      {mood}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight">{conf.name}</h3>
                  <p className="text-[10px] leading-tight opacity-70 mt-1 line-clamp-2">
                    {conf.description}
                  </p>
                  {active && (
                    <motion.div
                      layoutId="activeMoodHighlight"
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{
                        backgroundColor:
                          mood === 'royal'
                            ? '#D4AF37'
                            : mood === 'romantic'
                            ? '#E0A899'
                            : mood === 'elegant'
                            ? '#10B981'
                            : mood === 'minimal'
                            ? '#27272A'
                            : mood === 'vintage'
                            ? '#C29F6C'
                            : '#EF4444'
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
