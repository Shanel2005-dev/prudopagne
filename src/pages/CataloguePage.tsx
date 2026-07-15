import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#FDF8F0] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Catalogue</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un pagne…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setParams(query ? { categorie: '' } : {})}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categorie ? 'bg-[#9A3412] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParams({ categorie: c.id })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categorie === c.id ? 'bg-[#9A3412] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {c.nom}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-12">Chargement…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun pagne ne correspond à votre recherche.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
