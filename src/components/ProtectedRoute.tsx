import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { SubscriptionModal } from './SubscriptionModal';
=======
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { SubscriptionModal } from './SubscriptionModal';
import { 
  checkSubscriptionByCustomerId, 
  hasSubscriptionExpired, 
  cacheSubscriptionStatus, 
  getCachedSubscriptionStatus 
} from '@/lib/subscriptionUtils';
import { connectionManager } from '@/lib/connectionManager';
import { User } from '@supabase/supabase-js';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface ProtectedRouteProps extends React.PropsWithChildren {
  children: React.ReactNode;
  requireSubscription?: boolean;
  assessmentId?: string;
}

export function ProtectedRoute({ children, requireSubscription = false, assessmentId }: ProtectedRouteProps) {
<<<<<<< HEAD
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
=======
  console.log('ProtectedRoute rendering with requireSubscription:', requireSubscription, 'assessmentId:', assessmentId);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latestAssessmentId, setLatestAssessmentId] = useState<string | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current route is an assessment results page
  const isAssessmentResultsPage = 
    location.pathname.includes('/assessment-results/') || 
    location.pathname.includes('/wife-material-results/') || 
    location.pathname.includes('/high-value-results/');

  useEffect(() => {
    console.log('ProtectedRoute useEffect - checking user and subscription');
    initializeRoute();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed in ProtectedRoute:', session ? 'user logged in' : 'no user');
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkSubscriptionStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeRoute = async () => {
    try {
      // First check connection
      const isConnected = await connectionManager.checkConnection();
      if (!isConnected) {
        console.error('Connection check failed in ProtectedRoute');
        setConnectionError(true);
        // Try to use cached data
        await checkUserWithFallback();
        return;
      }
      
      setConnectionError(false);
      await checkUser();
    } catch (err) {
      console.error('Error initializing route:', err);
      setConnectionError(true);
      await checkUserWithFallback();
    }
  };

  const checkUserWithFallback = async () => {
    try {
      // Try to get user from local storage
      const cachedUser = localStorage.getItem('cached_user');
      if (cachedUser) {
        const userData = JSON.parse(cachedUser);
        setUser(userData);
        
        // Check cached subscription status
        const cachedSubscription = getCachedSubscriptionStatus(userData.id);
        if (cachedSubscription !== null) {
          setSubscribed(cachedSubscription);
        } else {
          // Default to true if we can't check
          setSubscribed(true);
        }
      } else {
        // If no cached user, redirect to auth
        navigate('/auth');
      }
    } catch (err) {
      console.error('Error in fallback user check:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const redirectToResults = async (assessmentId: string) => {
    try {
      console.log('Redirecting to results for assessment ID:', assessmentId);
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessment_history')
        .select('assessment_type')
        .eq('id', assessmentId)
        .single();
        
      if (assessmentError) {
        console.error('Error fetching assessment for redirect:', assessmentError);
        return;
      }
      if (!assessment || !assessment.assessment_type) {
        console.error('Assessment not found or missing assessment type');
        return;
      }
        
      const redirectPath = assessment.assessment_type === 'bridal-price' 
        ? `/assessment-results/${assessmentId}`
        : assessment.assessment_type === 'wife-material'
        ? `/wife-material-results/${assessmentId}`
        : `/high-value-results/${assessmentId}`;
        
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath);
    } catch (err) {
      console.error('Error redirecting to results:', err);
    }
  };

  const checkUser = async () => {
    try {
      console.log('Checking auth state...');
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error checking auth state:', error);
        throw error;
      }
      
      console.log('User check result:', user ? 'authenticated' : 'not authenticated');
      
      if (user) {
        // Cache user data for offline access
        localStorage.setItem('cached_user', JSON.stringify(user));
        setUser(user);
        await checkSubscriptionStatus(user.id);
      } else {
        setLoading(false);
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setLoading(false);
      
      // Try to use cached data
      await checkUserWithFallback();
    }
  }

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      console.log('Checking subscription status...');
      // First check cached subscription status
      const cachedStatus = getCachedSubscriptionStatus(userId);
      if (cachedStatus !== null) {
        setSubscribed(cachedStatus);
        setLoading(false);
        if (cachedStatus === true) return;
      }
      // Check if subscription is expired
      const expired = await hasSubscriptionExpired(userId);
      // Check if user has an active subscription
      let hasActiveSubscription = false;
      try {
        hasActiveSubscription = await checkSubscriptionByCustomerId(userId);
      } catch (subCheckError) {
        hasActiveSubscription = false;
      }
      setSubscribed(hasActiveSubscription);
      cacheSubscriptionStatus(userId, hasActiveSubscription, 1);
      // Only show modal if requireSubscription is true (for premium pages) and user is not subscribed
      if (requireSubscription && (!hasActiveSubscription || expired) && !showSubscriptionModal) {
        setTimeout(() => setShowSubscriptionModal(true), 500);
      }
      // If user has an active subscription but we're showing the modal, close it
      if (hasActiveSubscription && showSubscriptionModal) {
        setShowSubscriptionModal(false);
      }
    } catch (err) {
      setSubscribed(false);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } finally {
      setLoading(false);
    }
  }

<<<<<<< HEAD
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
=======
  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    await initializeRoute();
  };

  console.log('ProtectedRoute - loading:', loading, 'error:', error, 'showSubscriptionModal:', showSubscriptionModal);

  if (loading) {
    console.log('ProtectedRoute - Still loading...');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

<<<<<<< HEAD
  if (!user) {
=======
  if (connectionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="mb-4 max-w-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the server. You may be offline or the server may be unavailable.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleRetry} 
          variant="default"
          className="mt-4"
        > 
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to auth');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    return (
      <Navigate to="/auth" state={{ from: location }} replace />
    );
  }

<<<<<<< HEAD
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
=======
  console.log('ProtectedRoute - All checks passed, rendering children');
  return (
    <>
      {children}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        assessmentId={assessmentId}
      />
    </>
  );
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
}