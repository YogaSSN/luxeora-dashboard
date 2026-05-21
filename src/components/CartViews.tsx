import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem } from '../types';
import { Trash2, Heart, Armchair, ShieldX, Gift, ShoppingBag, ShieldCheck, Ticket, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface CartViewsProps {
  onSelectProduct: (id: string) => void;
  cartItems: CartItem[];
  onUpdateCartQty: (id: string, qty: number) => void;
  onRemoveCartItem: (id: string) => void;
  wishlist: Product[];
  onRemoveWishlistItem: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: any) => void;
  onClearCart: () => void;
}

export default function CartViews({
  onSelectProduct,
  cartItems,
  onUpdateCartQty,
  onRemoveCartItem,
  wishlist,
  onRemoveWishlistItem,
  onAddToCart,
  onNavigate,
  onClearCart
}: CartViewsProps) {
  const [shippingMethod, setShippingMethod] = useState<'armored' | 'vault-pickup'>('armored');
  const [vaultInsuranceToggle, setVaultInsuranceToggle] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Totals calculations
  const itemsSubtotal = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const shippingCost = shippingMethod === 'armored' ? 250 : 0;
  const standardInsurance = vaultInsuranceToggle ? Math.round(itemsSubtotal * 0.015) : 0; // 1.5% lifetime insurance premium
  const promoDiscount = isPromoApplied ? Math.round(itemsSubtotal * 0.10) : 0; // 10% promo code
  const orderFinalTotal = itemsSubtotal + shippingCost + standardInsurance - promoDiscount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AURUM10' || promoCode.trim().toUpperCase() === 'SOVEREIGN') {
      setIsPromoApplied(true);
    } else {
      alert("This royal code doesn't exist in our vaults.");
    }
  };

  const handleCheckoutProcess = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      onClearCart();
    }, 1500);
  };

  return (
    <div id="cart-views-root" className="text-white bg-[#0B0B0B] min-h-[85vh] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          
          {checkoutComplete ? (
            /* SECURE CHECKOUT CONFIRMATION GRID */
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center py-16 bg-zinc-950 px-8 rounded-3xl border border-white/5 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/35 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </div>
              <span className="text-xs font-mono text-[#D4AF37] tracking-[0.3em] uppercase">Sovereign Order Processed</span>
              <h2 className="text-3xl font-serif">Acquisition Dispatch Confirmed</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Your order is stamped for private custom preparation. Brink’s armoured services have initialized transit blueprints. A private curator will coordinate telephone confirmations.
              </p>
              <div className="bg-amber-950/10 border border-[#D4AF37]/20 p-3.5 rounded-xl font-mono text-[10px] text-gray-300">
                Tracking Vault Ledger: <span className="text-[#D4AF37] font-semibold">LX-00281-SEQP</span>
              </div>
              <button
                onClick={() => {
                  setCheckoutComplete(false);
                  onNavigate('home');
                }}
                className="px-6 py-2 bg-[#D4AF37] text-black font-mono text-xs tracking-wider uppercase font-semibold rounded hover:bg-yellow-600 transition"
              >
                Return to Palace Entrance
              </button>
            </motion.div>
          ) : (
            /* SPLIT CART & WISHLIST VIEWS */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Columns left: standard Items index (col 8) */}
              <div className="lg:col-span-8 space-y-10">
                {/* 1. SHOPPING BAG ITEMS CONTAINER */}
                <div className="bg-zinc-950/40 p-6 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-baseline pb-4 border-b border-white/5 mb-6">
                    <h1 className="text-2xl font-serif flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#D4AF37]" /> Your Acquisition Basket
                    </h1>
                    <span className="text-xs font-mono text-gray-500">{cartItems.length} design files</span>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5 last:pb-0 last:border-0">
                          <div className="flex items-center gap-4">
                            <img
                              referrerPolicy="no-referrer"
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg border border-white/5 cursor-pointer hover:border-white/10"
                              onClick={() => {
                                onSelectProduct(item.product.id);
                                onNavigate('product-details');
                              }}
                            />
                            <div>
                              <h3 className="text-sm font-serif font-semibold text-white hover:text-[#D4AF37] cursor-pointer" onClick={() => {
                                onSelectProduct(item.product.id);
                                onNavigate('product-details');
                              }}>
                                {item.product.name}
                              </h3>
                              <p className="text-[10px] font-mono text-gray-500 mt-1">{item.product.metal} • {item.product.weight}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            {/* Qty adjustments */}
                            <div className="flex items-center border border-white/10 rounded overflow-hidden bg-black/60 font-mono text-xs">
                              <button
                                onClick={() => onUpdateCartQty(item.product.id, Math.max(1, item.quantity - 1))}
                                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-white/5"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 text-white">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-white/5"
                              >
                                +
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                              <p className="text-sm font-mono text-[#D4AF37] font-semibold">
                                ${(item.product.price * item.quantity).toLocaleString()}
                              </p>
                              <span className="text-[9px] font-mono text-gray-500">BIS hallmarked</span>
                            </div>

                            <button
                              onClick={() => onRemoveCartItem(item.product.id)}
                              className="p-2 bg-zinc-900 text-gray-500 hover:text-red-400 rounded-lg border border-white/5"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 opacity-30">
                      <ShoppingBag className="w-10 h-10 text-[#D4AF37] mx-auto mb-2 animate-pulse" />
                      <p className="font-serif">Acquisition Basket is Empty</p>
                      <button
                        onClick={() => onNavigate('shop')}
                        className="text-xs font-mono text-[#D4AF37] hover:underline uppercase block mx-auto mt-2 tracking-widest cursor-pointer"
                      >
                        Browse Showrooms Suite
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. SAVED WISHLIST PORTFOLIO */}
                <div className="p-6 rounded-3xl bg-zinc-950/40 border border-white/5 space-y-4 text-left">
                  <div className="flex items-baseline gap-2 pb-3 border-b border-white/5 mb-4">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-serif">Saved Masterpiece Portfolio</h3>
                    <span className="text-xs font-mono text-gray-500">({wishlist.length} catalog files)</span>
                  </div>

                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map((prod) => (
                        <div key={prod.id} className="p-3 rounded-xl border border-white/5 bg-black/60 flex items-center gap-3">
                          <img
                            src={prod.image}
                            referrerPolicy="no-referrer"
                            alt=""
                            className="w-12 h-12 rounded object-cover cursor-pointer"
                            onClick={() => {
                              onSelectProduct(prod.id);
                              onNavigate('product-details');
                            }}
                          />
                          <div className="flex-1 truncate">
                            <h4 className="text-xs font-serif font-bold text-white truncate hover:text-[#D4AF37] cursor-pointer" onClick={() => {
                              onSelectProduct(prod.id);
                              onNavigate('product-details');
                            }}>
                              {prod.name}
                            </h4>
                            <span className="text-[10px] text-[#D4AF37] font-mono">${prod.price.toLocaleString()}</span>
                          </div>
                          <div className="flex gap-1.5 h-full items-center">
                            <button
                              onClick={() => {
                                onAddToCart(prod);
                                onRemoveWishlistItem(prod);
                              }}
                              className="p-1 px-2.5 bg-white text-black font-mono text-[9px] uppercase tracking-wider rounded font-medium hover:bg-gray-200"
                            >
                              Move to bag
                            </button>
                            <button
                              onClick={() => onRemoveWishlistItem(prod)}
                              className="p-2 bg-zinc-900 border border-white/5 rounded text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 font-light italic">
                      No saved pieces currently monitored in your local portfolio tracker. Drag glowing showroom gemstone targets to stack designs.
                    </p>
                  )}
                </div>
              </div>

              {/* Column right: checkout pricing ledger (col 4) */}
              <div className="lg:col-span-4 bg-[#0F0D0A] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-6 text-left">
                <div className="pb-3 border-b border-white/5">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">Fidelity Check</span>
                  <h3 className="text-xl font-serif">Acquisition Manifest</h3>
                </div>

                {/* Sub totals list */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Valued Subtotal</span>
                    <span>${itemsSubtotal.toLocaleString()}</span>
                  </div>

                  {/* Promo applied */}
                  {isPromoApplied && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Refined Code (AURUM10)</span>
                      <span>— ${promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Armored/Vault select layout */}
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block mb-2">Transit Blueprints</span>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        onClick={() => setShippingMethod('armored')}
                        className={`py-1.5 rounded text-[10px] uppercase font-mono tracking-wider border text-center transition-colors ${
                          shippingMethod === 'armored'
                            ? 'bg-white text-black border-white font-medium'
                            : 'bg-black/40 text-gray-400 border-white/5'
                        }`}
                      >
                        Armoured Guard
                      </button>
                      <button
                        onClick={() => setShippingMethod('vault-pickup')}
                        className={`py-1.5 rounded text-[10px] uppercase font-mono tracking-wider border text-center transition-colors ${
                          shippingMethod === 'vault-pickup'
                            ? 'bg-white text-black border-white font-medium'
                            : 'bg-black/40 text-gray-400 border-white/5'
                        }`}
                      >
                        Vault Pickup
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-gray-400 pt-2 border-t border-white/5">
                    <span>Armored Freight Courier</span>
                    <span>${shippingCost.toLocaleString()}</span>
                  </div>

                  {/* Lifetime Insurance toggle */}
                  <div className="flex justify-between items-center py-2 bg-zinc-950/75 px-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={vaultInsuranceToggle}
                        onChange={(e) => setVaultInsuranceToggle(e.target.checked)}
                        className="rounded accent-[#D4AF37] cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-300">Lifetime Vault Insurances</span>
                    </div>
                    <span>${standardInsurance.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-white font-serif text-lg pt-3 border-t border-white/10 font-bold">
                    <span>Grand Royal Total</span>
                    <span className="text-[#D4AF37] font-mono">${orderFinalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Promo Input */}
                <div className="pt-4 border-t border-white/5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">Enter Guild Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. AURUM10"
                      className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-mono uppercase"
                    />
                    <button onClick={handleApplyPromo} className="bg-[#D4AF37] hover:bg-yellow-600 text-black px-3.5 rounded text-xs font-mono font-medium uppercase text-[10px]">
                      Verify
                    </button>
                  </div>
                </div>

                {/* Checkout Callout CTA */}
                <button
                  disabled={cartItems.length === 0}
                  onClick={handleCheckoutProcess}
                  className="w-full py-3 bg-[#D4AF37] disabled:opacity-30 hover:bg-yellow-600 text-black rounded-xl font-mono text-xs tracking-widest uppercase font-semibold transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" /> Commit Transacting Acquisition
                </button>
              </div>

            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
