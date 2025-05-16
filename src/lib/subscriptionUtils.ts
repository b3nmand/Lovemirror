import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type SubscriptionPlan = '1_month' | '3_months' | '6_months' | '12_months';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

/**
 * Get a user's subscription details
 * @param userId The user ID to check
 * @returns The subscription details or null if no subscription found
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    // First check direct subscription
    const { data: directSub, error: directError } = await supabase
      .from('subscriptions')
      .select('*') 
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    if (directSub) {
      return directSub;
    }

    if (directError && directError.code !== 'PGRST116') {
      console.error('Error fetching direct subscription:', directError);
    }

    // Check for customer ID in profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Default to allowing access in case of errors
      return createFallbackSubscription(userId);
    }

    if (!profile?.stripe_customer_id) {
      return null;
    }

    // Check for subscription with this customer ID
    const { data: customerSub, error: customerError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_customer_id', profile.stripe_customer_id)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Error fetching customer subscription:', customerError);
    }

    if (customerSub) {
      return customerSub;
    }

    // If customer ID exists but no subscription found, create a fallback
    if (profile.stripe_customer_id) {
      return createFallbackSubscription(userId, profile.stripe_customer_id);
    }

    return null;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    // Default to allowing access in case of errors
    return createFallbackSubscription(userId);
  }
}

/**
 * Create a fallback subscription for error cases
 */
function createFallbackSubscription(userId: string, customerId?: string): Subscription {
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 30); // 30 days from now

  return {
    id: 'fallback-' + Date.now(),
    user_id: userId,
    stripe_subscription_id: 'fallback-sub-' + Date.now(),
    stripe_customer_id: customerId || 'fallback-cus-' + Date.now(),
    plan: '1_month',
    status: 'active',
    current_period_start: now.toISOString(),
    current_period_end: end.toISOString(),
    cancel_at_period_end: false
  };
}

/**
 * Get the active price ID for a subscription plan
 * @param plan The subscription plan
 * @returns The Stripe price ID or null if not found
 */
export async function getActivePriceId(plan: SubscriptionPlan): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('stripe_price_ids')
      .select('price_id')
      .eq('plan_id', plan)
      .eq('active', true)
      .single();

    if (error) {
      console.error('Error fetching price ID:', error);
      return null;
    }

    return data.price_id;
  } catch (error) {
    console.error('Error in getActivePriceId:', error);
    return null;
  }
}

/**
 * Check if a user has an active subscription by customer ID
 * @param userId The user ID to check
 * @returns True if the user has an active subscription, false otherwise
 */
export async function checkSubscriptionByCustomerId(userId: string): Promise<boolean> {
  try {
    // First check direct subscription
    const { data: directSubscription, error: directSubError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();
      
    if (directSubError && directSubError.code !== 'PGRST116') {
      console.error('Error checking direct subscription:', directSubError);
      return false; // Don't default to true on error
    }
      
    if (directSubscription) {
      console.log('Found direct subscription:', directSubscription);
      return true;
    }
    
    // Check for customer ID in profile
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId);
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return false; // Don't default to true on error
    }
    
    // Get the first profile if it exists
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;
    
    if (profile?.stripe_customer_id) {
      console.log('Found Stripe customer ID:', profile.stripe_customer_id);
      
      // Check for subscription with this customer ID
      const { data: customerSubscription, error: customerSubError } = await supabase 
        .from('subscriptions')
        .select('*')
        .eq('stripe_customer_id', profile.stripe_customer_id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();
        
      if (customerSubscription) {
        console.log('Found customer subscription:', customerSubscription);
        return true;
      }
      
      // If customer ID exists but no subscription found, don't default to true
      console.log('Customer ID exists but no subscription record found.');
      return false;
    }
    
    // Check for any subscription in the local storage cache
    const cachedSubscription = localStorage.getItem('user_subscription_' + userId);
    if (cachedSubscription) {
      try {
        const subscription = JSON.parse(cachedSubscription);
        const expiryDate = new Date(subscription.expiry);
        if (expiryDate > new Date()) {
          console.log('Found valid cached subscription');
          return true;
        }
        // Clear expired cache
        localStorage.removeItem('user_subscription_' + userId);
      } catch (e) {
        console.error('Error parsing cached subscription:', e);
        localStorage.removeItem('user_subscription_' + userId);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false; // Don't default to true on error
  }
}

/**
 * Check if a user's subscription has expired
 * @param userId The user ID to check
 * @returns True if the subscription has expired, false otherwise
 */
export async function hasSubscriptionExpired(userId: string): Promise<boolean> {
  try {
    // First check direct subscription
    const { data: directSubscription, error: directSubError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    if (directSubError && directSubError.code !== 'PGRST116') {
      console.error('Error checking direct subscription:', directSubError);
    }

    // If direct subscription exists and is active, return false (not expired)
    if (directSubscription) {
      return false;
    }

    // Check for customer ID in profile
    const { data: profiles, error: profileError } = await supabase 
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId);

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return false; // Default to not expired in case of errors
    }

    // Get the first profile if it exists
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;

    // If profile has a customer ID, check for subscription with that customer ID
    if (profile?.stripe_customer_id) {
      const { data: customerSubscription, error: customerSubError } = await supabase 
        .from('subscriptions')
        .select('*')
        .eq('stripe_customer_id', profile.stripe_customer_id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      if (customerSubscription) {
        return false; // Not expired
      }
      
      // If customer ID exists but no subscription found, consider as not expired
      return false;
    }

    // Check for any subscription in the local storage cache
    const cachedSubscription = localStorage.getItem('user_subscription_' + userId);
    if (cachedSubscription) {
      try {
        const subscription = JSON.parse(cachedSubscription);
        const expiryDate = new Date(subscription.expiry);
        if (expiryDate > new Date()) {
          console.log('Found valid cached subscription');
          return false; // Not expired
        }
      } catch (e) {
        console.error('Error parsing cached subscription:', e);
      }
    }

    return true; // Expired
  } catch (error) {
    console.error('Error checking if subscription expired:', error);
    // Default to not expired in case of errors
    return false;
  }
}

/**
 * Check if a subscription is active
 * @param subscription The subscription to check
 * @returns True if the subscription is active, false otherwise
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.status === 'active' && new Date(subscription.current_period_end) > new Date();
}

/**
 * Get the end date of a subscription
 * @param subscription The subscription to check
 * @returns The end date of the subscription or null if no subscription
 */
export function getSubscriptionEndDate(subscription: Subscription | null): Date | null {
  if (!subscription) return null;
  return new Date(subscription.current_period_end);
}

/**
 * Link a Stripe customer ID to a user
 * @param userId The user ID to link
 * @param customerId The Stripe customer ID to link
 * @returns True if successful, false otherwise
 */
export async function linkStripeCustomerId(userId: string, customerId: string): Promise<boolean> {
  try {
    // Update the profile with the customer ID
    const { error } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId);

    if (error) {
      throw error;
    }
    
    // Cache the subscription locally
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
    
    localStorage.setItem('user_subscription_' + userId, JSON.stringify({
      customerId,
      expiry: expiryDate.toISOString()
    }));
    
    return true;
  } catch (error) {
    console.error('Error linking Stripe customer ID:', error);
    return false;
  }
}

/**
 * Cache a user's subscription status locally
 * @param userId The user ID
 * @param isSubscribed Whether the user is subscribed
 * @param expiryDays Number of days until the cache expires
 */
export function cacheSubscriptionStatus(userId: string, isSubscribed: boolean, expiryDays = 1): void {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    localStorage.setItem('user_subscription_' + userId, JSON.stringify({
      isSubscribed,
      expiry: expiryDate.toISOString()
    }));
  } catch (error) {
    console.error('Error caching subscription status:', error);
  }
}

/**
 * Get a user's cached subscription status
 * @param userId The user ID
 * @returns The cached subscription status or null if not found or expired
 */
export function getCachedSubscriptionStatus(userId: string): boolean | null {
  try {
    const cachedData = localStorage.getItem('user_subscription_' + userId);
    if (!cachedData) return null;
    
    const { isSubscribed, expiry } = JSON.parse(cachedData);
    const expiryDate = new Date(expiry);
    
    if (expiryDate > new Date()) {
      return isSubscribed;
    }
    
    // Clear expired cache
    localStorage.removeItem('user_subscription_' + userId);
    return null;
  } catch (error) {
    console.error('Error getting cached subscription status:', error);
    return null;
  }
}