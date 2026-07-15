import { Link } from 'react-router-dom';
import type { ProductWithPhotos } from '../types';

export default function ProductCard({ product }: { product: ProductWithPhotos }) {
  const cover = product.photos[0]?.url;
  const isVendu = product.statut === 'vendu';

  return (
    <Link to={`/produit/${product.id}`} className="group block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        {cover ? (
          <img src={cover} alt={product.designation} className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${isVendu ? 'grayscale opacity-70' : ''}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Pas de photo</div>
        )}
        {isVendu && (
          <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2.5 py-1 rounded-full font-medium">Vendu</span>
        )}
        {product.category && (
          <span className="absolute top-2 left-2 bg-white/90 text-[#9A3412] text-xs px-2.5 py-1 rounded-full font-medium">{product.category.nom}</span>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800 text-sm truncate">{product.designation}</p>
        <p className="font-bold text-[#9A3412] mt-0.5">{product.prix.toLocaleString()} FCFA</p>
      </div>
    </Link>
  );
}
