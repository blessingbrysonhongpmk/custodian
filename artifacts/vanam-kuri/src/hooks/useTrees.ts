import { useState, useEffect, useCallback } from 'react';
import { treeService } from '../services/treeService';
import { isSupabaseConfigured } from '../lib/supabase';
import { Tree } from '../types/custodia';
import { sampleTrees } from '../data/mockData';

export function useTrees() {
  const [trees, setTrees] = useState<Tree[]>(sampleTrees);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrees = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Fallback to local mock data
      setTrees(sampleTrees);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await treeService.getTrees();
      if (data.length > 0) {
        setTrees(data);
      }
    } catch (err: any) {
      setError(err.message);
      // Fallback on error
      setTrees(sampleTrees);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  return { trees, setTrees, loading, error, refetch: fetchTrees };
}
