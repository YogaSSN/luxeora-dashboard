import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Product, ShowroomZone, LuxuryMood } from '../types';
import { 
  LUXURY_MOODS_CONFIG as FALLBACK_MOODS, 
  PRODUCTS as FALLBACK_PRODUCTS, 
  SHOWROOM_ZONES as FALLBACK_ZONES, 
  STORIES as FALLBACK_STORIES 
} from '../data';

interface DataContextType {
  products: Product[];
  showroomZones: ShowroomZone[];
  stories: any[];
  luxuryMoodsConfig: Record<LuxuryMood, any>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  products: [],
  showroomZones: [],
  stories: [],
  luxuryMoodsConfig: {} as Record<LuxuryMood, any>,
  loading: true,
  refreshData: async () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showroomZones, setShowroomZones] = useState<ShowroomZone[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [luxuryMoodsConfig, setLuxuryMoodsConfig] = useState<Record<LuxuryMood, any>>({} as Record<LuxuryMood, any>);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchPromise = Promise.all([
        supabase.from('luxury_moods').select('*'),
        supabase.from('products').select('*'),
        supabase.from('product_reviews').select('*'),
        supabase.from('showroom_zones').select('*'),
        supabase.from('showroom_hotspots').select('*'),
        supabase.from('stories').select('*')
      ]);

      // Add a 7-second timeout to prevent infinite loading on ad-blockers or slow networks
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Supabase fetch timeout')), 7000);
      });

      const [moodsRes, productsRes, reviewsRes, zonesRes, hotspotsRes, storiesRes] = 
        await Promise.race([fetchPromise, timeoutPromise]) as any;

      // Assemble Moods Config
      const moodsConfig: any = { ...FALLBACK_MOODS };
      if (moodsRes.data && moodsRes.data.length > 0) {
        moodsRes.data.forEach(m => {
          moodsConfig[m.id] = m;
        });
      }
      setLuxuryMoodsConfig(moodsConfig);

      // Assemble Products
      if (productsRes.data && productsRes.data.length > 0) {
        const assembledProducts = productsRes.data.map(p => {
          const productReviews = reviewsRes.data?.filter(r => r.productId === p.id) || [];
          return { ...p, reviews: productReviews };
        });
        setProducts(assembledProducts);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }

      // Assemble Zones
      if (zonesRes.data && zonesRes.data.length > 0) {
        const assembledZones = zonesRes.data.map(z => {
          const zoneHotspots = hotspotsRes.data?.filter(h => h.zoneId === z.id) || [];
          return { ...z, hotspots: zoneHotspots };
        });
        setShowroomZones(assembledZones);
      } else {
        setShowroomZones(FALLBACK_ZONES);
      }

      if (storiesRes.data && storiesRes.data.length > 0) {
        setStories(storiesRes.data);
      } else {
        setStories(FALLBACK_STORIES);
      }
    } catch (err) {
      console.error('Error fetching global data, falling back to local dataset:', err);
      setLuxuryMoodsConfig(FALLBACK_MOODS);
      setProducts(FALLBACK_PRODUCTS);
      setShowroomZones(FALLBACK_ZONES);
      setStories(FALLBACK_STORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ products, showroomZones, stories, luxuryMoodsConfig, loading, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

