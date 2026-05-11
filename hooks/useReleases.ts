import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Release {
  id: string;
  title: string;
  artist: string;
  release_date: string;
  label: string | null;
  artwork_url: string | null;
  spotify_url: string | null;
  apple_music_url: string | null;
  youtube_url: string | null;
  youtube_music_url: string | null;
  deezer_url: string | null;
  beatport_url: string | null;
  beatport_chart_position: number | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  album_type?: string;
}

export const useReleases = (featuredOnly = false) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('releases')
        .select('*')
        .order('display_order', { ascending: true })
        .order('release_date', { ascending: false });
      
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      const mapped = (data || []).map((r, idx) => ({
        id: r.id,
        title: r.title || r.name || 'Unknown',
        artist: r.artist || 'Terry Golden',
        release_date: r.release_date,
        label: r.label,
        artwork_url: r.artwork_url || r.image_url,
        spotify_url: r.spotify_url,
        apple_music_url: r.apple_music_url,
        youtube_url: r.youtube_url,
        youtube_music_url: r.youtube_music_url,
        deezer_url: r.deezer_url,
        beatport_url: r.beatport_url,
        beatport_chart_position: r.beatport_chart_position,
        is_featured: r.is_featured || false,
        display_order: r.display_order || idx,
        created_at: r.created_at,
        album_type: r.album_type || r.type || 'single'
      }));
      
      setReleases(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReleases(); }, [featuredOnly]);

  return { releases, loading, error, refetch: fetchReleases };
};

export const addRelease = async (release: Omit<Release, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('releases').insert([release]).select();
  if (error) throw error;
  return data[0];
};

export const updateRelease = async (id: string, release: Partial<Release>) => {
  const { data, error } = await supabase.from('releases').update(release).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteRelease = async (id: string) => {
  const { error } = await supabase.from('releases').delete().eq('id', id);
  if (error) throw error;
};

export const toggleFeatured = async (id: string, featured: boolean) => {
  const { error } = await supabase.from('releases').update({ is_featured: featured }).eq('id', id);
  if (error) throw error;
};

export const updateDisplayOrder = async (updates: { id: string; display_order: number }[]) => {
  for (const u of updates) {
    await supabase.from('releases').update({ display_order: u.display_order }).eq('id', u.id);
  }
};
