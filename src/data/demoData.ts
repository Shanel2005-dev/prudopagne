// Données affichées uniquement en développement local (import.meta.env.DEV),
// tant que Supabase n'est pas encore configuré. Jamais utilisées en production.
import type { Category, ProductWithPhotos } from '../types';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'demo-wax', nom: 'Wax', created_at: new Date().toISOString() },
  { id: 'demo-bazin', nom: 'Bazin', created_at: new Date().toISOString() },
  { id: 'demo-guipure', nom: 'Guipure', created_at: new Date().toISOString() },
  { id: 'demo-dentelle', nom: 'Dentelle', created_at: new Date().toISOString() },
  { id: 'demo-tissus', nom: 'Tissus', created_at: new Date().toISOString() },
];

function photo(id: string, url: string): ProductWithPhotos['photos'][number] {
  return { id, product_id: id, url, position: 0 };
}

export const DEMO_PRODUCTS: ProductWithPhotos[] = [
  {
    id: 'demo-1', reference: 'WX-014', designation: 'Wax impression fleurs éclatantes', prix: 15000,
    statut: 'disponible', category_id: 'demo-wax', created_at: new Date().toISOString(),
    category: DEMO_CATEGORIES[0],
    photos: [photo('p1', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg')],
  },
  {
    id: 'demo-2', reference: 'BZ-002', designation: 'Bazin riche brodé main', prix: 32000,
    statut: 'disponible', category_id: 'demo-bazin', created_at: new Date().toISOString(),
    category: DEMO_CATEGORIES[1],
    photos: [photo('p2', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Bazin_fabric.jpg')],
  },
  {
    id: 'demo-3', reference: 'AK-091', designation: 'Ankara motif contemporain', prix: 12500,
    statut: 'vendu', category_id: 'demo-tissus', created_at: new Date().toISOString(),
    category: DEMO_CATEGORIES[4],
    photos: [photo('p3', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ankara_Fabric_With_A_Touch_Of_Smile.jpg/1280px-Ankara_Fabric_With_A_Touch_Of_Smile.jpg')],
  },
  {
    id: 'demo-4', reference: 'WX-020', designation: 'Wax classique bleu royal', prix: 14000,
    statut: 'disponible', category_id: 'demo-wax', created_at: new Date().toISOString(),
    category: DEMO_CATEGORIES[0],
    photos: [photo('p4', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg')],
  },
];
