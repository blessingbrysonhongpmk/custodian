import { firebaseService } from './firebaseService';
export const riskService = {
  getRisks: async () => {
    try {
      return await firebaseService.getRiskItems();
    } catch {
      return [];
    }
  }
};
