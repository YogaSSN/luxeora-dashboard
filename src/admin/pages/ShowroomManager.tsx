import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ShowroomZone } from '../../types';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShowroomManager() {
  const [zones, setZones] = useState<ShowroomZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      const { data, error } = await supabase.from('showroom_zones').select('*');
      if (error) toast.error(error.message);
      else setZones(data || []);
      setLoading(false);
    };
    fetchZones();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#D4AF37] mb-6">Showroom Zones</h2>
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map(zone => (
            <div key={zone.id} className="bg-[#161B22] rounded-xl overflow-hidden border border-white/5 shadow-xl">
              <div className="h-40 overflow-hidden relative">
                <img src={zone.imageUrl} alt={zone.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-serif text-[#D4AF37]">{zone.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-400 mb-4">{zone.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-mono bg-black/50 px-2 py-1 rounded">Spotlight: {zone.spotlightTarget}</span>
                  <button className="text-[#D4AF37] hover:underline">Edit Hotspots</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
