import { supabase } from '../lib/supabase';

export const notificationService = {
  async getNotifications(): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
    
    return data;
  }
};
