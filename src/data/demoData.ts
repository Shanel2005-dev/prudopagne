// Données affichées uniquement en développement local (import.meta.env.DEV),
// tant que Supabase n'est pas encore configuré. Jamais utilisées en production.
import type { Category, ProductWithPhotos } from '../types';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'demo-wax', nom: 'Wax', created_at: new Date().toISOString() },
  { id: 'demo-chiganvy', nom: 'Chiganvy', created_at: new Date().toISOString() },
  { id: 'demo-vlisco', nom: 'Vlisco', created_at: new Date().toISOString() },
  { id: 'demo-superwax', nom: 'Superwax', created_at: new Date().toISOString() },
  { id: 'demo-vlisco-imitation', nom: 'Vlisco imitation', created_at: new Date().toISOString() },
  { id: 'demo-bazin', nom: 'Bazin', created_at: new Date().toISOString() },
  { id: 'demo-guipure', nom: 'Guipure', created_at: new Date().toISOString() },
  { id: 'demo-dentelle', nom: 'Dentelle', created_at: new Date().toISOString() },
  { id: 'demo-tissus', nom: 'Tissus', created_at: new Date().toISOString() },
];

function photo(id: string, url: string): ProductWithPhotos['photos'][number] {
  return { id, product_id: id, url, position: 0 };
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

const WAX = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg';
const BAZIN = 'https://upload.wikimedia.org/wikipedia/commons/1/19/Bazin_fabric.jpg';
const ANKARA = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ankara_Fabric_With_A_Touch_Of_Smile.jpg/1280px-Ankara_Fabric_With_A_Touch_Of_Smile.jpg';

export const DEMO_PRODUCTS: ProductWithPhotos[] = [
  {
    id: 'demo-1', reference: 'WX-014', designation: 'Wax impression fleurs éclatantes', prix: 15000,
    statut: 'disponible', category_id: 'demo-wax', created_at: daysAgo(3), vendu_at: null,
    category: DEMO_CATEGORIES[0], photos: [photo('p1', WAX)],
  },
  {
    id: 'demo-2', reference: 'BZ-002', designation: 'Bazin riche brodé main', prix: 32000,
    statut: 'disponible', category_id: 'demo-bazin', created_at: daysAgo(5), vendu_at: null,
    category: DEMO_CATEGORIES[1], photos: [photo('p2', BAZIN)],
  },
  {
    id: 'demo-3', reference: 'AK-091', designation: 'Ankara motif contemporain', prix: 12500,
    statut: 'vendu', category_id: 'demo-tissus', created_at: daysAgo(70), vendu_at: daysAgo(58),
    category: DEMO_CATEGORIES[4], photos: [photo('p3', ANKARA)],
  },
  {
    id: 'demo-4', reference: 'WX-020', designation: 'Wax classique bleu royal', prix: 14000,
    statut: 'disponible', category_id: 'demo-wax', created_at: daysAgo(2), vendu_at: null,
    category: DEMO_CATEGORIES[0], photos: [photo('p4', WAX)],
  },
  {
    id: 'demo-5', reference: 'BZ-011', designation: 'Bazin getzner premium', prix: 45000,
    statut: 'vendu', category_id: 'demo-bazin', created_at: daysAgo(50), vendu_at: daysAgo(40),
    category: DEMO_CATEGORIES[1], photos: [photo('p5', BAZIN)],
  },
  {
    id: 'demo-6', reference: 'WX-033', designation: 'Wax hollandais imprimé doré', prix: 18000,
    statut: 'vendu', category_id: 'demo-wax', created_at: daysAgo(35), vendu_at: daysAgo(25),
    category: DEMO_CATEGORIES[0], photos: [photo('p6', WAX)],
  },
  {
    id: 'demo-7', reference: 'AK-104', designation: 'Ankara imprimé graphique', prix: 13000,
    statut: 'vendu', category_id: 'demo-tissus', created_at: daysAgo(20), vendu_at: daysAgo(10),
    category: DEMO_CATEGORIES[4], photos: [photo('p7', ANKARA)],
  },
  {
    id: 'demo-8', reference: 'BZ-018', designation: 'Bazin brodé cérémonie', prix: 38000,
    statut: 'vendu', category_id: 'demo-bazin', created_at: daysAgo(12), vendu_at: daysAgo(4),
    category: DEMO_CATEGORIES[1], photos: [photo('p8', BAZIN)],
  },
];
