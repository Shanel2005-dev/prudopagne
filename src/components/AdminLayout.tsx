import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { KeyRound, LayoutDashboard, Menu, Shirt, History, LogOut, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const navItems = [
  { to: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard, exact: true },
  { to: '/admin/produits', label: 'Produits', icon: Shirt },
  { to: '/admin/historique', label: 'Historique des ventes', icon: History },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage('');
    if (password.length < 6) {
      setPasswordMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmation) {
      setPasswordMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      setPasswordMessage(error.message);
      return;
    }
    setPassword('');
    setConfirmation('');
    setPasswordMessage('Mot de passe mis à jour.');
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex overflow-x-hidden">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-20 bg-[#1C1C1C]/50 md:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#1C1C1C] text-[#BFB6AE] flex flex-col transition-transform duration-200 md:static md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-7 mb-2 flex items-baseline justify-between gap-0.5">
          <div>
            <span className="font-display text-xl text-[#FFF9F3]">Prudo</span>
            <span className="font-display text-xl italic text-[#D4AF37]">Pagne</span>
          </div>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-[#BFB6AE] hover:text-[#FFF9F3] md:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm tracking-wide transition-colors ${
                isActive(to, exact) ? 'bg-white/10 text-[#FFF9F3]' : 'hover:bg-white/5 hover:text-[#FFF9F3]'
              }`}
            >
              <Icon size={17} className={isActive(to, exact) ? 'text-[#D4AF37]' : ''} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={() => { setShowPasswordForm(true); setPasswordMessage(''); }}
          className="mx-3 mb-2 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm tracking-wide hover:bg-white/5 hover:text-[#FFF9F3] transition-colors"
        >
          <KeyRound size={17} /> <span>Changer le mot de passe</span>
        </button>

        <button
          onClick={handleLogout}
          className="mx-3 mb-6 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm tracking-wide hover:bg-white/5 hover:text-[#FFF9F3] transition-colors"
        >
          <LogOut size={17} /> <span>Déconnexion</span>
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="md:hidden h-16 px-4 flex items-center justify-between border-b border-[#8B1E3F]/10 bg-[#FFF9F3]">
          <span className="font-display text-lg text-[#1C1C1C]">Prudo<span className="italic text-[#D4AF37]">Pagne</span></span>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-[#1C1C1C]"
          >
            <Menu size={22} />
          </button>
        </div>
        {children}
      </main>

      {showPasswordForm && (
        <div className="fixed inset-0 z-20 bg-[#1C1C1C]/60 flex items-center justify-center px-5">
          <form onSubmit={handlePasswordUpdate} className="bg-[#FFF9F3] rounded-2xl p-7 w-full max-w-sm shadow-xl">
            <h2 className="font-display text-2xl text-[#1C1C1C] mb-2">Nouveau mot de passe</h2>
            <p className="text-[#5A5A5A] text-sm mb-6">Choisis le mot de passe qui servira pour tes prochaines connexions.</p>
            <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full mb-4 px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25"
            />
            <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Confirmer</label>
            <input
              type="password"
              required
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="w-full mb-4 px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25"
            />
            {passwordMessage && <p className="text-sm text-[#8B1E3F] mb-4">{passwordMessage}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="flex-1 border border-[#8B1E3F]/20 text-[#5A5A5A] py-2.5 rounded-full text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={savingPassword}
                className="flex-1 bg-[#8B1E3F] text-[#FFF9F3] py-2.5 rounded-full text-sm disabled:opacity-60"
              >
                {savingPassword ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}