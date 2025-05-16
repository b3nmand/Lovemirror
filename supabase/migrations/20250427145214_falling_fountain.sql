/*
  # Implement Subscription Check for Partner Assessment

  1. Changes
    - Add function to link partner assessments
    - Add function to check if a user has completed a partner assessment
    - Add function to get assessment results by invitation code

  2. Security
    - Maintain existing RLS policies
    - Add helper functions for partner assessment checks
*/

-- Function to link partner assessments
CREATE OR REPLACE FUNCTION link_partner_assessments(
  user_id uuid,
  partner_id uuid,
  user_assessment_id uuid,
  partner_assessment_id uuid
)
RETURNS uuid AS $$
DECLARE
  compatibility_id uuid;
BEGIN
  -- Calculate compatibility score
  WITH compatibility_data AS (
    SELECT * FROM calculate_compatibility_score(user_id, partner_id)
  )
  INSERT INTO compatibility_scores (
    user1_id,
    user2_id,
    user1_assessment_id,
    user2_assessment_id,
    overall_score,
    category_scores,
    strengths,
    improvements
  )
  SELECT
    user_id,
    partner_id,
    user_assessment_id,
    partner_assessment_id,
    overall_score,
    category_scores,
    strengths,
    improvements
  FROM compatibility_data
  RETURNING id INTO compatibility_id;
  
  RETURN compatibility_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a user has completed a partner assessment
CREATE OR REPLACE FUNCTION has_completed_partner_assessment(
  user_id uuid,
  partner_id uuid
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM partner_invitations
    WHERE (sender_id = user_id AND recipient_id = partner_id)
    OR (sender_id = partner_id AND recipient_id = user_id)
    AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get assessment results by invitation code
CREATE OR REPLACE FUNCTION get_assessment_by_invitation_code(
  invitation_code uuid
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  assessment_type text,
  overall_score numeric,
  category_scores jsonb,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.user_id,
    a.assessment_type,
    a.overall_score,
    a.category_scores,
    a.created_at
  FROM assessment_history a
  JOIN partner_invitations p ON a.user_id = p.recipient_id
  WHERE p.invitation_code = invitation_code;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update partner invitation status when assessment is completed
CREATE OR REPLACE FUNCTION update_partner_invitation_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update partner invitation status to completed
  UPDATE partner_invitations
  SET status = 'completed'
  WHERE recipient_id = NEW.user_id
  AND status = 'accepted';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_partner_invitation_status_trigger'
  ) THEN
    CREATE TRIGGER update_partner_invitation_status_trigger
      AFTER INSERT ON assessment_history
      FOR EACH ROW
      EXECUTE FUNCTION update_partner_invitation_status();
  END IF;
END $$;