/*
  # Fix Compatibility Score Functions

  1. Changes
    - Drop existing functions before recreating them
    - Fix parameter naming conflicts in compatibility score functions
    - Add trigger for partner invitation status updates
    - Maintain same functionality as previous migration

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing functions and triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_partner_invitation_status_trigger ON assessment_history;
DROP FUNCTION IF EXISTS update_partner_invitation_status();
DROP FUNCTION IF EXISTS create_or_update_compatibility_score(uuid, uuid);
DROP FUNCTION IF EXISTS calculate_compatibility_score(uuid, uuid);

-- Function to calculate compatibility score between two users
CREATE OR REPLACE FUNCTION calculate_compatibility_score(
  in_user1_id uuid,
  in_user2_id uuid
)
RETURNS TABLE (
  overall_score numeric,
  category_scores jsonb,
  strengths jsonb,
  improvements jsonb
) AS $$
DECLARE
  user1_assessment_id uuid;
  user2_assessment_id uuid;
BEGIN
  -- Get latest assessment IDs for both users
  SELECT id INTO user1_assessment_id
  FROM assessment_history
  WHERE user_id = in_user1_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  SELECT id INTO user2_assessment_id
  FROM assessment_history
  WHERE user_id = in_user2_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Return if either assessment is missing
  IF user1_assessment_id IS NULL OR user2_assessment_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate compatibility scores
  RETURN QUERY
  WITH user1_scores AS (
    -- Get user1's category scores
    SELECT 
      cs.category_id,
      uc.name AS category_name,
      cs.score
    FROM jsonb_to_recordset(
      (SELECT category_scores FROM assessment_history WHERE id = user1_assessment_id)
    ) AS cs(category_id uuid, score numeric)
    JOIN unified_assessment_categories uc ON cs.category_id = uc.id
  ),
  user2_scores AS (
    -- Get user2's category scores
    SELECT 
      cs.category_id,
      uc.name AS category_name,
      cs.score
    FROM jsonb_to_recordset(
      (SELECT category_scores FROM assessment_history WHERE id = user2_assessment_id)
    ) AS cs(category_id uuid, score numeric)
    JOIN unified_assessment_categories uc ON cs.category_id = uc.id
  ),
  compatibility_scores AS (
    -- Calculate compatibility for each category
    SELECT 
      u1.category_id,
      u1.category_name,
      u1.score AS user1_score,
      u2.score AS user2_score,
      (100 - ABS(u1.score - u2.score)) AS compatibility
    FROM user1_scores u1
    JOIN user2_scores u2 ON u1.category_id = u2.category_id
  ),
  category_results AS (
    -- Format category results
    SELECT 
      jsonb_build_object(
        'categories', jsonb_agg(
          jsonb_build_object(
            'category_id', category_id,
            'category_name', category_name,
            'score1', user1_score,
            'score2', user2_score,
            'compatibility', compatibility
          )
        )
      ) AS category_scores,
      AVG(compatibility) AS overall_score
    FROM compatibility_scores
  ),
  strength_areas AS (
    -- Identify strength areas (highest compatibility)
    SELECT 
      jsonb_build_object(
        'areas', jsonb_agg(category_id)
      ) AS strengths
    FROM (
      SELECT category_id
      FROM compatibility_scores
      ORDER BY compatibility DESC
      LIMIT 3
    ) top_strengths
  ),
  improvement_areas AS (
    -- Identify improvement areas (lowest compatibility)
    SELECT 
      jsonb_build_object(
        'areas', jsonb_agg(category_id)
      ) AS improvements
    FROM (
      SELECT category_id
      FROM compatibility_scores
      ORDER BY compatibility ASC
      LIMIT 2
    ) bottom_strengths
  )
  SELECT 
    cr.overall_score,
    cr.category_scores,
    sa.strengths,
    ia.improvements
  FROM category_results cr
  CROSS JOIN strength_areas sa
  CROSS JOIN improvement_areas ia;
END;
$$ LANGUAGE plpgsql;

-- Function to create or update compatibility score
CREATE OR REPLACE FUNCTION create_or_update_compatibility_score(
  in_user1_id uuid,
  in_user2_id uuid
)
RETURNS uuid AS $$
DECLARE
  compatibility_id uuid;
  user1_assessment_id uuid;
  user2_assessment_id uuid;
  compatibility_data record;
BEGIN
  -- Get latest assessment IDs for both users
  SELECT id INTO user1_assessment_id
  FROM assessment_history
  WHERE user_id = in_user1_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  SELECT id INTO user2_assessment_id
  FROM assessment_history
  WHERE user_id = in_user2_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Return if either assessment is missing
  IF user1_assessment_id IS NULL OR user2_assessment_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Calculate compatibility score
  SELECT 
    overall_score, 
    category_scores, 
    strengths, 
    improvements 
  INTO compatibility_data
  FROM calculate_compatibility_score(in_user1_id, in_user2_id);
  
  -- Check if compatibility score already exists
  SELECT id INTO compatibility_id
  FROM compatibility_scores
  WHERE (user1_id = in_user1_id AND user2_id = in_user2_id)
     OR (user1_id = in_user2_id AND user2_id = in_user1_id);
  
  -- Insert or update compatibility score
  IF compatibility_id IS NULL THEN
    -- Insert new compatibility score
    INSERT INTO compatibility_scores (
      user1_id,
      user2_id,
      user1_assessment_id,
      user2_assessment_id,
      overall_score,
      category_scores,
      strengths,
      improvements
    ) VALUES (
      in_user1_id,
      in_user2_id,
      user1_assessment_id,
      user2_assessment_id,
      compatibility_data.overall_score,
      compatibility_data.category_scores,
      compatibility_data.strengths,
      compatibility_data.improvements
    )
    RETURNING id INTO compatibility_id;
  ELSE
    -- Update existing compatibility score
    UPDATE compatibility_scores
    SET 
      user1_assessment_id = user1_assessment_id,
      user2_assessment_id = user2_assessment_id,
      overall_score = compatibility_data.overall_score,
      category_scores = compatibility_data.category_scores,
      strengths = compatibility_data.strengths,
      improvements = compatibility_data.improvements,
      created_at = now()
    WHERE id = compatibility_id;
  END IF;
  
  RETURN compatibility_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update partner invitation status when assessment is completed
CREATE OR REPLACE FUNCTION update_partner_invitation_status()
RETURNS TRIGGER AS $$
DECLARE
  invitation_record record;
  partner_id uuid;
  compatibility_id uuid;
BEGIN
  -- Find partner invitation where this user is the recipient
  SELECT * INTO invitation_record
  FROM partner_invitations
  WHERE recipient_id = NEW.user_id
  AND status = 'accepted'
  LIMIT 1;
  
  -- If no invitation found, return
  IF invitation_record IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Update invitation status to completed
  UPDATE partner_invitations
  SET status = 'completed'
  WHERE id = invitation_record.id;
  
  -- Get partner ID
  partner_id := invitation_record.sender_id;
  
  -- Calculate compatibility score
  compatibility_id := create_or_update_compatibility_score(NEW.user_id, partner_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for partner invitation status updates
CREATE TRIGGER update_partner_invitation_status_trigger
  AFTER INSERT ON assessment_history
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_invitation_status();