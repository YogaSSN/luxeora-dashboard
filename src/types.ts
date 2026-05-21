export type LuxePage =
  | 'home'
  | 'shop'
  | 'product-details'
  | 'gold'
  | 'silver'
  | 'diamond'
  | 'precious-stones'
  | 'bridal'
  | 'about'
  | 'contact'
  | 'wishlist'
  | 'cart'
  | 'faq'
  | 'support'
  | 'showroom'
  | 'gifts'
  | 'moods'
  | 'membership'
  | 'ai-concierge'
  | 'stories';

export type LuxuryMood = 'royal' | 'romantic' | 'elegant' | 'minimal' | 'vintage' | 'bold';

export interface ProductReview {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: 'gold' | 'silver' | 'diamond' | 'precious-stones' | 'bridal';
  image: string;
  metal: string;
  stone: string;
  weight: string;
  hallmark: string;
  purity: string;
  description: string;
  longDescription: string;
  specifications: Record<string, string>;
  isTrending?: boolean;
  isFeatured?: boolean;
  reviews: ProductReview[];
}

export interface ShowroomHotspot {
  id: string;
  productId: string;
  x: number; // percentage coordinate 0-100 on canvas
  y: number; // percentage coordinate 0-100 on canvas
  title: string;
  price: string;
  shimmerColor: string;
}

export interface ShowroomZone {
  id: string;
  name: string;
  description: string;
  bgHex: string;
  imageUrl: string;
  hotspots: ShowroomHotspot[];
  spotlightTarget: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: string;
  productRecommendations?: string[]; // array of product IDs
  actions?: string[]; // Quick actions options
  isTyping?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface GiftFinderConfig {
  occasion: string;
  relationship: string;
  budget: number;
  gemstonePreference?: string;
  giftWrapping: string;
  ribbonColor: string;
  messageCard: string;
}
