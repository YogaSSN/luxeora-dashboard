import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close if already logged in
  if (user && isOpen) {
    onClose();
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        // In Supabase, if email confirmations are off, this logs them in immediately.
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden border border-[#D4AF37]/30 bg-[#0B0B0B] p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)] rounded-none"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-[#D4AF37]"
            >
              <X size={20} />
            </button>

            <div className="mb-8 text-center">
              <h2 className="font-serif text-2xl tracking-widest text-[#D4AF37]">
                {isLogin ? 'SECURE LOGIN' : 'CREATE VAULT'}
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                {isLogin
                  ? 'Access your private collections and secure cart.'
                  : 'Establish your private sanctuary for luxury acquisition.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-gray-800 bg-[#161B22] py-2 pl-10 pr-4 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                      placeholder="Your preferred title"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-800 bg-[#161B22] py-2 pl-10 pr-4 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-800 bg-[#161B22] py-2 pl-10 pr-4 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-400 text-center border border-red-900/50 bg-red-900/10 p-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-[#D4AF37] bg-transparent py-3 text-sm tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black flex justify-center items-center"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (isLogin ? 'AUTHENTICATE' : 'INITIALIZE')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                {isLogin ? 'Apply for Vault Access' : 'Return to Login'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
