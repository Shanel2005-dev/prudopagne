import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, X, ImagePlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCategories } from '../hooks/useCatalog';
import AdminLayout from '../components/AdminLayout';
import type { ProductPhoto } from '../types';

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [designation, setDesignation] = useState('');
  const [reference, setReference] = useState('');
  const [prix, setPrix] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [existingPhotos, setExistingPhotos] = useState<ProductPhoto[]>([]);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
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
        setExistingPhotos(data.photos ?? []);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!newFile) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(newFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newFile]);

  const removeExistingPhoto = async (photo: ProductPhoto) => {
    await supabase.from('product_photos').delete().eq('id', photo.id);
    const path = photo.url.split('/photos/')[1];
    if (path) await supabase.storage.from('photos').remove([path]);
    setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const price = Number(prix);
    const hasPhoto = !!newFile || (isEdit && existingPhotos.length > 0);
    if (!designation.trim() || !Number.isFinite(price) || price <= 0 || !hasPhoto) {
      setError('Renseigne une désignation, un prix positif et une photo.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      designation: designation.trim(),
      reference: reference || null,
      prix: price,
      category_id: categoryId || null,
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

    if (newFile) {
      for (const photo of existingPhotos) {
        await supabase.from('product_photos').delete().eq('id', photo.id);
        const oldPath = photo.url.split('/photos/')[1];
        if (oldPath) await supabase.storage.from('photos').remove([oldPath]);
      }

      const path = `${productId}/${Date.now()}-${newFile.name}`;
      const { error: uploadError } = await supabase.storage.from('photos').upload(path, newFile);
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path);
      const { error: photoError } = await supabase.from('product_photos').insert({
        product_id: productId,
        url: urlData.publicUrl,
        position: 0,
      });
      if (photoError) {
        setError(photoError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    navigate('/admin/produits');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-[#A89A8E]">Chargement…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="py-10 px-5">
      <div className="max-w-2xl mx-auto">
        <Link to="/admin/produits" className="flex items-center gap-1 text-sm text-[#5A5A5A] hover:text-[#8B1E3F] transition-colors mb-6">
          <ChevronLeft size={16} /> Retour aux produits
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-7 space-y-5">
          <h1 className="font-display text-2xl text-[#1C1C1C]">{isEdit ? 'Modifier le pagne' : 'Ajouter un pagne'}</h1>

          {error && <p className="bg-red-50 text-red-700 text-sm rounded-lg p-3">{error}</p>}

          <div>
            <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Désignation *</label>
            <input required value={designation} onChange={(e) => setDesignation(e.target.value)}
              placeholder="Ex: Pagne wax fleuri bleu"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Prix (FCFA) *</label>
              <input required type="number" min="1" step="1" value={prix} onChange={(e) => setPrix(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25" />
            </div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Référence</label>
              <input value={reference} onChange={(e) => setReference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25" />
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Catégorie</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25">
              <option value="">Sans catégorie</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-2.5">Photo *</label>
            <div className="flex flex-wrap gap-3">
              {!newFile && existingPhotos.slice(0, 1).map((photo) => (
                <div key={photo.id} className="relative w-20 h-20">
                  <img src={photo.url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => removeExistingPhoto(photo)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {previewUrl && (
                <div className="relative w-20 h-20">
                  <img src={previewUrl} alt="Aperçu de la photo sélectionnée" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => setNewFile(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
              )}
              {!newFile && existingPhotos.length === 0 && (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[#8B1E3F]/20 flex items-center justify-center cursor-pointer hover:border-[#8B1E3F]/50 transition-colors">
                  <ImagePlus size={20} className="text-[#A89A8E]" />
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setNewFile(e.target.files?.[0] ?? null)} />
                </label>
              )}
              {(newFile || existingPhotos.length > 0) && (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[#8B1E3F]/20 flex items-center justify-center cursor-pointer hover:border-[#8B1E3F]/50 transition-colors">
                <ImagePlus size={20} className="text-[#A89A8E]" />
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setNewFile(e.target.files?.[0] ?? null)} />
                </label>
              )}
            </div>
            {!isEdit && !newFile && <p className="text-xs text-[#8B1E3F] mt-2">Une photo est obligatoire.</p>}
          </div>

          <button type="submit" disabled={saving || !designation.trim() || Number(prix) <= 0 || (!newFile && (!isEdit || existingPhotos.length === 0))}
            className="w-full bg-[#8B1E3F] text-[#FFF9F3] py-3 rounded-full font-medium tracking-wide hover:bg-[#6E1732] transition-colors disabled:opacity-60">
            {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Ajouter le pagne'}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
}
