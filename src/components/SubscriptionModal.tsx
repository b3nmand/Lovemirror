import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Crown, Shield, Star, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '../lib/supabase';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId?: string;
}

const PLANS = [
  {
    id: '1_month',
    name: '1 Month',
    price: '£9.99',
    features: [
      'Full Assessment Results',
      'AI Development Plan',
      'Compatibility Reports',
      'Delusional Score Insights'
    ],
    icon: Star,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '3_months',
    name: '3 Months',
    price: '£15.00',
    features: [
      'Everything in 1 Month',
      'Progress Tracking',
      'External Assessor Tools',
      'Priority Support'
    ],
    icon: Shield,
    color: 'from-violet-500 to-purple-500',
    popular: true
  },
  {
    id: '12_months',
    name: '12 Months',
    price: '£36.00',
    features: [
      'Everything in 3 Months',
      'AI Relationship Coach',
      'Exclusive Content',
      'VIP Support'
    ],
    icon: Crown,
    color: 'from-amber-500 to-yellow-500'
  }
];

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

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process subscription';
      console.error('Subscription error:', errorMessage);
      setError(errorMessage);
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
                      </div>
                    ) : (
                      'Choose Plan'
                    )}
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
      </DialogContent>
    </Dialog>
  );
}