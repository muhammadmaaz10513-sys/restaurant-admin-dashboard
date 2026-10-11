import { createClient } from '@supabase/supabase-js';

// Supabase project configuration
export const SUPABASE_URL = 'https://tehmzakrejbuytuoocll.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaG16YWtyZWpidXl0dW9vY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MDE4NzQsImV4cCI6MjEwNzE3Nzg3NH0.FzKKNg4E2bKbJ8N3P0oiVgUjaZ19q1eEItMQXghvgS4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch all customer orders from Supabase ordered by latest created_at
 */
export async function fetchAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected Supabase error:', err);
    return { success: false, error: err.message, data: [] };
  }
}

/**
 * Update an existing order status in Supabase (Pending, Preparing, Delivered)
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error updating order status in Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error updating order status:', err);
    return { success: false, error: err.message };
  }
}

