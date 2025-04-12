/*
  # Fix Assessment History Policies

  1. Changes
    - Drop existing policies if they exist
    - Create new policies for assessment_history table
    - Ensure no duplicate policies

  2. Security
    - Maintain RLS protection
    - Keep existing access controls
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their assessment history" ON assessment_history;
DROP POLICY IF EXISTS "Users can insert their assessment history" ON assessment_history;

-- Create new policies
CREATE POLICY "Users can read their assessment history"
  ON assessment_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their assessment history"
  ON assessment_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create or replace progress tracking function
CREATE OR REPLACE FUNCTION get_user_progress(
  p_user_id uuid,
  p_assessment_type text,
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  date date,
  overall_score numeric,
  category_scores jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc('day', created_at)::date as date,
    overall_score,
    category_scores
  FROM assessment_history
  WHERE user_id = p_user_id
    AND assessment_type = p_assessment_type
    AND created_at >= NOW() - (p_days || ' days')::interval
  ORDER BY created_at ASC;
END;
$$ LANGUAGE plpgsql;