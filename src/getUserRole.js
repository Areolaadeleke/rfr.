import { toast } from 'react-toastify';
import { supabase } from './supabaseClient';

export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    toast.error('Error fetching role:', error.message);
    return null;
  }

  if (!data) {
    toast.warn('No user found with ID:', userId);
    return null;
  }

  // console.log("User role:", data.role);
  return data.role;
};
