import { supabase } from '../lib/supabase';
import { CustodyRecord } from '../types/custodia';

export const custodyService = {
  async getCustodyHistory(treeId: string): Promise<CustodyRecord[]> {
    const { data, error } = await supabase
      .from('custody_assignments')
      .select('*, profiles(name, role, email)')
      .eq('tree_id', treeId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching custody history:', error);
      throw error;
    }

    return data.map(mapDatabaseCustodyToFrontend);
  },

  async initiateHandoff(treeId: string, previousCustodianId: string, reason: string) {
    const { data, error } = await supabase
      .from('custody_handoffs')
      .insert([{
        tree_id: treeId,
        previous_custodian_id: previousCustodianId,
        reason: reason,
        status: 'initiated'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

function mapDatabaseCustodyToFrontend(ca: any): CustodyRecord {
  return {
    id: ca.id,
    custodianName: ca.profiles?.name || 'Unknown',
    custodianRole: ca.profiles?.role || 'Custodian',
    custodianEmail: ca.profiles?.email || '',
    organizationUnit: 'Loading...',
    assignedDate: ca.start_date,
    endDate: ca.expiry_date,
    checkpointsCompleted: 0,
    checkpointsTotal: 4,
    pledgeSigned: true,
    active: ca.status === 'active'
  };
}
