export const custodyService = {
  getCustodyHistory: async () => {
    return [];
  },
  initiateHandoff: async (treeId: string, previousCustodianId: string, reason: string) => {
    return { success: true, treeId, previousCustodianId, reason };
  }
};
