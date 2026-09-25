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

  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [designation, setDesignation] = useState('');
  const [reference, setReference] = useState('');
  const [prix, setPrix] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [existingPhotos, setExistingPhotos] = useState<ProductPhoto[]>([]);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkColors, setBulkColors] = useState('');
  const [bulkReference, setBulkReference] = useState('');
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

  const normalizeVariants = (value: string) => value
    .split(',')
    .map((item) => item.trim().replace(/\s+/g, ' '))
    .filter(Boolean);

  const buildReferenceForVariant = (base: string, index: number) => {
    const seed = (base || 'LOT').trim();
    const sanitized = seed
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toUpperCase() || 'LOT';

    return `${sanitized}-${String(index).padStart(3, '0')}`;
  };

  const addPhotosToProduct = async (productId: string, files: File[]) => {
    for (const file of files) {
      const path = `${productId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('photos').upload(path, file);
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path);
      const { error: photoError } = await supabase.from('product_photos').insert({
        product_id: productId,
        url: urlData.publicUrl,
        position: 0,
      });
      if (photoError) {
        throw new Error(photoError.message);
      }
    }
  };

  const handleBulkFilesChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setBulkFiles([]);
      return;
    }
    setBulkFiles(Array.from(files));
  };

  const handleSingleSubmit = async () => {
    const price = Number(prix);
    const hasPhoto = !!newFile || (isEdit && existingPhotos.length > 0);
    if (!designation.trim() || !Number.isFinite(price) || price <= 0 || !hasPhoto) {
      setError('Renseigne une désignation, un prix positif et une photo.');
      return;
    }

    const payload = {
      designation: designation.trim(),
      reference: reference || null,
      prix: price,
      category_id: categoryId || null,
    };

    let productId = id;
    if (isEdit) {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', id);
      if (updateError) { setError(updateError.message); return; }
    } else {
      const { data, error: insertError } = await supabase.from('products').insert(payload).select('id').single();
      if (insertError || !data) { setError(insertError?.message ?? 'Erreur'); return; }
      productId = data.id;
    }

    if (newFile) {
      for (const photo of existingPhotos) {
        await supabase.from('product_photos').delete().eq('id', photo.id);
        const oldPath = photo.url.split('/photos/')[1];
        if (oldPath) await supabase.storage.from('photos').remove([oldPath]);
      }

      await addPhotosToProduct(productId as string, [newFile]);
    }

    navigate('/admin/produits');
  };

  const handleBulkSubmit = async () => {
    const price = Number(prix);
    const variants = normalizeVariants(bulkColors);

    if (!designation.trim() || !Number.isFinite(price) || price <= 0 || variants.length === 0 || bulkFiles.length === 0) {
      setError('Renseigne une désignation, un prix valide, au moins une variante de couleur et au moins une photo.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const insertPayload = variants.map((variant, index) => ({
        designation: `${designation.trim()} ${variant}`.trim(),
        reference: buildReferenceForVariant(bulkReference || designation.trim(), index + 1),
        prix: price,
        category_id: categoryId || null,
      }));

      const { data: createdProducts, error: insertError } = await supabase
        .from('products')
        .insert(insertPayload)
        .select('id');

      if (insertError || !createdProducts) {
        throw new Error(insertError?.message ?? 'Erreur lors de la création du lot.');
      }

      for (let index = 0; index < createdProducts.length; index += 1) {
        const product = createdProducts[index];
        const uniquePhoto = bulkFiles[index] ?? bulkFiles[0];
        if (uniquePhoto) {
          await addPhotosToProduct(product.id, [uniquePhoto]);
        }
      }

      navigate('/admin/produits');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue lors du lot.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await handleSingleSubmit();
      return;
    }

    if (mode === 'bulk') {
      await handleBulkSubmit();
      return;
    }

    setSaving(true);
    setError('');
    try {
      await handleSingleSubmit();
    } finally {
      setSaving(false);
    }
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

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-4 sm:p-7 space-y-5">
          <h1 className="font-display text-xl sm:text-2xl text-[#1C1C1C]">{isEdit ? 'Modifier le pagne' : 'Ajouter un pagne'}</h1>

          {!isEdit && (
            <div className="flex rounded-full border border-[#8B1E3F]/15 p-1 bg-[#FFF9F3]">
              <button
                type="button"
                onClick={() => {
                  setMode('single');
                  setBulkColors('');
                  setBulkFiles([]);
                  setNewFile(null);
                  setError('');
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition-colors ${mode === 'single' ? 'bg-[#8B1E3F] text-white' : 'text-[#5A5A5A]'}`}
              >
                Produit simple
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('bulk');
                  setNewFile(null);
                  setPreviewUrl('');
                  setError('');
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition-colors ${mode === 'bulk' ? 'bg-[#8B1E3F] text-white' : 'text-[#5A5A5A]'}`}
              >
                Lot de pagnes
              </button>
            </div>
          )}

          {error && <p className="bg-red-50 text-red-700 text-sm rounded-lg p-3">{error}</p>}

          <div>
            <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Désignation *</label>
            <input required value={designation} onChange={(e) => setDesignation(e.target.value)}
              placeholder={mode === 'bulk' ? 'Ex: Pagne Chiganvy wax' : 'Ex: Pagne wax fleuri bleu'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Prix (FCFA) *</label>
              <input required type="number" min="1" step="1" value={prix} onChange={(e) => setPrix(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25" />
            </div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">{mode === 'bulk' ? 'Référence de base' : 'Référence'}</label>
              <input value={mode === 'bulk' ? bulkReference : reference} onChange={(e) => mode === 'bulk' ? setBulkReference(e.target.value) : setReference(e.target.value)}
                placeholder={mode === 'bulk' ? 'Ex: CHI-001' : 'Ex: CHI-001'}
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

          {mode === 'bulk' && (
            <div>
              <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-1.5">Couleurs / variantes *</label>
              <textarea
                value={bulkColors}
                onChange={(e) => setBulkColors(e.target.value)}
                placeholder="Ex: rouge, bleu, jaune, noir"
                className="w-full min-h-[90px] px-3.5 py-2.5 rounded-lg border border-[#8B1E3F]/15 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/25"
              />
              <p className="text-xs text-[#5A5A5A] mt-1">Sépare chaque couleur par une virgule. Chaque variante sera créée comme un pagne séparé.</p>
            </div>
          )}

          <div>
            <label className="block text-xs tracking-wide uppercase text-[#5A5A5A] mb-2.5">{mode === 'bulk' ? 'Photos du lot *' : 'Photo *'}</label>
            {mode === 'bulk' ? (
              <div className="space-y-2">
                <label className="block w-full rounded-lg border-2 border-dashed border-[#8B1E3F]/20 flex items-center justify-center cursor-pointer hover:border-[#8B1E3F]/50 transition-colors p-4">
                  <div className="text-center">
                    <ImagePlus size={20} className="mx-auto text-[#A89A8E] mb-2" />
                    <span className="text-sm text-[#5A5A5A]">Sélectionner plusieurs photos</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleBulkFilesChange(e.target.files)}
                  />
                </label>
                {bulkFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#5A5A5A]">{bulkFiles.length} photo(s) sélectionnée(s). Une photo sera attribuée à chaque variante du lot.</p>
                    <div className="flex flex-wrap gap-2">
                      {bulkFiles.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-[#8B1E3F]/15 bg-[#FFF9F3] px-2.5 py-1 text-xs text-[#5A5A5A]">
                          <span className="max-w-[180px] truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setBulkFiles((prev) => prev.filter((_, i) => i !== index))}
                            className="text-[#8B1E3F] hover:text-[#6E1732]"
                            aria-label={`Retirer ${file.name}`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            )}
            {!isEdit && !newFile && mode === 'single' && <p className="text-xs text-[#8B1E3F] mt-2">Une photo est obligatoire.</p>}
          </div>

          <button
            type="submit"
            disabled={saving || !designation.trim() || Number(prix) <= 0 || (mode === 'single' ? (!newFile && (!isEdit || existingPhotos.length === 0)) : bulkFiles.length === 0 || normalizeVariants(bulkColors).length === 0)}
            className="w-full bg-[#8B1E3F] text-[#FFF9F3] py-3 rounded-full font-medium tracking-wide hover:bg-[#6E1732] transition-colors disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : mode === 'bulk' ? 'Ajouter le lot de pagnes' : 'Ajouter le pagne'}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
}
