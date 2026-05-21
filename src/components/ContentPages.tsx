import React, { useState } from 'react';
import { STORIES } from '../data';
import { Crown, Mail, Phone, MapPin, ShieldCheck, HelpCircle, Send, CheckCircle2, Award, Clock } from 'lucide-react';

/* Royal Membership component */
export function RoyalMembership() {
  const [activeTier, setActiveTier] = useState<'aurum' | 'platinum' | 'imperium'>('aurum');

  return (
    <div id="membership-page" className="py-12 max-w-5xl mx-auto text-white">
      <div className="text-center mb-10">
        <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 animate-bounce" />
        <h1 className="text-4xl font-serif tracking-tight">The Crown Sovereign Guild</h1>
        <p className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase mt-1">Royal Loyalty Protocol</p>
        <p className="text-sm text-gray-400 max-w-md mx-auto mt-3">
          As a registered member of Luxeora, enter a realm of priority access, private diamond viewing suites, and custom crafting priority.
        </p>
      </div>

      {/* Tier switcher tabs */}
      <div className="flex justify-center gap-3 mb-8">
        {(['aurum', 'platinum', 'imperium'] as const).map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            className={`px-6 py-2 rounded text-xs font-mono tracking-widest uppercase border transition-all ${
              activeTier === tier
                ? 'bg-white text-black border-white shadow-lg'
                : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
            }`}
          >
            {tier} Status
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zinc-950/40 p-8 rounded-3xl border border-white/5">
        <div className="md:col-span-7 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Active Tier Privileges</span>
          
          {activeTier === 'aurum' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-serif text-white">Aurum Covenant</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Initial initiation level into our luxury network. For clients starting their curated collections.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-300 font-light">
                <li className="flex items-center gap-2">✔ Free secure armored delivery with live tracking</li>
                <li className="flex items-center gap-2">✔ Access to year-round gold polishing services</li>
                <li className="flex items-center gap-2">✔ 10% anniversary credit toward bespoke sets</li>
              </ul>
            </div>
          )}

          {activeTier === 'platinum' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-serif text-[#E0A899]">Platinum Sovereign</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                For established collectors of rare natural diamonds and certified South Sea pearls.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-300 font-light">
                <li className="flex items-center gap-2">✔ Priority queue in our bespoke custom designing studios</li>
                <li className="flex items-center gap-2">✔ Annual private consultation hour with our Chief Gemologist</li>
                <li className="flex items-center gap-2">✔ Secret preview invitations to upcoming master collections</li>
              </ul>
            </div>
          )}

          {activeTier === 'imperium' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-serif text-[#D4AF37] flex items-center gap-2">
                Imperium Crown
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our ultimate private guild. Limited strictly to 1,000 collectors globally.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-300 font-light">
                <li className="flex items-center gap-2">✦ Unlimited direct access to private luxury showroom events</li>
                <li className="flex items-center gap-2">✦ Helicopter concierge delivery to private residences globally</li>
                <li className="flex items-center gap-2">✦ Absolute VIP access – your pieces are physically engraved on private vaults</li>
              </ul>
            </div>
          )}
        </div>

        {/* Mock progress bar to make it interactive */}
        <div className="md:col-span-5 bg-black/60 p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-400">Guild Progress</span>
            <span className="text-[#D4AF37]">7,400 / 10,000 Carat Points</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-[#D4AF37] h-full w-[74%]" />
          </div>
          <p className="text-[10px] text-gray-500 font-light leading-relaxed">
            Acquire 2,600 more points to upgrade your status to Emperor Class. Points are earned through certifications, custom commissions, or showroom walkthroughs.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Story Collections component */
export function StoryCollections() {
  return (
    <div id="stories-page" className="py-12 max-w-5xl mx-auto text-white">
      <div className="text-center mb-12">
        <Award className="w-10 h-10 text-[#D4AF37] mx-auto mb-2" />
        <h1 className="text-4xl font-serif">Curated Linages & Legends</h1>
        <p className="text-xs font-mono text-[#D4AF37] tracking-[0.3em] uppercase mt-1">Artistry Behind the Forge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STORIES.map((story) => (
          <div key={story.id} className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between group">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={story.image}
                referrerPolicy="no-referrer"
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-black/65 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase">
                {story.tag}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif text-white hover:text-[#D4AF37] transition-colors cursor-pointer mb-2">
                  {story.title}
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                  {story.content}
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mt-4 pt-4 border-t border-white/5">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {story.duration}</span>
                <span className="text-[#D4AF37]">Expand Read ➔</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* FAQ Page */
export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "Is Luxeora gold BIS hallmarked?", a: "Yes, every single gram of our gold collection registers a guaranteed BIS 916 Hallmark (22 Karat) or BIS 750 (18 Karat) certified in government licensed laboratory setups before being mounted." },
    { q: "Are Luxeora solitaire diamonds certified by global labs?", a: "Precisely. Every solitaire diamond above 0.18 carats is packaged with official analytical dossiers on cutting index, color index, and absolute clarity issued by the Gemological Institute of America (GIA) or International Gemological Institute (IGI)." },
    { q: "What is your high-end shipping protocol?", a: "To maintain perfect safety, we employ armored logistics providers (such as Brink's or Sequel) with dual-armed guards directly to signature addresses. Everything is fully insured from our vault gate directly to your fingertip." },
    { q: "Do you offer bespoke customized crafting?", a: "Indeed. By selecting 'Bespoke Private Suite' or invoking our AI Concierge, you coordinates with master draftspersons to convert sketches, family heirlooms, or digital concepts into precious realities." }
  ];

  return (
    <div id="faq-page" className="py-12 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-serif text-center mb-8">Sovereign Knowledge Base (FAQ)</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={i} className="border border-white/5 rounded-xl overflow-hidden bg-zinc-950/50">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full text-left p-5 flex justify-between items-center text-sm font-serif hover:bg-white/5 transition-colors font-medium text-white"
              >
                <span>{faq.q}</span>
                <span className="text-[#D4AF37] font-mono">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="p-5 pt-0 text-xs text-gray-400 leading-relaxed font-light border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Contact Us Component & Consultation Scheduler */
export function ContactPage() {
  const [scheduled, setScheduled] = useState(false);
  const [date, setDate] = useState('2026-05-25');
  const [time, setTime] = useState('14:30');

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
  };

  return (
    <div id="contact-page" className="py-12 max-w-4xl mx-auto text-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact info cards */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">Locations</span>
            <h1 className="text-3xl font-serif mt-1">Our Global Ateliers</h1>
            <p className="text-xs text-gray-400 mt-2 font-light leading-relaxed">
              For private diamond viewings or customized high jewelry consultation, our salons require appointment schedules.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 text-xs font-light">
              <MapPin className="text-[#D4AF37] w-5 h-5 shrink-0" />
              <div>
                <h5 className="font-serif font-medium text-white">Salons Paris-Place Vendôme</h5>
                <p className="text-gray-400">22 Place Vendôme, 75001 Paris, France</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs font-light">
              <MapPin className="text-[#D4AF37] w-5 h-5 shrink-0" />
              <div>
                <h5 className="font-serif font-medium text-white">Salons Mumbai Colaba</h5>
                <p className="text-gray-400">Taj Mahal Palace Annex, Apollo Bandar, Mumbai 400001, India</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs font-light">
              <Phone className="text-[#D4AF37] w-5 h-5 shrink-0" />
              <div>
                <h5 className="font-serif font-medium text-white">Private Line</h5>
                <p className="text-gray-400">+33 (1) 40 20 22 22 (English/Hindi/French support)</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs font-light">
              <Mail className="text-[#D4AF37] w-5 h-5 shrink-0" />
              <div>
                <h5 className="font-serif font-medium text-white">Digital Ateliers</h5>
                <p className="text-gray-400">curator@luxeora.luxury</p>
              </div>
            </div>
          </div>
        </div>

        {/* Private consultation scheduler (col 7) */}
        <div className="md:col-span-7 bg-zinc-950/60 p-6 rounded-3xl border border-white/5">
          <span className="text-[10px] font-mono tracking-wider text-[#D4AF37] uppercase">Reserve Slot</span>
          <h2 className="text-xl font-serif mb-4">Chronos Private Viewing Reservation</h2>

          {scheduled ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-serif">Sovereign Viewing Reserved</h4>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                Bespoke slot successfully reserved for <strong>{date}</strong> at <strong>{time}</strong> behind private vaults. A curator will reach out shortly for credentials verification.
              </p>
              <button
                onClick={() => setScheduled(false)}
                className="px-4 py-1.5 border border-white/10 hover:bg-white/5 rounded text-[10px] font-mono uppercase tracking-wider text-gray-300 transition-colors"
              >
                Change Date
              </button>
            </div>
          ) : (
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Your Full Name</label>
                  <input required type="text" className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" placeholder="Lord / Lady Carter" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Telephone Account</label>
                  <input required type="tel" className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" placeholder="+33 1..." />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Select Consultation Type</label>
                <select className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-xs text-gray-300 focus:outline-none">
                  <option>Bridal Jewellery Matching (60 min)</option>
                  <option>Bespoke Diamond ring commission (90 min)</option>
                  <option>Family Jade/Gold Restoration (45 min)</option>
                  <option>GIA spectrography evaluation (30 min)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Choose Date</label>
                  <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-gray-300" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Choose Time</label>
                  <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-gray-300" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white text-black font-mono text-xs tracking-widest uppercase rounded hover:bg-gray-200 transition-all cursor-pointer"
              >
                Schedule Appointment Slot
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* Customer Support & Hallmark verification page */
export function CustomerSupportPage() {
  const [hallmarkInput, setHallmarkInput] = useState('');
  const [stampVerified, setStampVerified] = useState<'yes' | 'no' | 'idle'>('idle');

  const checkHallmark = () => {
    if (!hallmarkInput.trim()) return;
    // Mock matching BIS number
    if (hallmarkInput.toUpperCase().includes('BIS-') || hallmarkInput.length > 5) {
      setStampVerified('yes');
    } else {
      setStampVerified('no');
    }
  };

  return (
    <div id="support-page" className="py-12 max-w-4xl mx-auto text-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Support channels left */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">Assistance Terminal</span>
            <h1 className="text-3xl font-serif mt-1">Concierge Backends</h1>
            <p className="text-xs text-gray-400 mt-2 font-light leading-relaxed animate-pulse">
              Direct telemetry lines are open 24/7. Address queries on carat weight adjustments or certificate delivery.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-white/5 space-y-2 text-xs font-light">
            <h4 className="font-serif text-[#D4AF37] font-medium">Armored Return Protocol</h4>
            <p className="text-gray-400">
              Within 14 calendar days, file an armored return query. The Brink secure courier will pick up the box in pre-insured conditions.
            </p>
          </div>
        </div>

        {/* Hallmark verification tool (right) */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-zinc-950/60 p-6 rounded-3xl border border-white/5 space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-[#D4AF37] uppercase flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Government Authenticator
            </span>
            <h2 className="text-xl font-serif">Bureau of Standards Hallmark Checker</h2>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Inspect Hallmark purity marks electronically. Enter your laser-engraved 8-character HUID code (usually under the necklace clasp or inner band ring shank, e.g. BIS-916K).
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={hallmarkInput}
                onChange={(e) => setHallmarkInput(e.target.value)}
                placeholder="e.g. BIS-916K"
                className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
              />
              <button
                onClick={checkHallmark}
                className="bg-[#D4AF37] hover:bg-yellow-600 text-black px-4 rounded text-xs font-mono uppercase tracking-widest"
              >
                Authenticate
              </button>
            </div>

            {stampVerified === 'yes' && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h6 className="text-xs font-serif text-white">Authentic Sovereign Certified</h6>
                  <p className="text-[10px] text-gray-400 leading-tight block mt-0.5">
                    HUID registers active under 22K (916 Fineness) BIS Certified assay laboratories. Includes valid anti-tarnish lifetime insurances.
                  </p>
                </div>
              </div>
            )}

            {stampVerified === 'no' && (
              <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <h6 className="text-xs font-serif text-white">Manual Verification Required</h6>
                  <p className="text-[10px] text-gray-400 leading-tight block mt-0.5">
                    HUID code not recognized automatically. Please submit photos to coordinator line for physical spectrometer analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
