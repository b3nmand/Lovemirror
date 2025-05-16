<<<<<<< HEAD
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Crown, Shield, Star, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '../lib/supabase';
=======
import React, { useState, useEffect } from 'react';
import { Crown, Shield, Star, AlertCircle, Loader2, Link as LinkIcon, CreditCard } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { StripeCheckoutButton } from '@/components/ui/stripe-checkout-button';
import { checkSubscriptionByCustomerId, cacheSubscriptionStatus } from '@/lib/subscriptionUtils';
import { supabase } from '@/lib/supabase';
import { connectionManager } from '@/lib/connectionManager';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId?: string;
<<<<<<< HEAD
=======
  isLoading?: boolean
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
}

const PLANS = [
  {
<<<<<<< HEAD
    id: '1_month',
    name: '1 Month',
    price: '£9.99',
    features: [
      'Full Assessment Results',
=======
    id: '1_month', 
    stripePriceId: 'price_1NK6E1FbtPurWyoUfIoXWgL5',
    paymentLink: import.meta.env.STRIPE_PAYMENT_LINK_1_MONTH || 'https://buy.stripe.com/dR62bl1P81iSdMs3cf',
    name: '1 Month',
    price: '£9.99',
      features: [
      'Everything for 1 Month',
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      'AI Development Plan',
      'Compatibility Reports',
      'Delusional Score Insights'
    ],
    icon: Star,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '3_months',
<<<<<<< HEAD
    name: '3 Months',
    price: '£15.00',
    features: [
      'Everything in 1 Month',
=======
    stripePriceId: 'price_1NK6E1FbtPurWyoUfIoXWgL6',
    paymentLink: import.meta.env.STRIPE_PAYMENT_LINK_3_MONTHS || 'https://buy.stripe.com/8wM6rB8dw1iSdMs146',
    name: '3 Months',
    price: '£15.00',
      features: [
      'Everything for 3 Month',
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      'Progress Tracking',
      'External Assessor Tools',
      'Priority Support'
    ],
    icon: Shield,
    color: 'from-violet-500 to-purple-500',
    popular: true
  },
  {
<<<<<<< HEAD
    id: '12_months',
    name: '12 Months',
    price: '£36.00',
    features: [
      'Everything in 3 Months',
=======
    id: '6_months',
    stripePriceId: 'price_1NK6E1FbtPurWyoUfIoXWgL7',
    paymentLink: import.meta.env.STRIPE_PAYMENT_LINK_6_MONTHS || 'https://buy.stripe.com/28og2b79s5z8eQw3cd',
    name: '6 Months',
    price: '£24.00',
      features: [
      'Everything for 6 Month',
      'Unlimited Assessments',
      'Priority Support',
      'Advanced Analytics'
    ],
    icon: Shield,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: '12_months',
    stripePriceId: 'price_1NK6E1FbtPurWyoUfIoXWgL8',
    paymentLink: import.meta.env.STRIPE_PAYMENT_LINK_12_MONTHS || 'https://buy.stripe.com/28ocPZgK24v4eQw8ww',
    name: '12 Months',
    price: '£36.00',
      features: [
      'Everything for 12 Months',
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      'AI Relationship Coach',
      'Exclusive Content',
      'VIP Support'
    ],
    icon: Crown,
    color: 'from-amber-500 to-yellow-500'
  }
];

<<<<<<< HEAD
export function SubscriptionModal({ isOpen, onClose, assessmentId }: SubscriptionModalProps) {
  const [loading, setLoading] = React.useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = React.useState<any>(null);

  React.useEffect(() => {
    const initStripe = async () => {
      try {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        if (!stripe) throw new Error('Failed to initialize payment system');
        setStripeInstance(stripe);
      } catch (err) {
        console.error('Stripe initialization error:', err);
        setError('Payment system is currently unavailable');
      }
    };
    initStripe();
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoading(null);
      setGlobalLoading(false);
    }
  }, [isOpen]);

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(planId);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (!stripeInstance) {
        throw new Error('Payment system unavailable');
      }

      setGlobalLoading(true);

      // Create Stripe Checkout session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_id: planId,
          user_id: user.id,
          assessment_id: assessmentId,
          success_url: `${window.location.origin}/results/${assessmentId}`,
          cancel_url: window.location.href
        })
      });

      if (!response.ok) { 
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripeInstance.redirectToCheckout({ sessionId });
      if (stripeError) {
        throw stripeError;
      }

=======
export function SubscriptionModal({ isOpen, onClose, assessmentId, isLoading = false }: SubscriptionModalProps) {
  console.log('SubscriptionModal rendering with isOpen:', isOpen, 'assessmentId:', assessmentId);
  const [localLoading, setLocalLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Reset error when modal is closed
  useEffect(() => {
    if (!isOpen) {
      console.log('SubscriptionModal closed, resetting state');
      setError(null);
      setLocalLoading(null);
    } else {
      // Check if we're offline
      setIsOffline(connectionManager.isOffline());
      
      if (isOpen && assessmentId) {
        console.log('SubscriptionModal opened with assessmentId, checking subscription');
        checkExistingSubscription();
      }
    }
  }, [isOpen, assessmentId]);

  const checkExistingSubscription = async () => {
    try {
      setCheckingSubscription(true);
      console.log('Checking existing subscription for assessment ID:', assessmentId);
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      let hasSubscription = false;
      try {
        hasSubscription = await checkSubscriptionByCustomerId(data.user.id);
        
        // Cache the subscription status
        cacheSubscriptionStatus(data.user.id, hasSubscription, 1); // Cache for 1 day
      } catch (subError) {
        console.error('Error checking subscription:', subError);
        // Default to false if there's an error
        hasSubscription = false;
      }
      
      if (hasSubscription) {
        console.log('User has active subscription, redirecting to results');
        // User has a subscription, redirect to results
        onClose();
        
        // Check for pending invitation code
        const pendingInvitationCode = localStorage.getItem('pendingInvitationCode');
        if (pendingInvitationCode) {
          console.log('Found pending invitation code:', pendingInvitationCode);
          window.location.href = `/partner-assessment/${pendingInvitationCode}`;
          
          // Clear localStorage
          localStorage.removeItem('pendingInvitationCode');
          localStorage.removeItem('pendingAssessmentType');
          localStorage.removeItem('pendingAssessmentId');
        }
        // Otherwise, determine which results page to navigate to based on assessment type
        else if (assessmentId) {
          const { data: assessment } = await supabase
            .from('assessment_history')
            .select('assessment_type')
            .eq('id', assessmentId)
            .single();

          if (assessment) {
            const redirectPath = assessment.assessment_type === 'bridal-price' 
              ? `/assessment-results/${assessmentId}`
              : assessment.assessment_type === 'wife-material'
              ? `/wife-material-results/${assessmentId}`
              :  `/high-value-results/${assessmentId}`;
              
            console.log('Redirecting to:', redirectPath);
            window.location.href = redirectPath;
          }
        }
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      console.log('Finished checking subscription');
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      console.log('Handling subscribe for plan:', planId);
      setLocalLoading(planId); 
      setError(null);
      
      // Check if we're offline
      if (connectionManager.isOffline()) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.');
      }
      
      // Find the selected plan
      const selectedPlan = PLANS.find(plan => plan.id === planId);
      if (!selectedPlan) throw new Error('Invalid plan selected');
      
      // Store the assessment ID in localStorage before redirecting
      // This will be used to redirect the user back to their results after payment
      const pendingAssessmentId = assessmentId || localStorage.getItem('pendingAssessmentId');
      if (pendingAssessmentId) {
        console.log('Storing assessment ID in localStorage:', assessmentId);
        localStorage.setItem('pendingAssessmentId', pendingAssessmentId);
      }
      
      // Redirect to the Stripe payment link
      const paymentLink = selectedPlan.paymentLink || '';
      console.log('Redirecting to payment link:', paymentLink);
      
      if (!paymentLink || paymentLink === '#') {
        throw new Error('Payment link is not configured properly');
      }
      
      window.location.href = paymentLink;
      
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process subscription';
      console.error('Subscription error:', errorMessage);
      setError(errorMessage);
<<<<<<< HEAD
    } finally {
      setLoading(null);
      setGlobalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {globalLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Preparing checkout...</p>
            </div>
          </div>
        )}
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-3xl">
            Unlock Your Full Results
          </DialogTitle>
          <p className="text-muted-foreground">
            Select a plan to access your complete assessment insights
          </p>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <div className={`p-6 bg-gradient-to-br ${plan.color}`}>
                  <Icon className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-1 text-white/90">{plan.price}</div>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className="mt-6 w-full bg-gradient-to-r hover:opacity-90 transition-all"
                    style={{
                      backgroundImage: loading === plan.id ? 'none' : `linear-gradient(to right, ${plan.color})`
                    }}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
=======
      setLocalLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[80vh] w-[95vw] flex flex-col overflow-hidden fixed bottom-0 right-0 sm:bottom-auto sm:right-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
        {checkingSubscription ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-center">Checking subscription status...</p> 
            <p className="text-sm text-muted-foreground mt-2">This may take a moment...</p>
          </div>
        ) : (
          <>
          <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-3xl">
            Unlock Your Full Results
          </DialogTitle>
          <CardDescription className="text-lg">
            Select a plan to access your complete assessment insights
          </CardDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4 mx-auto max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isOffline && (
            <Alert variant="destructive" className="mb-4 mx-auto max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You appear to be offline. Please check your internet connection to subscribe.
              </AlertDescription>
            </Alert>
          )}

          <ScrollArea className="flex-1 w-full px-4 py-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden ${
                    plan.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <div className={`p-6 bg-gradient-to-br ${plan.color}`}>
                    <Icon className="w-6 h-6 text-white mb-2" />
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="text-white/90">{plan.price}</div>
                  </div>
                  <CardContent className="p-6">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={localLoading === plan.id || isLoading || isOffline} 
                    className={cn(
                      "w-full", 
                      localLoading === plan.id || isLoading ? "bg-gray-200" : 
                      "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 transition-all"
                    )}
                    size="lg"
                  >
                    {localLoading === plan.id || isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       <span className="text-gray-700">Processing...</span>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                      </div>
                    ) : (
                      'Choose Plan'
                    )}
<<<<<<< HEAD
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={onClose}
          variant="ghost"
          className="mt-8 w-full text-gray-500 hover:text-gray-700"
        >
          Maybe Later
        </Button>
=======
                  </Button> 
                  <div className="mt-2">
                    <StripeCheckoutButton
                      priceId={plan.stripePriceId}
                      assessmentId={assessmentId}
                      variant="outline"
                      className="w-full text-sm"
                      disabled={isOffline}
                    >
                      <CreditCard className="w-4 h-4 mr-2" /> Pay with Stripe
                    </StripeCheckoutButton>
                  </div>
                  </CardFooter>
                </Card>
              );
            })}
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="text-center mb-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Already purchased a subscription with a different email? 
                </p>
              </div>
              <Button 
                variant="outline" 
                className="mx-auto block"
                onClick={() => {
                  onClose();
                  window.location.href = '/settings?tab=subscription';
                }}
              > 
                <LinkIcon className="w-4 h-4 mr-2" />
                Link Existing Subscription
              </Button>
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
              onClick={onClose}
              variant="outline" 
              className="w-full text-gray-500 hover:text-gray-700"
              size="sm"
            >
              Maybe Later
            </Button>
          </div>
          </> 
        )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      </DialogContent>
    </Dialog>
  );
}