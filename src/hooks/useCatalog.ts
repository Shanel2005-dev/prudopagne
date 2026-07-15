import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, ProductWithPhotos } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('nom');
    setCategories(data ?? []);
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
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*), photos:product_photos(*)')
      .order('created_at', { ascending: false });
    setProducts((data as ProductWithPhotos[]) ?? []);
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
      .then(({ data }) => {
        setProduct((data as ProductWithPhotos) ?? null);
        setLoading(false);
      });
  }, [id]);

  return { product, loading };
}
