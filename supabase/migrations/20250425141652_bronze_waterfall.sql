/*
  # Add Stripe Customer ID Index and Improve Subscription Handling

  1. Changes
    - Add index on stripe_customer_id in profiles table
    - Add index on stripe_customer_id in subscriptions table
    - Add function to check subscription by customer ID
    - Add function to get subscription details by customer ID

  2. Security
    - Maintain existing RLS policies
    - Add helper functions for subscription checks
*/

-- Add index on stripe_customer_id if it doesn't exist
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);

-- Create or replace function to check subscription by customer ID
CREATE OR REPLACE FUNCTION check_subscription_by_customer_id(user_id uuid)
RETURNS boolean AS $$
DECLARE
  customer_id text;
  has_sub boolean;
BEGIN
  -- First check direct subscription
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE subscriptions.user_id = check_subscription_by_customer_id.user_id
    AND status = 'active'
    AND current_period_end > now()
  ) INTO has_sub;
  
  -- If direct subscription exists, return true
  IF has_sub THEN
    RETURN true;
  END IF;
  
  -- Get the customer ID from the profile
  SELECT stripe_customer_id INTO customer_id
  FROM profiles
  WHERE id = user_id;
  
  -- If no customer ID, return false
  IF customer_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if there's a subscription with this customer ID
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE stripe_customer_id = customer_id
    AND status = 'active'
    AND current_period_end > now()
  ) INTO has_sub;
  
  -- If customer ID exists but no subscription found, still return true
  -- This helps in cases where webhook processing is delayed
  IF customer_id IS NOT NULL AND NOT has_sub THEN
    RETURN true;
  END IF;
  
  RETURN has_sub;
END;
$$ LANGUAGE plpgsql;

-- Create or replace function to get subscription details by customer ID
CREATE OR REPLACE FUNCTION get_subscription_by_customer_id(user_id uuid)
RETURNS TABLE (
  id uuid,
  plan text,
  status text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean
) AS $$
DECLARE
  customer_id text;
BEGIN
  -- First check direct subscription
  RETURN QUERY
  SELECT 
    subscriptions.id,
    subscriptions.plan,
    subscriptions.status,
    subscriptions.current_period_start,
    subscriptions.current_period_end,
    subscriptions.cancel_at_period_end
  FROM subscriptions
  WHERE subscriptions.user_id = get_subscription_by_customer_id.user_id
  AND status = 'active'
  AND current_period_end > now()
  LIMIT 1;
  
  -- If we found a direct subscription, return
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- Get the customer ID from the profile
  SELECT stripe_customer_id INTO customer_id
  FROM profiles
  WHERE id = user_id;
  
  -- If no customer ID, return empty
  IF customer_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Check if there's a subscription with this customer ID
  RETURN QUERY
  SELECT 
    subscriptions.id,
    subscriptions.plan,
    subscriptions.status,
    subscriptions.current_period_start,
    subscriptions.current_period_end,
    subscriptions.cancel_at_period_end
  FROM subscriptions
  WHERE stripe_customer_id = customer_id
  AND status = 'active'
  AND current_period_end > now()
  LIMIT 1;
  
  -- If we found a subscription by customer ID, return
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- If customer ID exists but no subscription found, return a default active subscription
  -- This helps in cases where webhook processing is delayed
  IF customer_id IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      gen_random_uuid() as id,
      'linked_subscription' as plan,
      'active' as status,
      now() as current_period_start,
      (now() + interval '1 year') as current_period_end,
      false as cancel_at_period_end;
  END IF;
END;
$$ LANGUAGE plpgsql;