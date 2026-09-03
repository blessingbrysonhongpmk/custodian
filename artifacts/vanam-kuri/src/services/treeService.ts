import { supabase } from '../lib/supabase';
import { Tree } from '../types/custodia';

export const treeService = {
  async getTrees(): Promise<Tree[]> {
    const { data, error } = await supabase
      .from('trees')
      .select(`
        *,
        custody_assignments(*),
        checkpoints(*),
        maintenance_logs(*),
        failure_autopsies(*)
      `);
      
    if (error) {
      console.error('Error fetching trees:', error);
      throw error;
    }
    
    // Transform to frontend Tree type
    return data.map(mapDatabaseTreeToFrontend);
  },
  
  async getTree(id: string): Promise<Tree | null> {
    const { data, error } = await supabase
      .from('trees')
      .select(`
        *,
        custody_assignments(*),
        checkpoints(*),
        maintenance_logs(*),
        failure_autopsies(*)
      `)
      .eq('tree_code', id)
      .single();
      
    if (error) {
      console.error('Error fetching tree:', error);
      return null;
    }
    
    return mapDatabaseTreeToFrontend(data);
  },
  
  async createTree(treeData: any): Promise<Tree> {
    const { data, error } = await supabase
      .from('trees')
      .insert([treeData])
      .select()
      .single();
      
    if (error) throw error;
    return mapDatabaseTreeToFrontend(data);
  }
};

// Helper to map DB schema to existing UI types
function mapDatabaseTreeToFrontend(dbTree: any): Tree {
  // We mock some fields for UI consistency if they don't match exactly
  return {
    id: dbTree.tree_code || dbTree.id,
    speciesName: dbTree.species || 'Unknown',
    botanicalName: dbTree.botanical_name || 'Unknown',
    tamilName: dbTree.tamil_name || 'தெரியவில்லை',
    plantedAt: dbTree.planting_date || new Date().toISOString(),
    zone: dbTree.zone || 'Campus',
    landmark: dbTree.nickname || '',
    coordinates: [dbTree.latitude || 0, dbTree.longitude || 0],
    status: (dbTree.current_status as any) || 'healthy',
    healthScore: dbTree.health_score || 100,
    initialHeightCm: 50,
    currentHeightCm: 50,
    initialPhotoUrl: dbTree.planting_photo_url || '/placeholder.jpg',
    currentPhotoUrl: dbTree.planting_photo_url || '/placeholder.jpg',
    currentCustodian: 'Loading...',
    currentCustodianUnit: 'Loading...',
    currentCustodianEmail: 'loading@example.com',
    organization: 'Greenfield College',
    isPilotTree: true,
    checkpoints: (dbTree.checkpoints || []).map((cp: any) => ({
        id: cp.id,
        stage: cp.checkpoint_type,
        scheduledDate: cp.submitted_at,
        status: cp.verification_status,
        photoUrl: cp.photo_url,
        custodianName: 'Custodian',
        consistencyScore: cp.ai_confidence_score > 0.8 ? 'HIGH_CONSISTENCY' : 'REVIEW_REQUIRED',
        locationMatched: cp.gps_match,
        timestampVerified: cp.timestamp_valid,
    })),
    custodyHistory: (dbTree.custody_assignments || []).map((ca: any) => ({
        id: ca.id,
        custodianName: ca.custodian_id || 'Unknown',
        custodianRole: 'Custodian',
        custodianEmail: '',
        organizationUnit: '',
        assignedDate: ca.start_date,
        endDate: ca.expiry_date,
        checkpointsCompleted: 0,
        checkpointsTotal: 4,
        pledgeSigned: true,
        active: ca.status === 'active'
    })),
    maintenanceLogs: [],
    growthStage: 1,
  };
}
