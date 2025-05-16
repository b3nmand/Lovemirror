import { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface SubscriptionContextType {
  showSubscriptionModal: () => void;
  hideSubscriptionModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  showSubscriptionModal: () => {},
  hideSubscriptionModal: () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showSubscriptionModal = () => setIsModalOpen(true);
  const hideSubscriptionModal = () => setIsModalOpen(false);

  return (
    <SubscriptionContext.Provider
      value={{ showSubscriptionModal, hideSubscriptionModal }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 