import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#9A3412] flex items-center justify-center">
            <Shirt className="text-white" size={14} />
          </div>
          <span className="text-white font-bold text-sm">Prudo<span className="text-[#B45309]">Pagne</span></span>
        </div>
        <p className="text-xs">© 2026 Prudo Pagne · <Link to="/admin/connexion" className="hover:text-white transition-colors">Espace admin</Link></p>
      </div>
    </footer>
  );
}
