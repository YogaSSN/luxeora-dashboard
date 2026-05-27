import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Product, ShowroomZone, LuxuryMood } from '../types';

interface DataContextType {
  products: Product[];
  showroomZones: ShowroomZone[];
  stories: any[];
  luxuryMoodsConfig: Record<LuxuryMood, any>;
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  products: [],
  showroomZones: [],
  stories: [],
  luxuryMoodsConfig: {} as Record<LuxuryMood, any>,
  loading: true,
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showroomZones, setShowroomZones] = useState<ShowroomZone[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [luxuryMoodsConfig, setLuxuryMoodsConfig] = useState<Record<LuxuryMood, any>>({} as Record<LuxuryMood, any>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodsRes, productsRes, reviewsRes, zonesRes, hotspotsRes, storiesRes] = await Promise.all([
          supabase.from('luxury_moods').select('*'),
          supabase.from('products').select('*'),
          supabase.from('product_reviews').select('*'),
          supabase.from('showroom_zones').select('*'),
          supabase.from('showroom_hotspots').select('*'),
          supabase.from('stories').select('*')
        ]);

        // Assemble Moods Config
        const moodsConfig: any = {};
        if (moodsRes.data) {
          moodsRes.data.forEach(m => {
            moodsConfig[m.id] = m;
          });
        }
        setLuxuryMoodsConfig(moodsConfig);

        // Assemble Products
        if (productsRes.data) {
          const assembledProducts = productsRes.data.map(p => {
            const productReviews = reviewsRes.data?.filter(r => r.productId === p.id) || [];
            return { ...p, reviews: productReviews };
          });
          setProducts(assembledProducts);
        }

        // Assemble Zones
        if (zonesRes.data) {
          const assembledZones = zonesRes.data.map(z => {
            const zoneHotspots = hotspotsRes.data?.filter(h => h.zoneId === z.id) || [];
            return { ...z, hotspots: zoneHotspots };
          });
          setShowroomZones(assembledZones);
        }

        if (storiesRes.data) {
          setStories(storiesRes.data);
        }
      } catch (err) {
        console.error('Error fetching global data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ products, showroomZones, stories, luxuryMoodsConfig, loading }}>
      {children}
    </DataContext.Provider>
  );
};
