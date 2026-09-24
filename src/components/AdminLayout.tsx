import { Link, useLocation, useNavigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { LayoutDashboard, Shirt, History, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const navItems = [
  { to: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard, exact: true },
  { to: '/admin/produits', label: 'Produits', icon: Shirt },
  { to: '/admin/historique', label: 'Historique des ventes', icon: History },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex">
      <aside className="w-64 shrink-0 bg-[#1C1C1C] text-[#BFB6AE] flex flex-col sticky top-0 h-screen">
        <div className="px-6 py-7 mb-2 flex items-baseline gap-0.5">
          <span className="font-display text-xl text-[#FFF9F3]">Prudo</span>
          <span className="font-display text-xl italic text-[#D4AF37]">Pagne</span>
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
              <Icon size={17} className={isActive(to, exact) ? 'text-[#D4AF37]' : ''} /> {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mx-3 mb-6 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm tracking-wide hover:bg-white/5 hover:text-[#FFF9F3] transition-colors"
        >
          <LogOut size={17} /> Déconnexion
        </button>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}