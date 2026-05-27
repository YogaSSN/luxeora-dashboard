import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Package, Users, ShoppingBag, Loader2 } from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({ products: 0, zones: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodCount, zonesCount, ordersCount] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('showroom_zones').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          products: prodCount.count || 0,
          zones: zonesCount.count || 0,
          orders: ordersCount.count || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#D4AF37] mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161B22] p-6 rounded-xl border border-white/5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <p className="text-sm text-gray-400 font-mono tracking-wider uppercase mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white">{stats.products}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-[#161B22] p-6 rounded-xl border border-white/5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <p className="text-sm text-gray-400 font-mono tracking-wider uppercase mb-1">Showroom Zones</p>
            <p className="text-3xl font-bold text-white">{stats.zones}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-[#161B22] p-6 rounded-xl border border-white/5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <p className="text-sm text-gray-400 font-mono tracking-wider uppercase mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white">{stats.orders}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <ShoppingBag size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
