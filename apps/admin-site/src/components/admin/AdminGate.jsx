import React, { useState } from 'react';
import { Lock, ShieldCheck, Mail } from 'lucide-react';
import Button from '../shared/Button.jsx';
import { supabase } from '../../lib/supabase.js';

export default function AdminGate({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || 'Invalid credentials.');
    } else if (data?.user) {
      onAuthenticated(data.user);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-bauhaus-surface border-4 border-bauhaus-border p-8 shadow-bauhaus-lg sharp">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-bauhaus-red text-white border-2 border-bauhaus-border flex items-center justify-center shadow-bauhaus-red sharp">
          <ShieldCheck size={28} />
        </div>
      </div>

      <h2 className="text-xl font-black uppercase text-center text-bauhaus-ink mb-1">
        ADMIN GATEWAY
      </h2>
      <p className="text-xs font-mono text-center text-bauhaus-muted mb-6 uppercase font-bold">
        SUPABASE AUTH — AUTHORISED PERSONNEL ONLY
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
            EMAIL
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bauhaus-muted pointer-events-none" />
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@youremail.com"
              className="w-full pl-9 pr-3 py-3 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold text-bauhaus-ink placeholder-bauhaus-muted sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
            PASSWORD
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bauhaus-muted pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-3 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold text-bauhaus-ink placeholder-bauhaus-muted sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow"
            />
          </div>

          {error && (
            <div className="text-xs font-bold text-bauhaus-red mt-1.5 uppercase font-mono">
              ✕ {error}
            </div>
          )}
        </div>

        <Button variant="primary" size="md" className="w-full" type="submit" disabled={loading}>
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE SESSION →'}
        </Button>
      </form>
    </div>
  );
}
