import type { Product } from '../types';

const NOUVEAU_DAYS = 14;

export function isNouveau(product: Product): boolean {
  const days = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
  return days <= NOUVEAU_DAYS;
}
