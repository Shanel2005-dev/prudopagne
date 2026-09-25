import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, ProductWithPhotos } from '../types';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../data/demoData';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('nom');
    const fallbackCategories = DEMO_CATEGORIES;
    const nextCategories = error
      ? fallbackCategories
      : ((data && data.length > 0) ? (data as Category[]) : fallbackCategories);
    setCategories(nextCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { categories, loading, reload };
}

/**
 * onlyAvailable = true  -> pour le site public (Accueil, Catalogue) : exclut les pagnes vendus
 * onlyAvailable = false -> pour l'admin (AdminProductsPage) : affiche tout, y compris les vendus
 */
export function useProducts(onlyAvailable = false) {
  const [products, setProducts] = useState<ProductWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, category:categories(*), photos:product_photos(*)')
      .order('created_at', { ascending: false });

    if (onlyAvailable) {
      query = query.eq('statut', 'disponible');
    }

    const { data, error } = await query;

    const fallback = onlyAvailable
      ? DEMO_PRODUCTS.filter((p) => p.statut === 'disponible')
      : DEMO_PRODUCTS;

    setProducts(error && import.meta.env.DEV ? fallback : ((data as ProductWithPhotos[]) ?? []));
    setLoading(false);
  }, [onlyAvailable]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { products, loading, reload };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<ProductWithPhotos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*, category:categories(*), photos:product_photos(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        const demo = DEMO_PRODUCTS.find((p) => p.id === id);
        setProduct(error && import.meta.env.DEV && demo ? demo : ((data as ProductWithPhotos) ?? null));
        setLoading(false);
      });
  }, [id]);

  return { product, loading };
}