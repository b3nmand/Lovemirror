import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import { connectionManager } from './connectionManager';

// Initialize Stripe with the public key
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Function to create a checkout session
export const createCheckoutSession = async (priceId: string, userId: string, assessmentId?: string) => {
  try {
    console.log('Creating checkout session with:', { priceId, userId, assessmentId });
    
    // Check if we're offline
    if (connectionManager.isOffline()) {
      throw new Error('You appear to be offline. Please check your internet connection and try again.');
    }
    
    // Validate inputs
    if (!priceId) throw new Error('Price ID is required');
    if (!userId) throw new Error('User ID is required');
    
    // Validate Supabase URL and key
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing');
    }
    
    // Create checkout session via edge function
    const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        price_id: priceId,
        user_id: userId,
        assessment_id: assessmentId,
        plan_id: priceId, // Include plan ID for subscription tracking
        success_url: `${window.location.origin}/dashboard?success=true`,
        cancel_url: `${window.location.origin}/dashboard?canceled=true`
      })
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      } catch (parseError) {
        throw new Error('Failed to create checkout session: Network error');
      }
    }

    try {
      const { sessionId } = await response.json();
      return sessionId;
    } catch (parseError) {
      throw new Error('Invalid response from checkout service');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Function to redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string) => {
  console.log('Redirecting to checkout with session ID:', sessionId);
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }
  
  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    console.error('Redirect to checkout error:', error);
    throw error;
  }
};

// Function to check subscription status
export const checkSubscriptionStatus = async (userId: string): Promise<{
  hasActiveSubscription: boolean;
  subscription: any;
}> => {
  try {
    console.log('Checking subscription status for user:', userId);
    
    // Check if we're offline
    if (connectionManager.isOffline()) {
      console.log('Device is offline, using cached subscription data');
      
      // Check for cached subscription data
      const cachedSubscription = localStorage.getItem('user_subscription_' + userId);
      if (cachedSubscription) {
        try {
          const subscription = JSON.parse(cachedSubscription);
          const expiryDate = new Date(subscription.expiry);
          
          if (expiryDate > new Date()) {
            return {
              hasActiveSubscription: true,
              subscription: {
                plan: 'cached_subscription',
                status: 'active',
                current_period_end: expiryDate.toISOString()
              }
            };
          }
        } catch (e) {
          console.error('Error parsing cached subscription:', e);
        }
      }
      
      // Default to true when offline to prevent blocking legitimate users
      return {
        hasActiveSubscription: true,
        subscription: {
          plan: 'offline_fallback',
          status: 'active',
          current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        }
      };
    }
    
    // First check direct subscription in database
    const { data: directSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();
      
    if (directSubscription) {
      console.log('Found direct subscription:', directSubscription);
      
      // Cache the subscription
      const expiryDate = new Date(directSubscription.current_period_end);
      localStorage.setItem('user_subscription_' + userId, JSON.stringify({
        id: directSubscription.id,
        expiry: expiryDate.toISOString()
      }));
      
      return {
        hasActiveSubscription: true,
        subscription: directSubscription
      };
    }
    
    // Check for customer ID in profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();
      
    if (profile?.stripe_customer_id) {
      console.log('Found Stripe customer ID:', profile.stripe_customer_id);
      
      // Check for subscription with this customer ID
      const { data: customerSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_customer_id', profile.stripe_customer_id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();
        
      if (customerSubscription) {
        console.log('Found customer subscription:', customerSubscription);
        
        // Cache the subscription
        const expiryDate = new Date(customerSubscription.current_period_end);
        localStorage.setItem('user_subscription_' + userId, JSON.stringify({
          id: customerSubscription.id,
          expiry: expiryDate.toISOString()
        }));
        
        return {
          hasActiveSubscription: true,
          subscription: customerSubscription
        };
      }
      
      // If customer ID exists but no subscription found, consider as subscribed
      // This helps in cases where webhook processing is delayed
      console.log('Customer ID exists but no subscription record found. Considering as subscribed.');
      
      // Cache this decision
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
      localStorage.setItem('user_subscription_' + userId, JSON.stringify({
        customerId: profile.stripe_customer_id,
        expiry: expiryDate.toISOString()
      }));
      
      return {
        hasActiveSubscription: true,
        subscription: {
          plan: 'linked_subscription',
          status: 'active',
          current_period_end: expiryDate.toISOString()
        }
      };
    }
    
    // If all else fails, check via edge function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing');
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/check-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        user_id: userId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to check subscription status');
    }

    const result = await response.json();
    console.log('Subscription check result from edge function:', result);
    
    // Cache the result
    if (result.hasActiveSubscription) {
      const expiryDate = new Date(result.subscription.current_period_end || Date.now() + 7 * 24 * 60 * 60 * 1000);
      localStorage.setItem('user_subscription_' + userId, JSON.stringify({
        id: result.subscription.id,
        expiry: expiryDate.toISOString()
      }));
    }
    
    return result;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    // Default to allowing access in case of errors
    return {
      hasActiveSubscription: true,
      subscription: {
        plan: 'error_fallback',
        status: 'active',
        current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }
    };
  }
};