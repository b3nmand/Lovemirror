import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { SubscriptionModal } from './SubscriptionModal';

interface ProtectedRouteProps extends React.PropsWithChildren {
  children: React.ReactNode;
  requireSubscription?: boolean;
  assessmentId?: string;
}

export function ProtectedRoute({ children, requireSubscription = false, assessmentId }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkUser();
    if (requireSubscription) {
      checkSubscription();
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [requireSubscription]);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .maybeSingle();

      // If subscription is null or inactive, user doesn't have an active subscription
      setHasSubscription(
        subscription?.status === 'active' && 
        subscription?.current_period_end && 
        new Date(subscription.current_period_end) > new Date()
      );
    } catch (err) {
      console.error('Error checking subscription:', err);
      setHasSubscription(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/auth" state={{ from: location }} replace />
    );
  }

  if (requireSubscription && !hasSubscription) {
    return (
      <>
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            You need a subscription to access this content.
          </AlertDescription>
        </Alert>
        <SubscriptionModal
          isOpen={true}
          onClose={() => setShowSubscriptionModal(false)}
          assessmentId={assessmentId}
        />
      </>
    );
  }

  return <>{children}</>;
}