/*
  # Improve External Assessors Schema

  1. Changes
    - Add assessment_type column to external_assessors table
    - Add check constraint for valid assessment types
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Add check constraint for assessment types
*/

-- Add assessment_type column to external_assessors
ALTER TABLE external_assessors
ADD COLUMN assessment_type text;

-- Add check constraint for assessment_type
ALTER TABLE external_assessors
ADD CONSTRAINT external_assessors_assessment_type_check
CHECK (assessment_type IN ('wife-material', 'bridal-price'));

-- Update existing policies to include assessment_type
DROP POLICY IF EXISTS "Users can manage their external assessors" ON external_assessors;

CREATE POLICY "Users can manage their external assessors"
  ON external_assessors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);