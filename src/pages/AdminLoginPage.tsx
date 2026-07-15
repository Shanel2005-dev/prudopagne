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
    <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-[#9A3412] flex items-center justify-center mb-4">
          <Lock className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Espace admin</h1>
        <p className="text-gray-400 text-sm mb-6">Connectez-vous pour gérer le catalogue.</p>

        {error && <p className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</p>}

        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30"
        />
        <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30"
        />
        <button type="submit" disabled={submitting}
          className="w-full bg-[#9A3412] text-white py-3 rounded-xl font-bold hover:bg-[#7C2D12] transition-colors disabled:opacity-60">
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
