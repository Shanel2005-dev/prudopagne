import { Link, useLocation } from 'react-router-dom';
import { Shirt, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue' },
];

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412]/40 focus-visible:ring-offset-1';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className={`flex items-center gap-2 rounded-md px-1 -mx-1 transition-opacity hover:opacity-80 ${FOCUS_RING}`}>
          <div className="w-9 h-9 rounded-lg bg-[#9A3412] flex items-center justify-center">
            <Shirt className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold text-gray-800">Prudo<span className="text-[#B45309]">Pagne</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className={`font-medium px-3 py-2 rounded-lg transition-colors ${FOCUS_RING} ${location.pathname === l.to ? 'text-[#9A3412] bg-[#FDF1E7]' : 'text-gray-600 hover:text-[#9A3412] hover:bg-gray-50'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/catalogue"
            className={`flex items-center gap-1.5 bg-[#9A3412] text-white px-4 py-2 rounded-lg font-medium ml-1 transition-colors hover:bg-[#7C2D12] ${FOCUS_RING}`}>
            <Search size={16} /> Voir les pagnes
          </Link>
        </div>
        <button
          className={`md:hidden p-2 rounded-lg text-gray-700 transition-colors hover:bg-gray-100 ${FOCUS_RING}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-gray-700 font-medium px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-50 hover:text-[#9A3412] ${FOCUS_RING}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
