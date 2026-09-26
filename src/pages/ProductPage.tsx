import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { useProduct } from '../hooks/useCatalog';
import { whatsappLink, buildProductMessage } from '../utils/whatsapp';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '22965524216';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading } = useProduct(id);
  const [photoIdx, setPhotoIdx] = useState(0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#A89A8E]">Chargement…</div>;
  }
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-[#5A5A5A]">Article introuvable.</div>;
  }

  const photos = product.photos.length > 0 ? product.photos : [];
  const primaryPhoto = photos[photoIdx]?.url || photos[0]?.url || '';
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/produit/${product.id}` : `https://example.com/produit/${product.id}`;

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <Link to="/catalogue" className="flex items-center gap-1 text-sm text-[#5A5A5A] hover:text-[#8B1E3F] transition-colors mb-8">
          <ChevronLeft size={16} /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-square bg-[#F3E9DE] rounded-xl overflow-hidden">
              {photos.length > 0 ? (
                <img src={photos[photoIdx].url} alt={product.designation} className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#A89A8E]">Pas de photo</div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 mt-3">
                {photos.map((photo, i) => (
                  <button key={photo.id} onClick={() => setPhotoIdx(i)}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${photoIdx === i ? 'border-[#8B1E3F]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col pt-2">
            {product.category && (
              <p className="text-[11px] tracking-widest uppercase text-[#B8952E] mb-3">{product.category.nom}</p>
            )}
            <h1 className="font-display text-3xl text-[#1C1C1C] mb-2">{product.designation}</h1>
            {product.reference && <p className="text-[#A89A8E] text-sm mb-6">Réf. {product.reference}</p>}
            <p className="font-display text-3xl text-[#8B1E3F] mb-8">{product.prix.toLocaleString()} FCFA</p>

            <div className="mt-auto">
              <a
                href={whatsappLink(WHATSAPP_NUMBER, buildProductMessage(product, primaryPhoto, productUrl))}
                target="_blank" rel="noopener noreferrer"
                className="group w-full flex items-center justify-center gap-2.5 bg-[#1C1C1C] text-[#FFF9F3] py-4 rounded-full font-medium tracking-wide hover:bg-[#8B1E3F] transition-colors duration-300"
              >
                <MessageCircle size={18} className="text-[#D4AF37] transition-transform group-hover:scale-110" /> Contacter sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
