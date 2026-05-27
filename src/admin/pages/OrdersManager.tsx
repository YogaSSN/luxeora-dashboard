import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, PackageOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false });
      if (error) toast.error(error.message);
      else setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#D4AF37] mb-6">Orders Manager</h2>
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-[#161B22] border border-white/5 rounded-xl">
          <PackageOpen size={48} className="text-gray-600 mb-4" />
          <p className="text-gray-400">No orders placed yet.</p>
        </div>
      ) : (
        <div className="bg-[#161B22] border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#111] text-gray-400 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{order.id.split('-')[0]}...</td>
                  <td className="px-6 py-4">
                    <p className="text-white">{order.profiles?.full_name}</p>
                    <p className="text-xs text-gray-500">{order.profiles?.email}</p>
                  </td>
                  <td className="px-6 py-4">${order.total_amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
