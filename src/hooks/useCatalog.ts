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
    setCategories(error && import.meta.env.DEV ? DEMO_CATEGORIES : (data ?? []));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { categories, loading, reload };
}

export function useProducts() {
  const [products, setProducts] = useState<ProductWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), photos:product_photos(*)')
      .order('created_at', { ascending: false });
    setProducts(error && import.meta.env.DEV ? DEMO_PRODUCTS : ((data as ProductWithPhotos[]) ?? []));
    setLoading(false);
  }, []);

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
