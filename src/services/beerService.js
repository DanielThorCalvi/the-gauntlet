import { supabase } from '../lib/supabase.js';

export async function fetchBeers() {
  const { data, error } = await supabase
    .from('beers_with_avg_rating')
    .select('name, about, created_at, abv, id, image, avg_rating')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching beers:', error)
    return
  }
  return data;
}