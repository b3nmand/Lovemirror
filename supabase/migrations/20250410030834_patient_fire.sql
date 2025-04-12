/*
  # Add Stripe Price IDs to Environment Variables

  1. Changes
    - Add stripe_price_ids table to store price IDs for each plan
    - Add initial price IDs for testing
*/

-- Create stripe_price_ids table
CREATE TABLE IF NOT EXISTS stripe_price_ids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id text NOT NULL CHECK (plan_id IN ('1_month', '3_months', '6_months', '12_months')),
  price_id text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(plan_id, active)
);

-- Enable RLS
ALTER TABLE stripe_price_ids ENABLE ROW LEVEL SECURITY;

-- Create policy for reading price IDs
CREATE POLICY "Anyone can read price IDs"
  ON stripe_price_ids
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert test price IDs (replace with actual Stripe price IDs)
INSERT INTO stripe_price_ids (plan_id, price_id) VALUES
  ('1_month', 'price_1_month'),
  ('3_months', 'price_3_months'),
  ('6_months', 'price_6_months'),
  ('12_months', 'price_12_months');