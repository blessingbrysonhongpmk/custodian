import { firebaseService } from './firebaseService';
export const treeService = {
  getTrees: async () => {
    try {
      return await firebaseService.getAllTrees();
    } catch {
      return [];
    }
  }
};
