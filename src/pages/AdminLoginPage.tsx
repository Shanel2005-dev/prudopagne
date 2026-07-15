import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminSession } from '../hooks/useAdminSession';

export default function AdminLoginPage() {
  const { isAdmin, loading } = useAdminSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (authError) {
      setError('Identifiant ou mot de passe incorrect.');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="bg-[#FFF9F3] rounded-2xl p-9 w-full max-w-sm">
        <div className="w-11 h-11 rounded-full bg-[#8B1E3F] flex items-center justify-center mb-5">
          <Lock className="text-[#D4AF37]" size={18} />
        </div>
        <h1 className="font-display text-2xl text-[#1C1C1C] mb-1">Espace admin</h1>
        <p className="text-[#5A5A5A] text-sm mb-7">Connectez-vous pour gérer le catalogue.</p>

        {error && <p className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</p>}

        <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25"
        />
        <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Mot de passe</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-7 px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25"
        />
        <button type="submit" disabled={submitting}
          className="w-full bg-[#8B1E3F] text-[#FFF9F3] py-3 rounded-full font-medium tracking-wide hover:bg-[#6E1732] transition-colors disabled:opacity-60">
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
