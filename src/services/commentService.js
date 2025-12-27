import { supabase } from "../lib/supabase";

export async function addComment(beerId, userId, comment) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      { beer_id: beerId, user_id: userId, comment: comment }
    ])
    .select(`
      *,
      users (
        id,
        name,
        image
      )
      `)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchComments(beerId) { 
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      beer_id,
      user_id, 
      comment,
      created_at,
      users ( name, image )
    `)
    .eq('beer_id', beerId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching comments:', error)
    return
  }
  return data;
}