import { supabase } from '../lib/supabase.js';

export async function login(userName, password) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, user_name, password, image')
    .eq('user_name', userName)
    .eq('password', password)
    .single();
  if (error || !data) {
    throw new Error('Invalid username or password')
  }

  // Store logged-in user in sessionStorage
  sessionStorage.setItem('user', JSON.stringify(data))

  return data;
}

export async function logout() {
  // Store logged-in user in sessionStorage
  sessionStorage.removeItem('user')
}