/*
  # External Assessment System

  1. New Tables
    - `external_assessors`
      - Stores external assessor information
      - Tracks assessment status and relationship type
    - `external_assessment_responses`
      - Stores responses from external assessors
      - Links to assessment questions

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS external_assessment_responses;
DROP TABLE IF EXISTS external_assessors;

-- Create external_assessors table
CREATE TABLE IF NOT EXISTS external_assessors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  assessor_email text NOT NULL,
  relationship_type text NOT NULL CHECK (relationship_type IN ('parent', 'friend', 'sibling', 'partner')),
  invitation_code uuid DEFAULT gen_random_uuid(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, assessor_email)
);

-- Create external_assessment_responses table
CREATE TABLE IF NOT EXISTS external_assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessor_id uuid REFERENCES external_assessors(id),
  question_id uuid REFERENCES unified_assessment_questions(id),
  response_value integer NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE external_assessors ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_assessment_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their external assessors" ON external_assessors;
DROP POLICY IF EXISTS "Users can read responses from their assessors" ON external_assessment_responses;

-- Create policies
CREATE POLICY "Users can manage their external assessors"
  ON external_assessors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read responses from their assessors"
  ON external_assessment_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM external_assessors
      WHERE external_assessors.id = external_assessment_responses.assessor_id
      AND external_assessors.user_id = auth.uid()
    )
  );

-- Function to calculate delusional score
CREATE OR REPLACE FUNCTION calculate_delusional_score(
  user_id uuid,
  category_id uuid
)
RETURNS TABLE (
  self_score numeric,
  external_score numeric,
  gap_score numeric
)
LANGUAGE plpgsql
AS $$
DECLARE
  self_assessment_id uuid;
BEGIN
  -- Get latest self assessment
  SELECT id INTO self_assessment_id
  FROM assessment_history
  WHERE assessment_history.user_id = user_id
  ORDER BY created_at DESC
  LIMIT 1;

  -- Calculate scores
  RETURN QUERY
  WITH self_scores AS (
    SELECT 
      q.category_id,
      AVG(ar.response_value)::numeric as score
    FROM assessment_responses ar
    JOIN unified_assessment_questions q ON q.id = ar.question_id
    WHERE ar.assessment_id = self_assessment_id
    AND q.category_id = calculate_delusional_score.category_id
    GROUP BY q.category_id
  ),
  external_scores AS (
    SELECT 
      q.category_id,
      AVG(ear.response_value)::numeric as score
    FROM external_assessment_responses ear
    JOIN unified_assessment_questions q ON q.id = ear.question_id
    JOIN external_assessors ea ON ea.id = ear.assessor_id
    WHERE ea.user_id = calculate_delusional_score.user_id
    AND ea.status = 'completed'
    AND q.category_id = calculate_delusional_score.category_id
    GROUP BY q.category_id
  )
  SELECT 
    s.score as self_score,
    e.score as external_score,
    ABS(s.score - e.score) as gap_score
  FROM self_scores s
  LEFT JOIN external_scores e ON e.category_id = s.category_id;
END;
$$;