/*
  # Add Subscription Linking by Email

  1. New Functions
    - `find_subscriptions_by_email`
      - Finds subscriptions associated with a given email address
    - `link_subscription_to_user`
      - Links an existing subscription to a different user

  2. Security
    - Functions are accessible to authenticated users
*/

-- Create function to find subscriptions by email
CREATE OR REPLACE FUNCTION find_subscriptions_by_email(email text)
RETURNS TABLE (
  subscription_id uuid,
  customer_id text,
  plan text,
  status text,
  current_period_end timestamptz
) AS $$
BEGIN
  -- Find users with this email
  RETURN QUERY
  SELECT 
    s.id as subscription_id,
    s.stripe_customer_id as customer_id,
    s.plan,
    s.status,
    s.current_period_end
  FROM subscriptions s
  JOIN auth.users u ON s.user_id = u.id
  WHERE u.email = email
  AND s.status = 'active'
  AND s.current_period_end > now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to link subscription to user
CREATE OR REPLACE FUNCTION link_subscription_to_user(
  target_user_id uuid,
  subscription_id uuid
)
RETURNS boolean AS $$
DECLARE
  sub_record record;
BEGIN
  -- Get the subscription details
  SELECT * INTO sub_record
  FROM subscriptions
  WHERE id = subscription_id;
  
  IF sub_record IS NULL THEN
    RETURN false;
  END IF;
  
  -- Update the user's profile with the customer ID
  UPDATE profiles
  SET stripe_customer_id = sub_record.stripe_customer_id
  WHERE id = target_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for the functions
GRANT EXECUTE ON FUNCTION find_subscriptions_by_email TO authenticated;
GRANT EXECUTE ON FUNCTION link_subscription_to_user TO authenticated;