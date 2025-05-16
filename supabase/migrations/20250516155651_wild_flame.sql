/*
  # Fix Assessment Saving Issues

  1. Changes
    - Add target_user_id and completed_at columns to assessment_history
    - Add health_check table for connection testing
    - Fix assessment_responses table to properly reference assessment_history
    - Add function to calculate assessment scores

  2. Security
    - Maintain existing RLS policies
*/

-- Create health_check table for connection testing
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  status TEXT
);

-- Insert a test record
INSERT INTO health_check (status) VALUES ('ok');

-- Add missing columns to assessment_history if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assessment_history' 
    AND column_name = 'target_user_id'
  ) THEN
    ALTER TABLE assessment_history ADD COLUMN target_user_id uuid REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assessment_history' 
    AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE assessment_history ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Fix assessment_responses table to reference assessment_history instead of assessments
DO $$ 
BEGIN
  -- First check if the table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'assessment_responses'
  ) THEN
    -- Check if the foreign key constraint exists
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'assessment_responses_assessment_id_fkey'
    ) THEN
      -- Drop the existing foreign key constraint
      ALTER TABLE assessment_responses DROP CONSTRAINT assessment_responses_assessment_id_fkey;
    END IF;

    -- Add the new foreign key constraint
    ALTER TABLE assessment_responses
    ADD CONSTRAINT assessment_responses_assessment_id_fkey
    FOREIGN KEY (assessment_id) REFERENCES assessment_history(id);
  END IF;
END $$;

-- Create function to calculate assessment scores
CREATE OR REPLACE FUNCTION calculate_assessment_scores(
  p_assessment_id uuid
)
RETURNS numeric AS $$
DECLARE
  total_score numeric := 0;
  category_scores jsonb := '[]'::jsonb;
  overall_score numeric := 0;
BEGIN
  -- Calculate scores for each category
  WITH responses AS (
    -- Get all responses for this assessment
    SELECT 
      ar.question_id,
      ar.response_value,
      uq.category_id
    FROM assessment_responses ar
    JOIN unified_assessment_questions uq ON ar.question_id = uq.id
    WHERE ar.assessment_id = p_assessment_id
  ),
  category_results AS (
    -- Calculate average score for each category
    SELECT 
      r.category_id,
      AVG(r.response_value) * 20 AS score -- Convert 1-5 scale to percentage
    FROM responses r
    GROUP BY r.category_id
  )
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'category_id', cr.category_id,
        'score', cr.score
      )
    ),
    AVG(cr.score)
  INTO 
    category_scores,
    overall_score
  FROM category_results cr;

  -- Update the assessment with calculated scores
  UPDATE assessment_history
  SET 
    overall_score = COALESCE(overall_score, 0),
    category_scores = COALESCE(category_scores, '[]'::jsonb),
    completed_at = now()
  WHERE id = p_assessment_id;

  RETURN overall_score;
END;
$$ LANGUAGE plpgsql;