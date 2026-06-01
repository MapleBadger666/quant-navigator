import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { getFavoriteSiteIds, saveFavoriteSiteIds } from '../utils/storage';

type FavoriteMode = 'remote' | 'local';

type FavoritesState = {
  favoriteIds: Set<string>;
  favoriteCount: number;
  loading: boolean;
  error: string | null;
  mode: FavoriteMode;
  isSupabaseConfigured: boolean;
  isRemote: boolean;
  toggleFavorite: (siteId: string) => Promise<void>;
  clearLocalFavorites: () => void;
  importGuestFavorites: () => Promise<{ importedCount: number; success: boolean }>;
  clearFavoritesMessage: () => void;
  message: string | null;
};

const toFavoriteSet = (ids: string[]) => new Set(ids.filter(Boolean));

export function useFavorites(user: User | null): FavoritesState {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => toFavoriteSet(getFavoriteSiteIds()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const isRemote = Boolean(user && supabase);
  const mode: FavoriteMode = isRemote ? 'remote' : 'local';

  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      setError(null);
      setMessage(null);

      if (!user || !supabase) {
        setFavoriteIds(toFavoriteSet(getFavoriteSiteIds()));
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error: loadError } = await supabase
        .from('user_favorites')
        .select('site_id')
        .eq('user_id', user.id);

      if (cancelled) {
        return;
      }

      if (loadError) {
        setError(loadError.message);
        setFavoriteIds(new Set());
      } else {
        setFavoriteIds(toFavoriteSet(data.map((row) => row.site_id)));
      }

      setLoading(false);
    };

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (mode === 'local') {
      saveFavoriteSiteIds(favoriteIds);
    }
  }, [favoriteIds, mode]);

  const toggleLocalFavorite = useCallback((siteId: string) => {
    setFavoriteIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(siteId)) {
        nextIds.delete(siteId);
      } else {
        nextIds.add(siteId);
      }

      return nextIds;
    });
  }, []);

  const toggleFavorite = useCallback(
    async (siteId: string) => {
      setError(null);
      setMessage(null);

      if (!user || !supabase) {
        toggleLocalFavorite(siteId);
        return;
      }

      const isFavorite = favoriteIds.has(siteId);

      if (isFavorite) {
        const { error: deleteError } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('site_id', siteId);

        if (deleteError) {
          setError(deleteError.message);
          return;
        }

        setFavoriteIds((currentIds) => {
          const nextIds = new Set(currentIds);
          nextIds.delete(siteId);
          return nextIds;
        });
        return;
      }

      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, site_id: siteId });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setFavoriteIds((currentIds) => new Set(currentIds).add(siteId));
    },
    [favoriteIds, toggleLocalFavorite, user],
  );

  const importGuestFavorites = useCallback(async () => {
    setError(null);
    setMessage(null);

    if (!user || !supabase) {
      setError('Sign in with Supabase before importing local favorites.');
      return { importedCount: 0, success: false };
    }

    const guestFavoriteIds = [...new Set(getFavoriteSiteIds())];

    if (guestFavoriteIds.length === 0) {
      setMessage('no_local_favorites');
      return { importedCount: 0, success: true };
    }

    const rows = guestFavoriteIds.map((siteId) => ({
      user_id: user.id,
      site_id: siteId,
    }));

    const { error: importError } = await supabase.from('user_favorites').upsert(rows, {
      onConflict: 'user_id,site_id',
      ignoreDuplicates: true,
    });

    if (importError) {
      setError(importError.message);
      return { importedCount: 0, success: false };
    }

    const { data, error: reloadError } = await supabase
      .from('user_favorites')
      .select('site_id')
      .eq('user_id', user.id);

    if (reloadError) {
      setError(reloadError.message);
      return { importedCount: 0, success: false };
    }

    setFavoriteIds(toFavoriteSet(data.map((row) => row.site_id)));
    setMessage('favorites_synced');

    return { importedCount: guestFavoriteIds.length, success: true };
  }, [user]);

  const clearLocalFavorites = useCallback(() => {
    saveFavoriteSiteIds([]);

    if (mode === 'local') {
      setFavoriteIds(new Set());
    }
  }, [mode]);

  return useMemo(
    () => ({
      favoriteIds,
      favoriteCount: favoriteIds.size,
      loading,
      error,
      mode,
      isSupabaseConfigured,
      isRemote,
      toggleFavorite,
      clearLocalFavorites,
      importGuestFavorites,
      clearFavoritesMessage: () => setMessage(null),
      message,
    }),
    [
      clearLocalFavorites,
      error,
      favoriteIds,
      importGuestFavorites,
      isRemote,
      loading,
      message,
      mode,
      toggleFavorite,
    ],
  );
}
