import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useCategories, useProducts } from '../hooks/useCatalog';
import ProductCard from '../components/ProductCard';

export default function CataloguePage() {
  const [params, setParams] = useSearchParams();
  const categorie = params.get('categorie') || '';
  const [query, setQuery] = useState('');
  const { categories } = useCategories();
  const { products, loading } = useProducts();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategorie = !categorie || p.category_id === categorie;
      const matchQuery = !query || p.designation.toLowerCase().includes(query.toLowerCase());
      return matchCategorie && matchQuery;
    });
  }, [products, categorie, query]);

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl text-[#1C1C1C] mb-8">Le catalogue</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A8E]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un pagne…"
              className="w-full pl-10 pr-3 py-2.5 rounded-full border border-[#8B1E3F]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-[#8B1E3F]/10">
          <button
            onClick={() => setParams(query ? { categorie: '' } : {})}
            className={`px-4 py-1.5 rounded-full text-sm tracking-wide transition-colors ${!categorie ? 'bg-[#8B1E3F] text-[#FFF9F3]' : 'text-[#5A5A5A] border border-[#8B1E3F]/15 hover:border-[#8B1E3F]/40'}`}
          >
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParams({ categorie: c.id })}
              className={`px-4 py-1.5 rounded-full text-sm tracking-wide transition-colors ${categorie === c.id ? 'bg-[#8B1E3F] text-[#FFF9F3]' : 'text-[#5A5A5A] border border-[#8B1E3F]/15 hover:border-[#8B1E3F]/40'}`}
            >
              {c.nom}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-[#A89A8E] py-16">Chargement…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#A89A8E] py-16">Aucun pagne ne correspond à votre recherche.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-10">
            <AnimatePresence initial={false}>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
