import { supabase } from '../lib/supabase';

export const checkpointService = {
  async submitCheckpoint(treeId: string, data: any): Promise<any> {
    const { data: result, error } = await supabase
      .from('checkpoints')
      .insert([{
        tree_id: treeId,
        checkpoint_type: data.stage || 'manual',
        photo_url: data.photoUrl,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        health_status: data.health_status,
        verification_status: data.verification_status || 'pending',
        notes: data.notes
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error submitting checkpoint:', error);
      throw error;
    }
    
    return result;
  }
};
