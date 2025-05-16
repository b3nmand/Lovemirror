import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CreditCard, Loader2, AlertCircle, CheckCircle, Link as LinkIcon, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { linkStripeCustomerId } from '@/lib/subscriptionUtils';

interface LinkSubscriptionProps {
  onSuccess?: () => void;
}

export function LinkSubscription({ onSuccess }: LinkSubscriptionProps) {
  const [stripeId, setStripeId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'id' | 'email'>('id');

  const handleLinkById = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripeId.trim()) {
      setError('Please enter a valid Stripe Customer ID or Subscription ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to link a subscription');

      // First, check if this is a customer ID (starts with 'cus_') or subscription ID (starts with 'sub_')
      const idType = stripeId.startsWith('cus_') ? 'customer' : stripeId.startsWith('sub_') ? 'subscription' : null;
      
      if (!idType) {
        throw new Error('Invalid ID format. Please enter a valid Stripe Customer ID (starts with cus_) or Subscription ID (starts with sub_)');
      }

      console.log(`Linking ${idType} ID:`, stripeId, 'to user:', user.id);

      // Update the profiles table with the Stripe customer ID
      if (idType === 'customer') {
        const success = await linkStripeCustomerId(user.id, stripeId);

        if (!success) {
          throw new Error('Failed to link customer ID to your profile');
        }
      } else {
        // For subscription IDs, we need to fetch the customer ID first
        // This would typically be done through a Supabase Edge Function that calls Stripe API
        // For now, we'll just update the subscription directly
        const { data: existingSubscription, error: fetchError } = await supabase
          .from('subscriptions')
          .select('stripe_customer_id')
          .eq('stripe_subscription_id', stripeId)
          .maybeSingle();
          
        if (fetchError) throw fetchError;
        
        if (existingSubscription?.stripe_customer_id) {
          // If we found a customer ID, link it to the user's profile
          const success = await linkStripeCustomerId(user.id, existingSubscription.stripe_customer_id);
          
          if (!success) {
            throw new Error('Failed to link customer ID to your profile');
          }
        } else {
          // If no customer ID found, create a placeholder subscription
          const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            stripe_subscription_id: stripeId,
            stripe_customer_id: 'manual_link_' + Date.now(), // Placeholder
            plan: '1_month', // Default plan, would be fetched from Stripe
            status: 'active',
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          });

          if (subscriptionError) throw subscriptionError;
        }
      }
      
      // Create a placeholder subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_subscription_id: `manual_link_${Date.now()}`,
          stripe_customer_id: stripeId,
          plan: '1_month', // Default plan
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (subscriptionError) {
        console.error('Error creating placeholder subscription:', subscriptionError);
        // Continue anyway since we've already updated the profile
        console.log('Continuing with customer ID link despite subscription creation error');
      }

      setSuccess('Subscription linked successfully! You now have access to premium features.');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error linking subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to link subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to link a subscription');

      console.log('Searching for subscription with email:', email);

      // First, check if there's a user with this email
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      const matchingUser = users.find(u => u.email === email);
      
      if (!matchingUser) {
        throw new Error('No account found with this email address');
      }
      
      console.log('Found user with matching email:', matchingUser.id);

      // Check if this user has an active subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', matchingUser.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();
        
      if (subscriptionError) throw subscriptionError;
      
      if (!subscription) {
        // Check if the user has a customer ID in their profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', matchingUser.id)
          .single();
          
        if (profileError) throw profileError;
        
        if (!profile?.stripe_customer_id) {
          throw new Error('No active subscription found for this email address');
        }
        
        // Link the customer ID to the current user
        const success = await linkStripeCustomerId(user.id, profile.stripe_customer_id);
        
        if (!success) {
          throw new Error('Failed to link customer ID to your profile');
        }
      } else {
        console.log('Found subscription:', subscription.id);
        
        // Link the customer ID to the current user
        const success = await linkStripeCustomerId(user.id, subscription.stripe_customer_id);
        
        if (!success) {
          throw new Error('Failed to link customer ID to your profile');
        }
      }
      
      setSuccess('Subscription linked successfully! You now have access to premium features.');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error linking subscription by email:', err);
      setError(err instanceof Error ? err.message : 'Failed to link subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          Link Existing Subscription
        </CardTitle>
        <CardDescription>
          If you purchased a subscription with a different email address, you can link it to your account here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'id' | 'email')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="id">Link by ID</TabsTrigger>
            <TabsTrigger value="email">Link by Email</TabsTrigger>
          </TabsList>

          <TabsContent value="id" className="mt-4">
            <form onSubmit={handleLinkById} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeId">Stripe Customer ID or Subscription ID</Label>
                <Input
                  id="stripeId"
                  placeholder="e.g., cus_1234abcd or sub_5678efgh"
                  value={stripeId}
                  onChange={(e) => setStripeId(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  You can find this ID in your Stripe receipt email or by contacting our support team.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !stripeId.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Linking...
                  </>
                ) : (
                  'Link Subscription'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <form onSubmit={handleLinkByEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address Used for Purchase</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter the email you used for payment"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the email address you used when purchasing your subscription.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Find & Link Subscription'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}