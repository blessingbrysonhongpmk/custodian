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
  // Use realistic demo fallbacks if DB returns empty or generic placeholder data
  const species = dbTree.species && dbTree.species !== 'Unknown' ? dbTree.species : 'Neem';
  const botanical = dbTree.botanical_name && dbTree.botanical_name !== 'Unknown' ? dbTree.botanical_name : 'Azadirachta indica';
  const tamil = dbTree.tamil_name && dbTree.tamil_name !== 'Unknown' && dbTree.tamil_name !== 'தெரியவில்லை' ? dbTree.tamil_name : 'வேம்பு';
  
  const plantingPhoto = dbTree.planting_photo_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800';
  const currentPhoto = dbTree.current_photo_url || plantingPhoto;

  return {
    id: dbTree.tree_code || dbTree.id,
    speciesName: species,
    botanicalName: botanical,
    tamilName: tamil,
    plantedAt: dbTree.planting_date || '2024-06-01',
    zone: dbTree.zone || 'Campus Guardian',
    landmark: dbTree.nickname || 'Main Quadrangle',
    coordinates: [dbTree.latitude || 12.972, dbTree.longitude || 77.595],
    status: (dbTree.current_status as any) || 'healthy',
    healthScore: dbTree.health_score || 95,
    initialHeightCm: 50,
    currentHeightCm: 180,
    initialPhotoUrl: plantingPhoto,
    currentPhotoUrl: currentPhoto,
    currentCustodian: 'Arun Kumar', // Realistic demo fallback instead of 'Loading...'
    currentCustodianUnit: 'Green Campus Initiative',
    currentCustodianEmail: 'arun.k@example.edu',
    organization: 'Loyola Sustainability Initiative',
    isPilotTree: true,
    checkpoints: (dbTree.checkpoints || []).map((cp: any, i: number) => ({
        id: cp.id || `cp-${i}`,
        stage: cp.checkpoint_type || '1m',
        scheduledDate: cp.submitted_at || new Date().toISOString(),
        status: cp.verification_status || 'verified',
        photoUrl: cp.photo_url || 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800',
        custodianName: 'Arun Kumar',
        consistencyScore: cp.ai_confidence_score > 0.8 ? 'HIGH_CONSISTENCY' : 'REVIEW_REQUIRED',
        locationMatched: cp.gps_match !== false,
        timestampVerified: cp.timestamp_valid !== false,
        confidenceScore: cp.ai_confidence_score ? cp.ai_confidence_score * 100 : undefined,
        aiAnalysis: cp.ai_analysis ? (typeof cp.ai_analysis === 'string' ? JSON.parse(cp.ai_analysis) : cp.ai_analysis) : undefined,
    })),
    custodyHistory: (dbTree.custody_assignments || []).length > 0 ? (dbTree.custody_assignments || []).map((ca: any) => ({
        id: ca.id,
        custodianName: 'Arun Kumar',
        custodianRole: 'Custodian',
        custodianEmail: 'arun.k@example.edu',
        organizationUnit: 'Green Campus Initiative',
        assignedDate: ca.start_date || '2024-06-01',
        endDate: ca.expiry_date || '2024-12-01',
        checkpointsCompleted: 2,
        checkpointsTotal: 4,
        pledgeSigned: true,
        active: ca.status === 'active' || true
    })) : [
      {
        id: 'mock-custody-1',
        custodianName: 'Arun Kumar',
        custodianRole: 'Custodian',
        custodianEmail: 'arun.k@example.edu',
        organizationUnit: 'Green Campus Initiative',
        assignedDate: '2024-06-01',
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days remaining
        checkpointsCompleted: 2,
        checkpointsTotal: 4,
        pledgeSigned: true,
        active: true
      }
    ],
    maintenanceLogs: [],
    growthStage: 3,
  };
}
