import React, { createContext, useContext, useState, useEffect } from 'react';

export type HealthState = 'thriving' | 'healthy' | 'attention' | 'at_risk' | 'critical';

export interface ProgramHealthData {
  score: number; // 0 - 100
  state: HealthState;
  treeHealthPercent: number;
  verificationRate: number;
  custodyStability: number;
  checkpointCompletion: number;
  messageKey: string;
}

interface ProgramHealthContextType {
  healthData: ProgramHealthData;
  updateHealthMetrics: (metrics: Partial<ProgramHealthData>) => void;
}

const defaultHealthData: ProgramHealthData = {
  score: 92,
  state: 'thriving',
  treeHealthPercent: 95,
  verificationRate: 96,
  custodyStability: 90,
  checkpointCompletion: 85,
  messageKey: 'thriving' // corresponds to dashboard.thulirMessages.thriving
};

const ProgramHealthContext = createContext<ProgramHealthContextType | undefined>(undefined);

export const ProgramHealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [healthData, setHealthData] = useState<ProgramHealthData>(defaultHealthData);

  useEffect(() => {
    // Recalculate score based on formula if metrics change
    // Formula: Tree Health: 30%, Verification Rate: 25%, Custody Stability: 25%, Checkpoint Completion: 20%
    const { treeHealthPercent, verificationRate, custodyStability, checkpointCompletion } = healthData;
    
    const calculatedScore = Math.round(
      (treeHealthPercent * 0.3) +
      (verificationRate * 0.25) +
      (custodyStability * 0.25) +
      (checkpointCompletion * 0.2)
    );

    let state: HealthState = 'critical';
    let messageKey = 'critical';

    if (calculatedScore >= 90) {
      state = 'thriving';
      messageKey = 'thriving';
    } else if (calculatedScore >= 70) {
      state = 'healthy';
      messageKey = 'healthy';
    } else if (calculatedScore >= 50) {
      state = 'attention';
      messageKey = 'attention';
    } else if (calculatedScore >= 30) {
      state = 'at_risk';
      messageKey = 'at_risk';
    }

    setHealthData(prev => {
      if (prev.score !== calculatedScore || prev.state !== state) {
        return { ...prev, score: calculatedScore, state, messageKey };
      }
      return prev;
    });
  }, [
    healthData.treeHealthPercent, 
    healthData.verificationRate, 
    healthData.custodyStability, 
    healthData.checkpointCompletion
  ]);

  const updateHealthMetrics = (metrics: Partial<ProgramHealthData>) => {
    setHealthData(prev => ({ ...prev, ...metrics }));
  };

  return (
    <ProgramHealthContext.Provider value={{ healthData, updateHealthMetrics }}>
      {children}
    </ProgramHealthContext.Provider>
  );
};

export const useProgramHealth = () => {
  const context = useContext(ProgramHealthContext);
  if (!context) {
    throw new Error('useProgramHealth must be used within a ProgramHealthProvider');
  }
  return context;
};
