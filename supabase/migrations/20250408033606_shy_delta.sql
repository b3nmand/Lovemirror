/*
  # Add Compatibility Score System

  1. New Tables
    - `partner_invitations`
      - Stores partner assessment invitations
      - Tracks invitation status and assessment type
    - `compatibility_scores`
      - Stores calculated compatibility scores
      - Links assessments between partners

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create partner_invitations table
CREATE TABLE IF NOT EXISTS partner_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id),
  invitation_code uuid DEFAULT gen_random_uuid(),
  assessment_type text NOT NULL CHECK (assessment_type = ANY (ARRAY['high-value', 'bridal-price', 'wife-material'])),
  status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'accepted', 'completed'])),
  recipient_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  UNIQUE(sender_id, recipient_id)
);

-- Create compatibility_scores table
CREATE TABLE IF NOT EXISTS compatibility_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES auth.users(id),
  user2_id uuid REFERENCES auth.users(id),
  user1_assessment_id uuid REFERENCES assessment_history(id),
  user2_assessment_id uuid REFERENCES assessment_history(id),
  overall_score numeric NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  category_scores jsonb NOT NULL,
  strengths jsonb,
  improvements jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Enable RLS
ALTER TABLE partner_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for partner_invitations
CREATE POLICY "Users can manage their sent invitations"
  ON partner_invitations
  FOR ALL
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view invitations sent to them"
  ON partner_invitations
  FOR SELECT
  TO authenticated
  USING (
    invitation_code = ANY (
      SELECT invitation_code
      FROM partner_invitations
      WHERE recipient_id = auth.uid()
    )
  );

-- Create policies for compatibility_scores
CREATE POLICY "Users can view their compatibility scores"
  ON compatibility_scores
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (user1_id, user2_id)
  );

-- Function to calculate compatibility score
CREATE OR REPLACE FUNCTION calculate_compatibility_score(
  assessment1_id uuid,
  assessment2_id uuid
) RETURNS TABLE (
  overall_score numeric,
  category_scores jsonb,
  strengths jsonb,
  improvements jsonb
) LANGUAGE plpgsql AS $$
DECLARE
  assessment1 record;
  assessment2 record;
BEGIN
  -- Get assessments
  SELECT * INTO assessment1 FROM assessment_history WHERE id = assessment1_id;
  SELECT * INTO assessment2 FROM assessment_history WHERE id = assessment2_id;

  -- Calculate scores
  SELECT
    (
      SELECT avg(score)::numeric
      FROM jsonb_array_elements(assessment1.category_scores) AS a1(score),
           jsonb_array_elements(assessment2.category_scores) AS a2(score)
      WHERE a1.score->>'category_id' = a2.score->>'category_id'
    ) AS overall_score,
    jsonb_build_object(
      'categories',
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'category_id', a1.score->>'category_id',
            'score1', (a1.score->>'score')::numeric,
            'score2', (a2.score->>'score')::numeric,
            'compatibility', (
              100 - abs((a1.score->>'score')::numeric - (a2.score->>'score')::numeric)
            )
          )
        )
        FROM jsonb_array_elements(assessment1.category_scores) AS a1(score)
        JOIN jsonb_array_elements(assessment2.category_scores) AS a2(score)
          ON a1.score->>'category_id' = a2.score->>'category_id'
      )
    ) AS category_scores,
    jsonb_build_object(
      'areas',
      (
        SELECT jsonb_agg(category_id)
        FROM (
          SELECT a1.score->>'category_id' AS category_id,
                 (
                   100 - abs(
                     (a1.score->>'score')::numeric - (a2.score->>'score')::numeric
                   )
                 ) AS compatibility
          FROM jsonb_array_elements(assessment1.category_scores) AS a1(score)
          JOIN jsonb_array_elements(assessment2.category_scores) AS a2(score)
            ON a1.score->>'category_id' = a2.score->>'category_id'
          ORDER BY compatibility DESC
          LIMIT 3
        ) top_strengths
      )
    ) AS strengths,
    jsonb_build_object(
      'areas',
      (
        SELECT jsonb_agg(category_id)
        FROM (
          SELECT a1.score->>'category_id' AS category_id,
                 (
                   100 - abs(
                     (a1.score->>'score')::numeric - (a2.score->>'score')::numeric
                   )
                 ) AS compatibility
          FROM jsonb_array_elements(assessment1.category_scores) AS a1(score)
          JOIN jsonb_array_elements(assessment2.category_scores) AS a2(score)
            ON a1.score->>'category_id' = a2.score->>'category_id'
          ORDER BY compatibility ASC
          LIMIT 2
        ) improvement_areas
      )
    ) AS improvements
  INTO overall_score, category_scores, strengths, improvements;

  RETURN NEXT;
END;
$$;