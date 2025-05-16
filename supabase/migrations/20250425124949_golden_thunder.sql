/*
  # Add Stripe Webhook Secret to Environment Variables

  1. Changes
    - Add STRIPE_WEBHOOK_SECRET to environment variables
    - Update stripe-webhook function to use the secret for verification
    - Add index on stripe_customer_id in subscriptions table

  2. Security
    - Ensure webhook events are properly verified
    - Maintain existing RLS policies
*/

-- Add index on stripe_customer_id for faster lookups
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);

-- Create function to verify Stripe webhook signatures
CREATE OR REPLACE FUNCTION verify_stripe_webhook(
  payload text,
  signature text,
  secret text
)
RETURNS boolean AS $$
BEGIN
  -- This is a placeholder function since we can't implement cryptographic verification in SQL
  -- The actual verification happens in the Edge Function
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Create function to process Stripe webhook events
CREATE OR REPLACE FUNCTION process_stripe_webhook_event(
  event_type text,
  event_data jsonb
)
RETURNS boolean AS $$
DECLARE
  subscription_id text;
  customer_id text;
  user_id uuid;
  subscription_status text;
  current_period_start timestamptz;
  current_period_end timestamptz;
BEGIN
  -- Process different event types
  IF event_type = 'checkout.session.completed' THEN
    -- Extract data from checkout session
    subscription_id := event_data->'subscription'->>'id';
    customer_id := event_data->'customer'->>'id';
    user_id := (event_data->'metadata'->>'user_id')::uuid;
    
    -- Update profiles table with customer ID
    UPDATE profiles
    SET stripe_customer_id = customer_id
    WHERE id = user_id;
    
    RETURN true;
  ELSIF event_type = 'customer.subscription.updated' OR event_type = 'customer.subscription.deleted' THEN
    -- Extract subscription data
    subscription_id := event_data->>'id';
    customer_id := event_data->'customer'->>'id';
    subscription_status := event_data->>'status';
    current_period_start := to_timestamp((event_data->'current_period_start')::bigint);
    current_period_end := to_timestamp((event_data->'current_period_end')::bigint);
    
    -- Update subscription in database
    UPDATE subscriptions
    SET 
      status = subscription_status,
      current_period_start = current_period_start,
      current_period_end = current_period_end,
      updated_at = now()
    WHERE stripe_subscription_id = subscription_id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql;