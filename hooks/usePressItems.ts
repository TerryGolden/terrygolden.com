import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { epkPressItems } from '@/data/pressData';

export interface PressItem {
  id: string;
  title: string;
  source: string;
  source_logo?: string;
  date: string;
  excerpt: string;
  link: string;
  image: string;
  featured: boolean;
  display_order: number;
  visible?: boolean;
  published_date?: string;
  auto_discovered?: boolean;
  discovery_source?: string;
}

// Helper function to parse date strings into sortable dates
const parseDate = (dateStr: string): Date => {
  // Handle various date formats
  if (!dateStr) return new Date(0);
  
  // If it's already a valid ISO date
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime()) && dateStr.includes('-')) {
    return isoDate;
  }
  
  // Handle formats like "Oct 2025", "Sep 2022", "2024"
  const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s*(\d{4})$/);
  if (monthYearMatch) {
    const months: { [key: string]: number } = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    const monthNum = months[monthYearMatch[1].toLowerCase().substring(0, 3)];
    if (monthNum !== undefined) {
      return new Date(parseInt(monthYearMatch[2]), monthNum, 15);
    }
  }
  
  // Handle just year like "2024"
  const yearMatch = dateStr.match(/^(\d{4})$/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]), 6, 1); // Middle of the year
  }
  
  return new Date(0);
};

// Convert static data to PressItem format with parsed dates
const staticPressItems: PressItem[] = epkPressItems.map((item, index) => ({
  id: `static-${index}`,
  title: item.title,
  source: item.source,
  date: item.date,
  excerpt: item.excerpt,
  link: item.link,
  image: item.image,
  featured: item.featured,
  display_order: index,
  visible: true,
  published_date: (item as any).published_date || parseDate(item.date).toISOString().split('T')[0],
}));

// Sort by date (newest first)
const sortByDateDesc = (items: PressItem[]): PressItem[] => {
  return [...items].sort((a, b) => {
    const dateA = a.published_date ? new Date(a.published_date) : parseDate(a.date);
    const dateB = b.published_date ? new Date(b.published_date) : parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

export const usePressItems = () => {
  const [items, setItems] = useState<PressItem[]>(sortByDateDesc(staticPressItems));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('press_items')
        .select('*')
        .eq('visible', true)
        .order('published_date', { ascending: false, nullsFirst: false });
      
      if (error) throw error;
      
      // Use database items if available, otherwise keep static items
      if (data && data.length > 0) {
        // Sort by published_date or fallback to date string parsing
        const sortedData = sortByDateDesc(data);
        setItems(sortedData);
      } else {
        // Use static items sorted by date
        setItems(sortByDateDesc(staticPressItems));
      }
    } catch (err) {
      // On error, keep using static items (already set as default)
      console.log('Using static press items');
      setItems(sortByDateDesc(staticPressItems));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const featuredItem = items.find(item => item.featured) || items[0];
  const otherItems = items.filter(item => item.id !== featuredItem?.id);

  return { items, featuredItem, otherItems, loading, error, refetch: fetchItems };
};
