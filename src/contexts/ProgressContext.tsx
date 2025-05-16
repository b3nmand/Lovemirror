import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type Milestone =
  | 'selfAssessment'
  | 'subscribed'
  | 'partnerInvited'
  | 'partnerCompleted'
  | 'externalRaterCompleted'
  | 'planGenerated'
  | 'goalsUnlocked'
  | 'midway'
  | 'reassessment';

export interface ProgressState {
  milestones: Record<Milestone, 'locked' | 'inProgress' | 'completed'>;
  userMessages: Record<Milestone, string>;
  goals: { category: string; completed: number; total: number }[];
}

const ProgressContext = createContext<ProgressState | null>(null);

export const useProgress = () => useContext(ProgressContext);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    fetchProgress().then(setProgress);

    const sub = supabase
      .channel('public:assessments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assessments' }, () => {
        fetchProgress().then(setProgress);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
}

// Replace with your actual backend call
async function fetchProgress(): Promise<ProgressState> {
  // Example: call a Supabase function or REST endpoint
  // Replace with your actual logic
  const { data, error } = await supabase.rpc('get_user_progress');
  if (error) throw error;
  return data as ProgressState;
} 