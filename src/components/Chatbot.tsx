import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, LuxuryMood, Product } from '../types';
import { Sparkles, MessageCircle, X, Send, User, Compass, HelpCircle, Gift, Crown, HelpCircle as HelpIcon, ArrowRight, Music, Mic } from 'lucide-react';

interface ChatbotProps {
  currentMood: LuxuryMood;
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onSelectPage: (page: any) => void;
}

export default function Chatbot({ currentMood, products, onSelectProduct, onSelectPage }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'concierge',
      text: 'Welcome, cherished guest, to Luxeora. I am your personal shopping jeweler and luxury stylist. Let me guide your exploration across precious metals, carat guides, or bridal matching. How may I honor your selection today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        'Bridal suggestions',
        'Find gift under $10k',
        'Ring Sizing Guide',
        'Gemstone advice'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send historical messages up to the server-side proxy
      // to keep dialogue continuity
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          userMood: currentMood
        })
      });

      const data = await response.json();
      setIsTyping(false);

      const conciergeMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'concierge',
        text: data.text || 'An absolute pleasure. I am analyzing our showroom to discover suitable additions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Match products in text (e.g. if the model recommended Imperial Mughal, highlight button)
      const matchedProdIds: string[] = [];
      products.forEach((p) => {
        if (data.text?.toLowerCase().includes(p.name.toLowerCase()) || data.text?.toLowerCase().includes(p.id)) {
          matchedProdIds.push(p.id);
        }
      });
      if (matchedProdIds.length > 0) {
        conciergeMsg.productRecommendations = matchedProdIds;
      }

      setMessages((prev) => [...prev, conciergeMsg]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'concierge',
          text: 'Forgive me, the communication signals to our royal vault temporarily registers a wave of static. Our masterpieces remain completely pristine.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleQuickAction = (actionText: string) => {
    handleSendMessage(actionText);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate speaking sequence after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("Show me your finest Diamond ring options.");
      }, 3500);
    }
  };

  // Select accent styles based on active Brand Mood
  const getBubbleStyles = (sender: 'user' | 'concierge') => {
    if (sender === 'user') {
      return 'bg-zinc-800 text-white rounded-br-none';
    }
    // Concierge bubbles change based on mood
    switch (currentMood) {
      case 'royal':
        return 'bg-amber-950/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-bl-none';
      case 'romantic':
        return 'bg-rose-950/20 text-[#E0A899] border border-[#E0A899]/30 rounded-bl-none';
      case 'elegant':
        return 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/30 rounded-bl-none';
      case 'vintage':
        return 'bg-[#291B13]/30 text-[#C29F6C] border border-[#C29F6C]/30 rounded-bl-none';
      case 'bold':
        return 'bg-red-950/20 text-red-400 border border-red-500/30 rounded-bl-none';
      default:
        return 'bg-white/5 border border-white/10 text-white rounded-bl-none';
    }
  };

  const getWidgetTheme = () => {
    switch (currentMood) {
      case 'royal':
        return 'border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]';
      case 'romantic':
        return 'border-[#E0A899]/30 shadow-[0_0_20px_rgba(224,168,153,0.15)]';
      case 'elegant':
        return 'border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
      case 'vintage':
        return 'border-[#C29F6C]/20 shadow-[0_0_20px_rgba(194,159,108,0.15)]';
      case 'bold':
        return 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]';
      default:
        return 'border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]';
    }
  };

  return (
    <div id="chatbot-widget-root" className="fixed bottom-6 right-6 z-50">
      {/* Launching Badge Trigger Button with Orbiting Particles */}
      <div className="relative group">
        {/* Rotating Outer Orbital Rings */}
        <div className="absolute inset-[-14px] pointer-events-none z-0 opacity-40 group-hover:opacity-80 transition-opacity duration-500">
          <div className="absolute inset-0 border border-dashed border-[#D4AF37]/35 rounded-full animate-spin-slow" style={{ animationDuration: '15s' }} />
          <div className="absolute inset-2 border border-dotted border-[#D4AF37]/15 rounded-full animate-spin-slow" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
          
          {/* Orbital Dot 1 */}
          <div 
            className="absolute w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37] top-1/2 left-1/2"
            style={{
              margin: '-4px 0 0 -4px',
              animation: 'spin-slow 8s linear infinite',
              transformOrigin: '32px 0'
            }}
          />
          {/* Orbital Dot 2 */}
          <div 
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_#fff] top-1/2 left-1/2"
            style={{
              margin: '-3px 0 0 -3px',
              animation: 'spin-slow 5s linear infinite',
              transformOrigin: '-28px 0',
              animationDirection: 'reverse'
            }}
          />
        </div>

        <motion.button
          id="chatbot-trigger-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-black/90 border border-[#D4AF37]/30 p-4.5 rounded-full flex items-center justify-center cursor-pointer shadow-[0_10px_30px_rgba(212,175,55,0.15)] overflow-hidden z-10 hover:scale-105 active:scale-95 transition-all duration-300"
          whileTap={{ scale: 0.9 }}
        >
          {/* Shiny backdrop overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-500" />
          <MessageCircle className="w-5.5 h-5.5 text-white group-hover:text-[#D4AF37] transition-colors relative z-10" />
          
          {/* Active online green dot */}
          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full shadow-lg" />
        </motion.button>
      </div>

      {/* Slide dialogue card panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel-container"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute bottom-22 right-0 w-[360px] md:w-[420px] h-[580px] bg-black/85 backdrop-blur-3xl border rounded-2xl flex flex-col justify-between overflow-hidden relative z-50 shadow-2xl ${getWidgetTheme()}`}
          >
            {/* Ambient Background Aura top corner */}
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#D4AF37]/10 rounded-full filter blur-3xl pointer-events-none" />

            {/* Banner Header */}
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-black to-zinc-900 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-[#D4AF37] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-serif tracking-wide text-white">Luxeora Concierge</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase">Personal Jeweler Online</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onSelectPage('ai-concierge');
                  }}
                  className="p-1.5 px-3 rounded hover:bg-white/5 text-[9px] uppercase font-mono tracking-widest border border-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  EXPAND SUITE
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Log screen */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-black/10 to-black/30"
            >
              {messages.map((msg, index) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} w-full`}
                >
                  <div className="flex items-center gap-1 text-[8px] font-mono opacity-40 px-1 mb-1 uppercase tracking-wider">
                    {msg.sender === 'user' ? (
                      <>
                        <span>Cherished Guest</span> <User className="w-2.5 h-2.5" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" /> <span>Stylist Stylist</span>
                      </>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed shadow-lg ${getBubbleStyles(msg.sender)}`}>
                    <p className="whitespace-pre-line font-light">{msg.text}</p>
                    
                    {/* Embedded Product Recommendations inside conversational bubble */}
                    {msg.productRecommendations && msg.productRecommendations.length > 0 && (
                      <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                        <span className="text-[8.5px] uppercase font-mono tracking-widest text-[#D4AF37]/70 block font-semibold">
                          Curated Specimen Matches:
                        </span>
                        {msg.productRecommendations.map((pId) => {
                          const matchedP = products.find((p) => p.id === pId);
                          if (!matchedP) return null;
                          return (
                            <button
                              key={matchedP.id}
                              onClick={() => {
                                onSelectProduct(matchedP.id);
                                setIsOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-2 rounded-xl bg-black/50 hover:bg-black/90 border border-white/5 hover:border-[#D4AF37]/35 transition-all text-left group"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  referrerPolicy="no-referrer"
                                  src={matchedP.image}
                                  alt={matchedP.name}
                                  className="w-8 h-8 rounded object-cover border border-white/5"
                                />
                                <div className="truncate max-w-[150px]">
                                  <h6 className="text-[10.5px] font-serif truncate text-white leading-tight font-medium">
                                    {matchedP.name}
                                  </h6>
                                  <span className="text-[8px] font-mono text-gray-400 group-hover:text-[#D4AF37] transition-colors">{matchedP.metal}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 font-mono text-[8px] text-[#D4AF37] bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                <span>INSPECT</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-3 max-w-[95%] justify-start">
                      {msg.actions.map((act) => (
                        <button
                          key={act}
                          onClick={() => handleQuickAction(act)}
                          className="px-3 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] tracking-widest uppercase hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all cursor-pointer font-mono shadow-sm"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Dot Animation indicator */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 text-[9px] font-mono opacity-40 mb-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <span>Luxeora Stylist is writing...</span>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce delay-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Input controls footer */}
            <div className="p-4 border-t border-white/10 bg-black/60 z-10 flex flex-col gap-2">
              {/* Simulated Recording Waveform */}
              {isRecording && (
                <motion.div
                  className="bg-red-950/20 py-2.5 px-3.5 border border-red-500/30 rounded-xl flex items-center justify-between shadow-inner"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">Aura analysis in progress...</span>
                  </div>
                  {/* Custom SVG bars jumping */}
                  <div className="flex gap-0.5 items-end h-4">
                    <span className="w-0.5 h-2.5 bg-red-400 animate-pulse" />
                    <span className="w-0.5 h-4 bg-red-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-red-400 animate-pulse delay-150" />
                    <span className="w-0.5 h-3 bg-red-400 animate-pulse" />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    isRecording
                      ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                      : 'bg-zinc-900 text-gray-400 border-white/5 hover:text-white hover:border-white/20'
                  }`}
                  title="Speak Style Requirements"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(inputValue);
                  }}
                  className="flex-1 bg-zinc-900/80 border border-white/5 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 transition-all"
                  placeholder="Inquire size guides, design lineages..."
                />

                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="bg-[#D4AF37] disabled:opacity-40 p-3 rounded-xl flex items-center justify-center text-black font-semibold hover:bg-yellow-600 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

