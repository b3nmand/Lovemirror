/*
  # Add Development Plans Table

  1. New Tables
    - `development_plans`
      - Stores AI-generated development plans
      - Links to assessment_history
      - Includes plan data and metadata

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Handle existing objects gracefully
*/

-- Drop existing objects if they exist
DO $$ 
BEGIN
  -- Drop trigger if it exists
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_development_plans_timestamp'
  ) THEN
    DROP TRIGGER IF EXISTS update_development_plans_timestamp ON development_plans;
  END IF;

  -- Drop policy if it exists
  DROP POLICY IF EXISTS "Users can manage their development plans" ON development_plans;

  -- Drop function if it exists
  DROP FUNCTION IF EXISTS handle_development_plan_timestamp();
END $$;

-- Create development_plans table if it doesn't exist
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

-- Create function to handle timestamp updates
CREATE OR REPLACE FUNCTION handle_development_plan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
CREATE TRIGGER update_development_plans_timestamp
  BEFORE UPDATE ON development_plans
  FOR EACH ROW
  EXECUTE FUNCTION handle_development_plan_timestamp();