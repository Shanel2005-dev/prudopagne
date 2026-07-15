import { Link } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import { useCategories } from '../hooks/useCatalog';
import { whatsappLink } from '../utils/whatsapp';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '22965524216';

export default function HomePage() {
  const { categories, loading } = useCategories();

  return (
    <div>
      <section className="relative bg-[#9A3412] text-white py-20 px-4 text-center overflow-hidden">
        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Des pagnes de qualité,<br />à portée de clic.</h1>
          <p className="text-white/80 text-lg mb-8">Bazin, Guipure, Dentelle et Tissus — consultez le catalogue et commandez directement sur WhatsApp.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/catalogue" className="flex items-center gap-2 bg-white text-[#9A3412] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
              <Search size={18} /> Voir le catalogue
            </Link>
            <a
              href={whatsappLink(WHATSAPP_NUMBER, 'Bonjour, je voudrais des informations sur vos pagnes.')}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] font-bold px-6 py-3 rounded-xl hover:bg-[#1ebc59] transition-colors"
            >
              <MessageCircle size={18} /> Contacter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Nos catégories</h2>
        {loading ? (
          <p className="text-center text-gray-400">Chargement…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link key={c.id} to={`/catalogue?categorie=${c.id}`}
                className="bg-[#FDF1E7] hover:bg-[#FBE4CE] rounded-2xl p-6 text-center transition-colors">
                <p className="font-bold text-[#9A3412]">{c.nom}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
