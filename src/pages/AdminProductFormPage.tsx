import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, X, ImagePlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCategories } from '../hooks/useCatalog';
import type { ProductPhoto, ProductStatus } from '../types';

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [designation, setDesignation] = useState('');
  const [reference, setReference] = useState('');
  const [prix, setPrix] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [statut, setStatut] = useState<ProductStatus>('disponible');
  const [existingPhotos, setExistingPhotos] = useState<ProductPhoto[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    supabase.from('products').select('*, photos:product_photos(*)').eq('id', id).single().then(({ data }) => {
      if (data) {
        setDesignation(data.designation);
        setReference(data.reference ?? '');
        setPrix(String(data.prix));
        setCategoryId(data.category_id ?? '');
        setStatut(data.statut);
        setExistingPhotos(data.photos ?? []);
      }
      setLoading(false);
    });
  }, [id]);

  const removeExistingPhoto = async (photo: ProductPhoto) => {
    await supabase.from('product_photos').delete().eq('id', photo.id);
    const path = photo.url.split('/photos/')[1];
    if (path) await supabase.storage.from('photos').remove([path]);
    setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      designation,
      reference: reference || null,
      prix: Number(prix),
      category_id: categoryId || null,
      statut,
    };

    let productId = id;
    if (isEdit) {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', id);
      if (updateError) { setError(updateError.message); setSaving(false); return; }
    } else {
      const { data, error: insertError } = await supabase.from('products').insert(payload).select('id').single();
      if (insertError || !data) { setError(insertError?.message ?? 'Erreur'); setSaving(false); return; }
      productId = data.id;
    }

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const path = `${productId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('photos').upload(path, file);
      if (uploadError) { setError(uploadError.message); continue; }
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path);
      await supabase.from('product_photos').insert({
        product_id: productId,
        url: urlData.publicUrl,
        position: existingPhotos.length + i,
      });
    }

    setSaving(false);
    navigate('/admin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement…</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/admin" className="flex items-center gap-1 text-[#9A3412] hover:underline mb-6">
          <ChevronLeft size={18} /> Retour au tableau de bord
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Modifier le pagne' : 'Ajouter un pagne'}</h1>

          {error && <p className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Désignation *</label>
            <input required value={designation} onChange={(e) => setDesignation(e.target.value)}
              placeholder="Ex: Pagne wax fleuri bleu"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Prix (FCFA) *</label>
              <input required type="number" min="0" value={prix} onChange={(e) => setPrix(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Référence</label>
              <input value={reference} onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Catégorie</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30">
                <option value="">Sans catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Statut</label>
              <select value={statut} onChange={(e) => setStatut(e.target.value as ProductStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A3412]/30">
                <option value="disponible">Disponible</option>
                <option value="vendu">Vendu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Photos (une par couleur)</label>
            <div className="flex flex-wrap gap-3">
              {existingPhotos.map((photo) => (
                <div key={photo.id} className="relative w-20 h-20">
                  <img src={photo.url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => removeExistingPhoto(photo)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {newFiles.map((file, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#9A3412] transition-colors">
                <ImagePlus size={20} className="text-gray-400" />
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => setNewFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])} />
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-[#9A3412] text-white py-3 rounded-xl font-bold hover:bg-[#7C2D12] transition-colors disabled:opacity-60">
            {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Ajouter le pagne'}
          </button>
        </form>
      </div>
    </div>
  );
}
