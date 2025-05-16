/*
  # Add Stripe Customer ID to Profiles Table

  1. Changes
    - Add stripe_customer_id column to profiles table
    - Add index for faster lookups
    - Update subscription handling to use customer ID

  2. Security
    - No changes to RLS policies needed
*/

-- Add stripe_customer_id column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text;
  END IF;
END $$;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);

-- Create function to check subscription by customer ID
CREATE OR REPLACE FUNCTION check_subscription_by_customer_id(user_id uuid)
RETURNS boolean AS $$
DECLARE
  customer_id text;
  has_sub boolean;
BEGIN
  -- Get the customer ID from the profile
  SELECT stripe_customer_id INTO customer_id
  FROM profiles
  WHERE id = user_id;
  
  -- If no customer ID, check the regular way
  IF customer_id IS NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.user_id = check_subscription_by_customer_id.user_id
      AND status = 'active'
      AND current_period_end > now()
    );
  END IF;
  
  -- Check if there's a subscription with this customer ID
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE stripe_customer_id = customer_id
    AND status = 'active'
    AND current_period_end > now()
  );
END;
$$ LANGUAGE plpgsql;