import { supabase } from '../lib/supabase.js';

export async function addRating(beerId, userId, rating) {
  const { data, error } = await supabase
    .from('ratings')
    .insert([
      { beer_id: beerId, user_id: userId, rating: rating }
    ]);
  if (error) throw error;

  return data;
}

export async function updateRating(beerId, userId, rating) {
  const { data, error } = await supabase
    .from('ratings')
    .update({ rating: rating })
    .eq('beer_id', beerId)
    .eq('user_id', userId)
    .select("*");
  if (error) throw error;

  return data;
}

export async function getRatingByBeerAndUser(beerId, userId) {
  const { data, error } = await supabase
    .from('ratings')
    .select(`
      *
    `)
    .eq('beer_id', beerId)
    .eq('user_id', userId) 
    .single();
  if (error) return false;

  return true;
}

export async function fetchRatings(userId) {
  const { data, error } = await supabase
  .from('ratings')
  .select(`
    *
  `)
  .eq('user_id', userId);

  if (error) throw error;

  return data;
}