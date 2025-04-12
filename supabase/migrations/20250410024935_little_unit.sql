/*
  # Add Subscription System Tables

  1. New Tables
    - `subscriptions`
      - Stores user subscription data
      - Links to Stripe subscription ID
      - Tracks subscription status and dates
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  stripe_subscription_id text NOT NULL,
  stripe_customer_id text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('1_month', '3_months', '6_months', '12_months')),
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(stripe_subscription_id)
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add has_active_subscription function
CREATE OR REPLACE FUNCTION has_active_subscription(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE subscriptions.user_id = has_active_subscription.user_id
    AND status = 'active'
    AND current_period_end > now()
  );
END;
$$ LANGUAGE plpgsql;