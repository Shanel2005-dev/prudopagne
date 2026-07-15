import { Link } from 'react-router-dom';
import type { ProductWithPhotos } from '../types';
import { isNouveau } from '../utils/product';

export default function ProductCard({ product }: { product: ProductWithPhotos }) {
  const cover = product.photos[0]?.url;
  const isVendu = product.statut === 'vendu';

  return (
    <Link to={`/produit/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] bg-[#F3E9DE] rounded-xl overflow-hidden mb-3">
        {cover ? (
          <img src={cover} alt={product.designation} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isVendu ? 'grayscale opacity-60' : ''}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#A89A8E] text-sm">Pas de photo</div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {isVendu ? (
            <span className="bg-[#1C1C1C]/85 text-[#FFF9F3] text-[11px] tracking-widest uppercase px-2.5 py-1 rounded-full">Vendu</span>
          ) : isNouveau(product) ? (
            <span className="bg-[#D4AF37] text-[#1C1C1C] text-[11px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium">Nouveau</span>
          ) : null}
        </div>
      </div>
      <div>
        {product.category && (
          <p className="text-[11px] tracking-widest uppercase text-[#B8952E] mb-0.5">{product.category.nom}</p>
        )}
        <p className="font-display text-[17px] text-[#1C1C1C] leading-snug truncate">{product.designation}</p>
        <p className="text-[#5A5A5A] mt-0.5">{product.prix.toLocaleString()} FCFA</p>
      </div>
    </Link>
  );
}
