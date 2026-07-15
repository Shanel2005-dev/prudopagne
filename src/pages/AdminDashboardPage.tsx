import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Plus, LogOut, Package, Wallet, TrendingUp, Trash2, CheckCircle2, RotateCcw, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProducts } from '../hooks/useCatalog';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { products, loading, reload } = useProducts();

  const stats = useMemo(() => {
    const disponibles = products.filter((p) => p.statut === 'disponible');
    const vendus = products.filter((p) => p.statut === 'vendu');
    return {
      count: disponibles.length,
      valeurStock: disponibles.reduce((sum, p) => sum + p.prix, 0),
      revenu: vendus.reduce((sum, p) => sum + p.prix, 0),
    };
  }, [products]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleStatut = async (id: string, statut: 'disponible' | 'vendu') => {
    await supabase.from('products').update({ statut: statut === 'vendu' ? 'disponible' : 'vendu' }).eq('id', id);
    reload();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer définitivement ce pagne ?')) return;
    await supabase.from('products').delete().eq('id', id);
    reload();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl text-[#1C1C1C]">Tableau de bord</h1>
          <div className="flex items-center gap-2">
            <Link to="/admin/produits/nouveau" className="flex items-center gap-1.5 bg-[#8B1E3F] text-[#FFF9F3] px-5 py-2.5 rounded-full text-sm font-medium tracking-wide hover:bg-[#6E1732] transition-colors">
              <Plus size={16} /> Ajouter un pagne
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-[#5A5A5A] px-3 py-2.5 rounded-full hover:bg-black/5 transition-colors text-sm">
              <LogOut size={15} /> Déconnexion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#8B1E3F]/8 flex items-center justify-center shrink-0"><Package size={19} className="text-[#8B1E3F]" /></div>
            <div>
              <p className="font-display text-2xl text-[#1C1C1C]">{stats.count}</p>
              <p className="text-[#5A5A5A] text-sm">Pagnes en stock</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#8B1E3F]/8 flex items-center justify-center shrink-0"><Wallet size={19} className="text-[#8B1E3F]" /></div>
            <div>
              <p className="font-display text-2xl text-[#1C1C1C]">{stats.valeurStock.toLocaleString()} F</p>
              <p className="text-[#5A5A5A] text-sm">Valeur estimée du stock</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/15 flex items-center justify-center shrink-0"><TrendingUp size={19} className="text-[#B8952E]" /></div>
            <div>
              <p className="font-display text-2xl text-[#1C1C1C]">{stats.revenu.toLocaleString()} F</p>
              <p className="text-[#5A5A5A] text-sm">Revenu (articles vendus)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 overflow-hidden">
          <div className="p-5 border-b border-[#8B1E3F]/10 font-display text-lg text-[#1C1C1C]">Mes pagnes</div>
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
    </div>
  );
}
