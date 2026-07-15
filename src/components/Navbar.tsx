import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue' },
];

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E3F]/40 focus-visible:ring-offset-1';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-[#FFF9F3]/95 backdrop-blur-sm sticky top-0 z-50 border-b border-[#8B1E3F]/10">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-20">
        <Link to="/" className={`flex items-baseline gap-0.5 rounded-md px-1 -mx-1 ${FOCUS_RING}`}>
          <span className="font-display text-2xl tracking-tight text-[#1C1C1C]">Prudo</span>
          <span className="font-display text-2xl italic text-[#D4AF37]">Pagne</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className={`text-[15px] tracking-wide pb-0.5 border-b transition-colors ${FOCUS_RING} ${location.pathname === l.to ? 'text-[#8B1E3F] border-[#D4AF37]' : 'text-[#5A5A5A] border-transparent hover:text-[#8B1E3F]'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/catalogue"
            className={`bg-[#8B1E3F] text-[#FFF9F3] px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-colors hover:bg-[#6E1732] ${FOCUS_RING}`}>
            Voir les pagnes
          </Link>
        </div>
        <button
          className={`md:hidden p-2 rounded-lg text-[#1C1C1C] transition-colors hover:bg-black/5 ${FOCUS_RING}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#FFF9F3] border-t border-[#8B1E3F]/10 px-5 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-[#1C1C1C] font-medium px-2 py-2.5 rounded-lg transition-colors hover:bg-black/5 ${FOCUS_RING}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
