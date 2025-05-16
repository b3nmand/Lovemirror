import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { createCheckoutSession, redirectToCheckout } from '@/lib/stripe';
import { supabase } from '@/lib/supabase'; 
import { connectionManager } from '@/lib/connectionManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StripeCheckoutButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  assessmentId?: string;
  disabled?: boolean;
}

export function StripeCheckoutButton({
  priceId,
  children,
  className,
  variant = 'default',
  size = 'default',
  assessmentId,
  disabled = false
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      console.log('Starting checkout process for price ID:', priceId);

      // Check if we're offline
      if (connectionManager.isOffline()) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.');
      }

      // Get the current user
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        console.error('No user found during checkout');
        throw new Error('You must be logged in to make a purchase');
      }
      
      // Store assessment ID in localStorage if provided
      if (assessmentId) {
        console.log('Storing assessment ID in localStorage:', assessmentId);
        localStorage.setItem('pendingAssessmentId', assessmentId);
      }
      
      // Create checkout session
      const sessionId = await createCheckoutSession(priceId, data.user.id, assessmentId);
      console.log('Created checkout session:', sessionId);
      
      // Redirect to checkout
      await redirectToCheckout(sessionId);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleCheckout}
        disabled={loading || disabled}
        className={className}
        variant={variant} 
        size={size}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
           <span className="text-white">Processing...</span>
          </>
        ) : (
          children
        )}
      </Button>
    </div>
  );
}