import { Link } from 'react-router-dom';
import { Trash2, CheckCircle2, RotateCcw, Pencil, Plus } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import { useProducts } from '../hooks/useCatalog';

export default function AdminProductsPage() {
  const { products, loading, reload } = useProducts();

  const toggleStatut = async (id: string, statut: 'disponible' | 'vendu') => {
    const next = statut === 'vendu' ? 'disponible' : 'vendu';
    await supabase.from('products').update({
      statut: next,
      vendu_at: next === 'vendu' ? new Date().toISOString() : null,
    }).eq('id', id);
    reload();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer définitivement ce pagne ?')) return;
    await supabase.from('products').delete().eq('id', id);
    reload();
  };

  return (
    <AdminLayout>
      <div className="p-8 md:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-[#1C1C1C]">Produits</h1>
          <Link
            to="/admin/produits/nouveau"
            className="flex items-center gap-2 bg-[#8B1E3F] text-[#FFF9F3] px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#6E1732] transition-colors"
          >
            <Plus size={16} /> Ajouter un pagne
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 overflow-hidden">
          {loading ? (
            <p className="p-10 text-center text-[#A89A8E]">Chargement…</p>
          ) : products.length === 0 ? (
            <p className="p-10 text-center text-[#A89A8E]">Aucun pagne pour l'instant. Ajoutez-en un !</p>
          ) : (
            <div className="divide-y divide-[#8B1E3F]/8">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4">
                  <img src={p.photos[0]?.url} alt="" className="w-14 h-14 rounded-lg object-cover bg-[#F3E9DE] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1C1C] truncate">{p.designation}</p>
                    <p className="text-sm text-[#5A5A5A]">{p.prix.toLocaleString()} FCFA · {p.category?.nom ?? 'Sans catégorie'}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${p.statut === 'vendu' ? 'bg-[#F3E9DE] text-[#5A5A5A]' : 'bg-green-50 text-green-700'}`}>
                    {p.statut === 'vendu' ? 'Vendu' : 'Disponible'}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleStatut(p.id, p.statut)} title={p.statut === 'vendu' ? 'Remettre en stock' : 'Marquer vendu'}
                      className="p-2 rounded-lg text-[#5A5A5A] hover:bg-black/5 transition-colors">
                      {p.statut === 'vendu' ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                    <Link to={`/admin/produits/${p.id}/modifier`} title="Modifier" className="p-2 rounded-lg text-[#5A5A5A] hover:bg-black/5 transition-colors">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => deleteProduct(p.id)} title="Supprimer" className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
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
