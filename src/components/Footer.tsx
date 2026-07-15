import { Link } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';
import { whatsappLink } from '../utils/whatsapp';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '22965524216';

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-[#BFB6AE]">
      <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-baseline gap-0.5 mb-3">
            <span className="font-display text-xl text-[#FFF9F3]">Prudo</span>
            <span className="font-display text-xl italic text-[#D4AF37]">Pagne</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">Wax, Bazin, Guipure et Dentelle — une sélection de tissus choisis avec exigence.</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] mb-4">Contact</p>
          <a
            href={whatsappLink(WHATSAPP_NUMBER, 'Bonjour, je voudrais des informations sur vos pagnes.')}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-[#FFF9F3] transition-colors mb-2.5"
          >
            <MessageCircle size={15} /> Contacter sur WhatsApp
          </a>
          <p className="flex items-center gap-2 text-sm"><MapPin size={15} /> Bénin</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] mb-4">Navigation</p>
          <Link to="/catalogue" className="block text-sm hover:text-[#FFF9F3] transition-colors mb-2.5">Catalogue</Link>
          <Link to="/admin/connexion" className="block text-sm hover:text-[#FFF9F3] transition-colors">Espace admin</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-5 text-xs tracking-wide text-center">© 2026 Prudo Pagne. Tous droits réservés.</div>
      </div>
    </footer>
  );
}
