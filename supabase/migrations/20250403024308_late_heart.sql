/*
  # Three Score System Implementation

  1. New Tables
    - `partner_links`: Links users with their partners
    - `external_assessors`: Stores information about external assessors
    - `assessment_types`: Defines different types of assessments
    - `assessment_scores`: Stores calculated scores for each assessment type

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create partner_links table
CREATE TABLE IF NOT EXISTS partner_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  partner_code uuid DEFAULT gen_random_uuid(),
  linked_partner_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, linked_partner_id)
);

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
  UNIQUE (user_id, assessor_email)
);

-- Create assessment_types table
CREATE TABLE IF NOT EXISTS assessment_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text
);

-- Create assessment_scores table
CREATE TABLE IF NOT EXISTS assessment_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id),
  type_id uuid REFERENCES assessment_types(id),
  category_id uuid REFERENCES categories(id),
  score decimal NOT NULL,
  gap_score decimal, -- For delusional score
  created_at timestamptz DEFAULT now(),
  UNIQUE (assessment_id, type_id, category_id)
);

-- Enable RLS
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_assessors ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their partner links"
  ON partner_links FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their external assessors"
  ON external_assessors FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read assessment types"
  ON assessment_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their assessment scores"
  ON assessment_scores FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM assessments
    WHERE assessments.id = assessment_scores.assessment_id
    AND assessments.user_id = auth.uid()
  ));

-- Insert assessment types
INSERT INTO assessment_types (name, description) VALUES
  ('self', 'Self assessment score'),
  ('compatibility', 'Partner compatibility score'),
  ('delusional', 'Gap between self-perception and external perception');

-- Add color coding for score ranges
CREATE OR REPLACE FUNCTION get_score_color(score decimal)
RETURNS text AS $$
BEGIN
  IF score >= 80 THEN
    RETURN '#22C55E'; -- Green for Strong/Aligned
  ELSIF score >= 60 THEN
    RETURN '#EAB308'; -- Yellow for Moderate/Needs Work
  ELSE
    RETURN '#EF4444'; -- Red for Weak/At Risk
  END IF;
END;
$$ LANGUAGE plpgsql;