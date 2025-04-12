/*
  # Results Tracking and Progress System

  1. New Tables
    - `assessment_history`
      - Stores historical assessment scores
      - Tracks progress over time
      - Links to assessment types and categories
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create assessment history table
CREATE TABLE IF NOT EXISTS assessment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  assessment_type text NOT NULL CHECK (assessment_type = ANY (ARRAY['high-value', 'bridal-price', 'wife-material'])),
  overall_score numeric NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  category_scores jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assessment_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their assessment history"
  ON assessment_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their assessment history"
  ON assessment_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to calculate progress
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