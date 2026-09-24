import { useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useProducts } from '../hooks/useCatalog';

export default function AdminHistoryPage() {
  const { products, loading } = useProducts();

  const ventes = useMemo(() => {
    return products
      .filter((p) => p.statut === 'vendu')
      .sort((a, b) => new Date(b.vendu_at ?? b.created_at).getTime() - new Date(a.vendu_at ?? a.created_at).getTime());
  }, [products]);

  const total = ventes.reduce((sum, p) => sum + p.prix, 0);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 md:p-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl text-[#1C1C1C]">Historique des ventes</h1>
          <p className="text-[#5A5A5A] text-sm">
            <span className="font-display text-xl text-[#8B1E3F]">{total.toLocaleString()} F</span> · {ventes.length} vente{ventes.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 overflow-hidden">
          {loading ? (
            <p className="p-10 text-center text-[#A89A8E]">Chargement…</p>
          ) : ventes.length === 0 ? (
            <p className="p-10 text-center text-[#A89A8E]">Aucune vente enregistrée pour l'instant.</p>
          ) : (
            <div className="divide-y divide-[#8B1E3F]/8">
              {ventes.map((p) => (
                <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-4">
                  <img src={p.photos[0]?.url} alt="" className="w-14 h-14 rounded-lg object-cover bg-[#F3E9DE] shrink-0 grayscale opacity-70" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1C1C] truncate">{p.designation}</p>
                    <p className="text-sm text-[#5A5A5A]">{p.category?.nom ?? 'Sans catégorie'}{p.reference ? ` · Réf. ${p.reference}` : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-[#8B1E3F]">{p.prix.toLocaleString()} FCFA</p>
                    <p className="text-xs text-[#A89A8E]">
                      {p.vendu_at ? new Date(p.vendu_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
