import { supabase } from '../lib/supabase';

export const riskService = {
  async getRisks(): Promise<any[]> {
    const { data, error } = await supabase
      .from('risk_events')
      .select('*, trees(tree_code, species, current_status), profiles(name)')
      .eq('status', 'active');
      
    if (error) {
      console.error('Error fetching risks:', error);
      throw error;
    }
    
    return data;
  }
};
