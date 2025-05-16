/*
  # Fix Development Plans RLS Policy

  1. Changes
    - Add RLS policy for development_plans table
    - Ensure users can manage their own development plans
    - Fix any missing constraints or indexes

  2. Security
    - Maintain existing RLS policies
    - Add missing policy for development_plans
*/

-- Check if development_plans table exists and create it if not
CREATE TABLE IF NOT EXISTS development_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessment_history(id) ON DELETE CASCADE,
  plan_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(assessment_id)
);

-- Enable RLS
ALTER TABLE development_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their development plans" ON development_plans;

-- Create policy
CREATE POLICY "Users can manage their development plans"
  ON development_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessment_history
      WHERE assessment_history.id = development_plans.assessment_id
      AND assessment_history.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessment_history
      WHERE assessment_history.id = development_plans.assessment_id
      AND assessment_history.user_id = auth.uid()
    )
  );

-- Create function to handle timestamp updates if it doesn't exist
CREATE OR REPLACE FUNCTION handle_development_plan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at if it doesn't exist
DROP TRIGGER IF EXISTS update_development_plans_timestamp ON development_plans;
CREATE TRIGGER update_development_plans_timestamp
  BEFORE UPDATE ON development_plans
  FOR EACH ROW
  EXECUTE FUNCTION handle_development_plan_timestamp();

-- Add index on assessment_id for faster lookups
CREATE INDEX IF NOT EXISTS development_plans_assessment_id_idx ON development_plans(assessment_id);