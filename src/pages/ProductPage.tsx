import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { useProduct } from '../hooks/useCatalog';
import { whatsappLink } from '../utils/whatsapp';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '22965524216';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading } = useProduct(id);
  const [photoIdx, setPhotoIdx] = useState(0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement…</div>;
  }
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Article introuvable.</div>;
  }

  const isVendu = product.statut === 'vendu';
  const photos = product.photos.length > 0 ? product.photos : [];

  return (
    <div className="min-h-screen bg-[#FDF8F0] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/catalogue" className="flex items-center gap-1 text-[#9A3412] hover:underline mb-6">
          <ChevronLeft size={18} /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              {photos.length > 0 ? (
                <img src={photos[photoIdx].url} alt={product.designation} className={`w-full h-full object-cover ${isVendu ? 'grayscale opacity-70' : ''}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">Pas de photo</div>
              )}
              {isVendu && (
                <span className="absolute top-3 right-3 bg-gray-800 text-white text-sm px-3 py-1 rounded-full font-medium">Vendu</span>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {photos.map((photo, i) => (
                  <button key={photo.id} onClick={() => setPhotoIdx(i)}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${photoIdx === i ? 'border-[#9A3412]' : 'border-transparent'}`}>
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            {product.category && (
              <span className="self-start bg-[#FDF1E7] text-[#9A3412] text-sm px-3 py-1 rounded-full font-medium mb-3">{product.category.nom}</span>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{product.designation}</h1>
            {product.reference && <p className="text-gray-400 text-sm mb-4">Réf. {product.reference}</p>}
            <p className="text-3xl font-bold text-[#9A3412] mb-6">{product.prix.toLocaleString()} FCFA</p>

            <div className="mt-auto">
              {isVendu ? (
                <p className="text-center bg-gray-100 text-gray-500 rounded-xl p-4 font-medium">Cet article a été vendu.</p>
              ) : (
                <a
                  href={whatsappLink(WHATSAPP_NUMBER, `Bonjour, je suis intéressé(e) par "${product.designation}" (${product.prix.toLocaleString()} FCFA).`)}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:bg-[#1ebc59] transition-colors"
                >
                  <MessageCircle size={20} /> Contacter sur WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
