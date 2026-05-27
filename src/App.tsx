import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LuxePage, LuxuryMood, Product, CartItem } from './types';
import { useData } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './supabaseClient';
import toast from 'react-hot-toast';

// Subcomponents imports
import MoodSelector from './components/MoodSelector';
import VirtualShowroom from './components/VirtualShowroom';
import GiftingExperience from './components/GiftingExperience';
import Chatbot from './components/Chatbot';
import JewelleryMatcher from './components/JewelleryMatcher';
import HomeView from './components/HomeView';
import ProductViews from './components/ProductViews';
import CartViews from './components/CartViews';
import CinematicLoader from './components/CinematicLoader';
import AuthModal from './components/AuthModal';

// Content views imports
import {
  RoyalMembership,
  StoryCollections,
  FAQPage,
  ContactPage,
  CustomerSupportPage
} from './components/ContentPages';

// Icons
import {
  Crown,
  Search,
  Heart,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  Compass,
  Gift,
  Award,
  BookOpen,
  Info,
  HelpCircle,
  PhoneCall,
  User,
  ShieldCheck,
  ChevronDown,
  LogOut,
  LayoutDashboard
} from 'lucide-react';


export default function App() {
  const { products: PRODUCTS, luxuryMoodsConfig: LUXURY_MOODS_CONFIG, loading: dataLoading } = useData();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [appLoading, setAppLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<LuxePage>('home');
  const [currentMood, setCurrentMood] = useState<LuxuryMood>('royal');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // State variables for checkout basket e-commerce layer
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Menu visibility triggers
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [currentPage]);


  // Sync index title
  useEffect(() => {
    document.title = `LUXEORA — Crafted Brilliance. Timeless Luxury.`;
  }, []);

  // Data loading effect for Cart & Wishlist
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || PRODUCTS.length === 0) return;
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          supabase.from('cart_items').select('*').eq('user_id', user.id),
          supabase.from('wishlist_items').select('*').eq('user_id', user.id)
        ]);

        if (cartRes.data) {
          const loadedCart = cartRes.data.map(item => {
            const p = PRODUCTS.find(prod => prod.id === item.product_id);
            if (p) return { product: p, quantity: item.quantity, selectedSize: item.selected_size };
            return null;
          }).filter(Boolean) as CartItem[];
          setCart(loadedCart);
        }

        if (wishlistRes.data) {
          const loadedWishlist = wishlistRes.data.map(item => PRODUCTS.find(prod => prod.id === item.product_id)).filter(Boolean) as Product[];
          setWishlist(loadedWishlist);
        }
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    };

    if (user) {
      loadUserData();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user, PRODUCTS]);

  // Handlers for cart & wishlist interaction
  const handleAddToWishlist = async (product: Product) => {
    if (!user) { setAuthModalOpen(true); return; }
    
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter((p) => p.id !== product.id));
      await supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', product.id);
    } else {
      setWishlist(prev => [...prev, product]);
      await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: product.id });
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) { setAuthModalOpen(true); return; }

    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      setCart(prev => prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      await supabase.from('cart_items').update({ quantity: existingItem.quantity + 1 }).eq('user_id', user.id).eq('product_id', product.id);
    } else {
      setCart(prev => [...prev, { product, quantity: 1 }]);
      await supabase.from('cart_items').insert({ user_id: user.id, product_id: product.id, quantity: 1 });
    }
  };

  const handleUpdateCartQty = async (productId: string, qty: number) => {
    if (!user) return;
    setCart(prev => prev.map((item) => item.product.id === productId ? { ...item, quantity: qty } : item));
    await supabase.from('cart_items').update({ quantity: qty }).eq('user_id', user.id).eq('product_id', productId);
  };

  const handleRemoveCartItem = async (productId: string) => {
    if (!user) return;
    setCart(prev => prev.filter((item) => item.product.id !== productId));
    await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
  };

  const handleClearCart = async () => {
    if (!user) return;
    setCart([]);
    await supabase.from('cart_items').delete().eq('user_id', user.id);
  };

  const isDataReady = !dataLoading && LUXURY_MOODS_CONFIG && LUXURY_MOODS_CONFIG[currentMood];
  const activeMoodConfig = isDataReady ? LUXURY_MOODS_CONFIG[currentMood] : null;

  if (appLoading || !isDataReady) {
    return <CinematicLoader onComplete={() => setAppLoading(false)} />;
  }

  return (
    <div
      id="luxeora-app-shell"
      className={`min-h-screen text-white relative transition-colors duration-[1.2s] ease-in-out font-sans ${activeMoodConfig.ambientBg}`}
    >
      {/* Background Lighting Shimmer Sweep effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden xl:left-1/4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-[#BF953F]/10 to-transparent filter blur-[150px] pointer-events-none animate-glow-pulse" />
      </div>

      {/* STICKY LUXURY COMPONENT HEADER NAVBAR */}
      <header id="luxeora-header" className="sticky top-0 z-40 bg-[#030303]/50 backdrop-blur-2xl border-b border-white/5 transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Elite Logo Branding */}
          <div
            id="brand-logo-container"
            onClick={() => {
              setCurrentPage('home');
              setSelectedProductId(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer selection:bg-transparent group"
          >
            <Crown className="w-6 h-6 text-[#D4AF37] stroke-[1.5] transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110" />
            <div>
              <span className="font-serif text-xl font-bold tracking-[0.25em] text-white transition-colors group-hover:text-gold-foil">LUXEORA</span>
              <p className="text-[7.5px] font-mono tracking-[0.45em] text-[#D4AF37] uppercase leading-none mt-1">Timeless Luxury</p>
            </div>
          </div>

          {/* Desktop Core Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono tracking-[0.18em] uppercase">
            <button
              onClick={() => {
                setCurrentPage('home');
                setSelectedProductId(null);
              }}
              className={`transition-all duration-300 py-2 relative cursor-pointer ${
                currentPage === 'home' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
              {currentPage === 'home' && (
                <motion.span layoutId="activeNavLine" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D4AF37]" />
              )}
            </button>

            {/* Custom Interactive Collections Mega Menu Dropdown */}
            <div
              className="relative py-2 group cursor-pointer"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                className={`transition-colors flex items-center gap-1 cursor-pointer ${
                  megaMenuOpen ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-white'
                }`}
              >
                Collections <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${megaMenuOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    id="mega-menu-panel"
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 w-[580px] bg-black/90 backdrop-blur-3xl border border-[#BF953F]/25 rounded-2xl p-7 shadow-2xl grid grid-cols-2 gap-7 z-50 text-left"
                  >
                    <div>
                      <h4 className="text-[10px] font-mono text-[#D4AF37] tracking-[0.2em] uppercase border-b border-white/5 pb-2 mb-3">
                        By Precious Metals
                      </h4>
                      <ul className="space-y-3">
                        <li>
                          <button
                            onClick={() => {
                              setCurrentPage('gold');
                              setSelectedProductId(null);
                            }}
                            className="text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="text-[#D4AF37]">✧</span> Gold Treasures (Kundan & Haram)
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentPage('silver');
                              setSelectedProductId(null);
                            }}
                            className="text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="text-gray-400">✧</span> Silver Minimalist Twists
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentPage('diamond');
                              setSelectedProductId(null);
                            }}
                            className="text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="text-[#FCF6BA]">✧</span> Diamond Infinity Crown Halo
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentPage('precious-stones');
                              setSelectedProductId(null);
                            }}
                            className="text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="text-emerald-400">✧</span> Precious Stones Chamber
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-mono text-[#D4AF37] tracking-[0.2em] uppercase border-b border-white/5 pb-2 mb-3">
                        Experience Rooms
                      </h4>
                      <ul className="space-y-3">
                        <li>
                          <button
                            onClick={() => {
                              setCurrentPage('bridal');
                              setSelectedProductId(null);
                            }}
                            className="text-xs text-gray-300 hover:text-white transition-colors text-amber-100/90 cursor-pointer"
                          >
                            Matrimonial Bridal Suite
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCurrentPage('showroom')}
                            className="text-xs text-[#D4AF37] hover:text-yellow-600 transition-all font-semibold flex items-center gap-2 cursor-pointer duration-300"
                          >
                            <span>Enter 360° Showroom</span> <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCurrentPage('gifts')}
                            className="text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
                          >
                            Personal Gift Finder Suite
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCurrentPage('membership')}
                            className="text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
                          >
                            Royal Membership Club
                          </button>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setCurrentPage('shop');
                setSelectedProductId(null);
              }}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                currentPage === 'shop' ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-gray-300'
              }`}
            >
              Shop
            </button>

            <button
              onClick={() => setCurrentPage('gifts')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                currentPage === 'gifts' ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-gray-300'
              }`}
            >
              Gifting
            </button>

            <button
              onClick={() => setCurrentPage('stories')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                currentPage === 'stories' ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-gray-300'
              }`}
            >
              Legends
            </button>
          </nav>

          {/* Desktop Right Action Handlers */}
          <div className="flex items-center gap-4.5 z-10">
            {/* Active Aura Indicators */}
            <span
              id="active-aura-badge"
              onClick={() => setCurrentPage('moods')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] tracking-wider uppercase cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Ambiance: {currentMood}
            </span>

            {/* Wishlist Icon */}
            <button
              onClick={() => {
                if (!user) setAuthModalOpen(true);
                else setCurrentPage('wishlist');
              }}
              className="relative p-2 hover:bg-white/5 text-gray-300 hover:text-white rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title="Portfolio Portfolio"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping cart icon */}
            <button
              onClick={() => {
                if (!user) setAuthModalOpen(true);
                else setCurrentPage('cart');
              }}
              className="relative p-2 hover:bg-white/5 text-gray-300 hover:text-white rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title="Acquisition Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.reduce((a, b) => a + b.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            {/* User Login/Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!user) {
                    setAuthModalOpen(true);
                  } else {
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }
                }}
                className={`relative p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                  user ? 'text-[#D4AF37] hover:bg-[#D4AF37]/10' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
                title={user ? 'Your Profile' : 'Login'}
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {user && profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-[#0B0B0B] border border-[#D4AF37]/30 shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-50 p-4 flex flex-col font-mono text-[11px] tracking-wider rounded-none"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="border-b border-white/5 pb-3 mb-3">
                      <p className="text-[#D4AF37] font-serif text-xs uppercase tracking-widest truncate">
                        {user.user_metadata?.full_name || 'Bespoke Member'}
                      </p>
                      <p className="text-gray-500 text-[9px] lowercase truncate mt-1">{user.email}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setCurrentPage('membership');
                          setProfileDropdownOpen(false);
                        }}
                        className="text-left py-1 text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 uppercase text-[10px] cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5" /> Royal Membership
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            navigate('/admin');
                          }}
                          className="text-left py-1 text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 uppercase text-[10px] cursor-pointer"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" /> Command Center
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          try {
                            const { error } = await supabase.auth.signOut();
                            if (error) throw error;
                            toast.success('Sign out successful.');
                            setCurrentPage('home');
                          } catch (err: any) {
                            toast.error(err.message || 'Error signing out.');
                          }
                        }}
                        className="text-left py-1.5 mt-2 border-t border-white/5 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 uppercase text-[10px] cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Secure Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-white hover:bg-white/5 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-OUT OVERLAY HARNESS */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden lg:hidden"
            >
              <div className="p-6 flex flex-col gap-4 text-sm font-mono tracking-widest uppercase">
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setSelectedProductId(null);
                  }}
                  className="text-left py-2 border-b border-white/5 text-gray-300 hover:text-white"
                >
                  Home Layout
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('shop');
                    setSelectedProductId(null);
                  }}
                  className="text-left py-2 border-b border-white/5 text-gray-300 hover:text-white"
                >
                  Shop Catalog
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('showroom');
                  }}
                  className="text-left py-2 border-b border-white/5 text-[#D4AF37] hover:text-yellow-600 font-semibold"
                >
                  360° Virtual Showroom
                </button>
                <button
                  onClick={() => setCurrentPage('gifts')}
                  className="text-left py-2 border-b border-white/5 text-gray-300 hover:text-white"
                >
                  Gifting Finder
                </button>
                <button
                  onClick={() => setCurrentPage('stories')}
                  className="text-left py-2 border-b border-white/5 text-gray-300 hover:text-white"
                >
                  Artisanal Sagas
                </button>
                
                {/* Specific mobile categories list */}
                <div className="pt-2 text-[10px] text-gray-500">
                  <p className="mb-2">PRECIOUS CATEGORIES</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setCurrentPage('gold')} className="py-1 px-2 border border-white/5 rounded text-left text-xs uppercase">Gold Treasures</button>
                    <button onClick={() => setCurrentPage('silver')} className="py-1 px-2 border border-white/5 rounded text-left text-xs uppercase">Silver Twists</button>
                    <button onClick={() => setCurrentPage('diamond')} className="py-1 px-2 border border-white/5 rounded text-left text-xs uppercase">Diamonds</button>
                    <button onClick={() => setCurrentPage('precious-stones')} className="py-1 px-2 border border-white/5 rounded text-left text-xs uppercase">Gemstones</button>
                    <button onClick={() => setCurrentPage('bridal')} className="py-1 px-2 border border-white/5 rounded text-left text-xs uppercase">Bridal Suite</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CORE VIEW MODULE ROUTER CONTROLLER */}
      <main id="luxeora-main-viewport" className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {/* View renders */}
            {currentPage === 'home' && (
              <>
                <HomeView
                  onSelectProduct={(id) => {
                    setSelectedProductId(id);
                    setCurrentPage('product-details');
                  }}
                  onNavigate={setCurrentPage}
                  onAddToWishlist={handleAddToWishlist}
                  wishlist={wishlist}
                />
                
                {/* Interactive Jewelry Matcher styled in middle of homepage to hit user specifications */}
                <JewelleryMatcher
                  products={PRODUCTS}
                  onSelectProduct={(id) => {
                    setSelectedProductId(id);
                    setCurrentPage('product-details');
                  }}
                  onAddToCart={handleAddToCart}
                />

                {/* Mood Selection component integrated */}
                <MoodSelector currentMood={currentMood} onMoodSelect={setCurrentMood} />
              </>
            )}

            {currentPage === 'shop' && (
              <ProductViews
                products={PRODUCTS}
                selectedProductId={null}
                onSelectProduct={(id) => {
                  setSelectedProductId(id);
                  setCurrentPage('product-details');
                }}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
                activeCategoryFilter="all"
              />
            )}

            {currentPage === 'product-details' && (
              <ProductViews
                products={PRODUCTS}
                selectedProductId={selectedProductId}
                onSelectProduct={(id) => {
                  setSelectedProductId(id);
                  if (!id) setCurrentPage('shop');
                }}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
              />
            )}

            {/* Custom pre-filtered category routing */}
            {(currentPage === 'gold' ||
              currentPage === 'silver' ||
              currentPage === 'diamond' ||
              currentPage === 'precious-stones' ||
              currentPage === 'bridal') && (
              <ProductViews
                products={PRODUCTS}
                selectedProductId={null}
                onSelectProduct={(id) => {
                  setSelectedProductId(id);
                  setCurrentPage('product-details');
                }}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
                activeCategoryFilter={currentPage}
              />
            )}

            {currentPage === 'showroom' && (
              <VirtualShowroom
                products={PRODUCTS}
                onSelectProduct={(id) => {
                  setSelectedProductId(id);
                  setCurrentPage('product-details');
                }}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
              />
            )}

            {currentPage === 'gifts' && (
              <GiftingExperience
                products={PRODUCTS}
                onSelectProduct={(id) => {
                  setSelectedProductId(id);
                  setCurrentPage('product-details');
                }}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentPage === 'moods' && (
              <div className="py-12">
                <MoodSelector currentMood={currentMood} onMoodSelect={setCurrentMood} />
              </div>
            )}

            {currentPage === 'membership' && <RoyalMembership />}
            {currentPage === 'stories' && <StoryCollections />}
            {currentPage === 'faq' && <FAQPage />}
            {currentPage === 'contact' && <ContactPage />}
            {currentPage === 'support' && <CustomerSupportPage />}

            {currentPage === 'about' && (
              <div className="py-20 max-w-4xl mx-auto px-4 text-center space-y-8 text-white">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
                  The Atelier Heritage
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif">Maison Luxeora Saga</h1>
                <p className="text-xs text-gray-400 font-mono tracking-widest mt-1">EST. PARIS 1886</p>
                
                <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200"
                    alt="Atelier workshop drafting"
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>

                <div className="space-y-6 text-xs text-gray-350 leading-relaxed font-light font-sans text-left">
                  <p>
                    Luxeora represents the pinnacle of sovereign design filigree and ethical diamond sourcing. Built initially as a family atelier catering to historical Parisian and Indian court nobles, Maison Luxeora now coordinates with international assay laboratories to ensure the purity of every carat points set inside our vault studios.
                  </p>
                  <p>
                    Every natural diamond is certified directly under microscopes in our Antwerp bureaus. We reject conflict materials and generic machine molds in favor of handwork constructed by sixth-generation artists who dedicate up to 250 hours to complete a single Imperial Choker.
                  </p>
                  <p>
                    By merging traditional excellence with a virtual 360° rotation lounge and an advanced personal AI Concierge Consultant, we redefine how royalty, collectors, and wedding planners acquire historic personal emblems.
                  </p>
                </div>
              </div>
            )}

            {(currentPage === 'wishlist' || currentPage === 'cart') && (
              <CartViews
                onSelectProduct={(id) => {
                  setSelectedProductId(id);
                  setCurrentPage('product-details');
                }}
                cartItems={cart}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveCartItem={handleRemoveCartItem}
                wishlist={wishlist}
                onRemoveWishlistItem={handleAddToWishlist}
                onAddToCart={handleAddToCart}
                onNavigate={setCurrentPage}
                onClearCart={handleClearCart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* UNIVERSALLY ATTACHED AI FLOATING CHATBOT CONCIERGE WIDGET */}
      <Chatbot
        currentMood={currentMood}
        products={PRODUCTS}
        onSelectProduct={(id) => {
          setSelectedProductId(id);
          setCurrentPage('product-details');
        }}
        onSelectPage={setCurrentPage}
      />

      {/* LUXURY MULTI-COLUMN BRASSED FOOTER */}
      <footer id="luxeora-footer" className="bg-[#050505] text-gray-400 text-xs py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 items-start text-left">
          
          {/* Column Brand info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-serif text-md tracking-[0.2em] text-white font-bold">LUXEORA</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-sm font-light text-gray-500">
              Upholding high jewelry traditions across government BIS assays and GIA conflict-free solitaire extractions. Design your heritage unboxing.
            </p>
            <span className="text-[10px] font-mono block text-[#D4AF37]">
               © 2026 Maison Luxeora. Strictly Sovereign Assets.
            </span>
          </div>

          {/* Column Curated links */}
          <div className="space-y-3">
            <h5 className="font-serif font-semibold text-white uppercase tracking-wider text-xs">Exhibitions</h5>
            <ul className="space-y-2 text-[11px] font-light font-mono">
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">Catalogues Suite</button></li>
              <li><button onClick={() => setCurrentPage('showroom')} className="hover:text-white transition-colors text-[#D4AF37]">360° Virtual Lounge</button></li>
              <li><button onClick={() => setCurrentPage('gifts')} className="hover:text-white transition-colors">Digital Gift Cards</button></li>
              <li><button onClick={() => setCurrentPage('stories')} className="hover:text-white transition-colors">Craftsmanship Legends</button></li>
            </ul>
          </div>

          {/* Column support */}
          <div className="space-y-3">
            <h5 className="font-serif font-semibold text-white uppercase tracking-wider text-xs">Assistance</h5>
            <ul className="space-y-2 text-[11px] font-light font-mono">
              <li><button onClick={() => setCurrentPage('faq')} className="hover:text-white transition-colors">Knowledge Base (FAQ)</button></li>
              <li><button onClick={() => setCurrentPage('support')} className="hover:text-white transition-colors">BIS Hallmark Checker</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">Viewing Reserves</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">Atelier Saga</button></li>
            </ul>
          </div>

          {/* Column newsletter */}
          <div className="space-y-3">
            <h5 className="font-serif font-semibold text-white uppercase tracking-wider text-xs">The Ledger Club</h5>
            <p className="text-[10px] leading-relaxed text-gray-500">
              Submit your telephone line to receive private updates on diamond collections.
            </p>
            <div className="flex rounded overflow-hidden border border-white/10 text-[10px]">
              <input type="text" placeholder="Line number..." className="flex-1 bg-zinc-900 border-0 px-2.5 outline-none font-mono py-1.5" />
              <button className="bg-white/5 hover:bg-white/10 px-2.5 text-white uppercase font-mono tracking-wider" onClick={() => alert('Credentials ledger updated.')}>Save</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Login / Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
