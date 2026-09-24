import type { ProductWithPhotos } from '../types';

const MONTHS_FR = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

export type RevenuePeriod = 'semaine' | 'mois' | 'annee';

function startOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7; // lundi = 0
  date.setDate(date.getDate() - day);
  return date;
}

export function revenueByPeriod(products: ProductWithPhotos[], period: RevenuePeriod) {
  const now = new Date();
  const sold = products.filter((p) => p.statut === 'vendu' && p.vendu_at);

  if (period === 'semaine') {
    const buckets: { label: string; start: Date; total: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = startOfWeek(new Date(now.getTime() - i * 7 * 86400000));
      buckets.push({ label: `${start.getDate()}/${start.getMonth() + 1}`, start, total: 0 });
    }
    for (const p of sold) {
      const wStart = startOfWeek(new Date(p.vendu_at!));
      const bucket = buckets.find((b) => b.start.getTime() === wStart.getTime());
      if (bucket) bucket.total += p.prix;
    }
    return buckets;
  }

  if (period === 'annee') {
    const buckets: { label: string; year: number; total: number }[] = [];
    for (let i = 4; i >= 0; i--) {
      buckets.push({ label: String(now.getFullYear() - i), year: now.getFullYear() - i, total: 0 });
    }
    for (const p of sold) {
      const y = new Date(p.vendu_at!).getFullYear();
      const bucket = buckets.find((b) => b.year === y);
      if (bucket) bucket.total += p.prix;
    }
    return buckets;
  }

  // mois
  const buckets: { label: string; year: number; month: number; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: MONTHS_FR[d.getMonth()], year: d.getFullYear(), month: d.getMonth(), total: 0 });
  }
  for (const p of sold) {
    const d = new Date(p.vendu_at!);
    const bucket = buckets.find((b) => b.year === d.getFullYear() && b.month === d.getMonth());
    if (bucket) bucket.total += p.prix;
  }
  return buckets;
}

export function stockByCategory(products: ProductWithPhotos[]) {
  const counts = new Map<string, number>();
  for (const p of products) {
    if (p.statut !== 'disponible') continue;
    const nom = p.category?.nom ?? 'Sans catégorie';
    counts.set(nom, (counts.get(nom) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
}
