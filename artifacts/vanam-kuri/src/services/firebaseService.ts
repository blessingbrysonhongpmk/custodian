import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { firestore as db, isFirebaseConfigured } from '../lib/firebase';
import { Tree, RiskItem } from '../types/custodia';

const isDemoMode = !isFirebaseConfigured();

export const firebaseService = {
  /**
   * Save a tree to Firestore
   */
  async saveTree(tree: Partial<Tree>) {
    if (isDemoMode) {
      console.log('[Demo Mode] Saving tree:', tree);
      return tree.id;
    }
    try {
      const treeRef = doc(collection(db!, 'trees'));
      const treeId = tree.id || treeRef.id;
      await setDoc(doc(db!, 'trees', treeId), {
        ...tree,
        id: treeId,
        createdAt: serverTimestamp(),
      });
      return treeId;
    } catch (error) {
      console.error('Error saving tree:', error);
      throw error;
    }
  },

  /**
   * Get all trees
   */
  async getAllTrees(): Promise<Tree[]> {
    if (isDemoMode) {
      return [];
    }
    try {
      const snapshot = await getDocs(collection(db!, 'trees'));
      return snapshot.docs.map(doc => doc.data() as Tree);
    } catch (error) {
      console.error('Error fetching all trees:', error);
      throw error;
    }
  },

  /**
   * Get a single tree by ID
   */
  async getTree(treeId: string): Promise<Tree | null> {
    if (isDemoMode) return null;
    try {
      const snap = await getDoc(doc(db!, 'trees', treeId));
      return snap.exists() ? (snap.data() as Tree) : null;
    } catch (error) {
      console.error('Error fetching tree:', error);
      throw error;
    }
  },

  /**
   * Get all trees for a specific custodian
   */
  async getCustodianTrees(custodianId: string): Promise<Tree[]> {
    if (isDemoMode) {
      return [];
    }
    try {
      const q = query(
        collection(db!, 'trees'), 
        where('currentCustodianId', '==', custodianId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Tree);
    } catch (error) {
      console.error('Error fetching custodian trees:', error);
      throw error;
    }
  },

  /**
   * Add a verification checkpoint
   */
  async addCheckpoint(treeId: string, checkpointData: any) {
    if (isDemoMode) return true;
    try {
      const treeRef = doc(db!, 'trees', treeId);
      const treeSnap = await getDoc(treeRef);
      if (!treeSnap.exists()) throw new Error('Tree not found');
      
      const tree = treeSnap.data();
      const checkpoints = tree.checkpoints || [];
      
      await updateDoc(treeRef, {
        checkpoints: [...checkpoints, {
          ...checkpointData,
          createdAt: new Date().toISOString(),
        }],
        lastVerificationDate: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error adding checkpoint:', error);
      throw error;
    }
  },

  /**
   * Save a risk item
   */
  async saveRiskItem(riskItem: Partial<RiskItem>) {
    if (isDemoMode) return riskItem.id;
    try {
      const riskRef = doc(collection(db!, 'riskItems'));
      const riskId = riskItem.id || riskRef.id;
      await setDoc(doc(db!, 'riskItems', riskId), {
        ...riskItem,
        id: riskId,
        createdAt: serverTimestamp(),
      });
      return riskId;
    } catch (error) {
      console.error('Error saving risk item:', error);
      throw error;
    }
  },

  /**
   * Get all risk items
   */
  async getRiskItems(): Promise<RiskItem[]> {
    if (isDemoMode) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'riskItems'));
      return snapshot.docs.map(doc => doc.data() as RiskItem);
    } catch (error) {
      console.error('Error fetching risk items:', error);
      throw error;
    }
  }
};
