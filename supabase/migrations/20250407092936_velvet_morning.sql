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
*/

-- Create development_plans table
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

-- Create policies
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