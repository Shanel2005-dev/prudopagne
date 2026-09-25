import type { Product } from '../types';

export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildProductMessage(
  product: Pick<Product, 'designation' | 'reference' | 'prix'>,
  imageUrl?: string,
  productUrl?: string,
): string {
  const lines = [
    'Bonjour,',
    '',
    'Je suis intéressé(e) par ce tissu :',
    product.designation,
    '',
    ...(product.reference ? [`Référence : ${product.reference}`] : []),
    `Prix : ${product.prix.toLocaleString()} FCFA`,
    '',
    ...(imageUrl ? ['Image du produit :', imageUrl, ''] : []),
    ...(productUrl ? ['Voir le produit :', productUrl, ''] : []),
    'Pouvez-vous me donner plus d\'informations ?',
  ];
  return lines.join('\n');
}
