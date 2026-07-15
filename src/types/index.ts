export interface Category {
  id: string;
  nom: string;
  created_at: string;
}

export type ProductStatus = 'disponible' | 'vendu';

export interface Product {
  id: string;
  reference: string | null;
  designation: string;
  prix: number;
  statut: ProductStatus;
  category_id: string | null;
  created_at: string;
}

export interface ProductPhoto {
  id: string;
  product_id: string;
  url: string;
  position: number;
}

export interface ProductWithPhotos extends Product {
  photos: ProductPhoto[];
  category?: Category | null;
}
