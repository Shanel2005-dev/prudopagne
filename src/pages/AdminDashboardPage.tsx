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
    <div className="min-h-screen bg-[#FDF8F0] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800">Tableau de bord</h1>
          <div className="flex items-center gap-2">
            <Link to="/admin/produits/nouveau" className="flex items-center gap-1.5 bg-[#9A3412] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#7C2D12] transition-colors">
              <Plus size={16} /> Ajouter un pagne
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-500 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#FDF1E7] flex items-center justify-center shrink-0"><Package size={20} className="text-[#9A3412]" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.count}</p>
              <p className="text-gray-400 text-sm">Pagnes en stock</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#FDF1E7] flex items-center justify-center shrink-0"><Wallet size={20} className="text-[#9A3412]" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.valeurStock.toLocaleString()} F</p>
              <p className="text-gray-400 text-sm">Valeur estimée du stock</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#FDF1E7] flex items-center justify-center shrink-0"><TrendingUp size={20} className="text-[#9A3412]" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.revenu.toLocaleString()} F</p>
              <p className="text-gray-400 text-sm">Revenu (articles vendus)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-bold text-gray-700">Mes pagnes</div>
          {loading ? (
            <p className="p-8 text-center text-gray-400">Chargement…</p>
          ) : products.length === 0 ? (
            <p className="p-8 text-center text-gray-400">Aucun pagne pour l'instant. Ajoutez-en un !</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4">
                  <img src={p.photos[0]?.url} alt="" className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{p.designation}</p>
                    <p className="text-sm text-gray-400">{p.prix.toLocaleString()} FCFA · {p.category?.nom ?? 'Sans catégorie'}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${p.statut === 'vendu' ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'}`}>
                    {p.statut === 'vendu' ? 'Vendu' : 'Disponible'}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleStatut(p.id, p.statut)} title={p.statut === 'vendu' ? 'Remettre en stock' : 'Marquer vendu'}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                      {p.statut === 'vendu' ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                    <Link to={`/admin/produits/${p.id}/modifier`} title="Modifier" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
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
