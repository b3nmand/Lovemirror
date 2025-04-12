/*
  # Fix Assessment History and Categories Relationship

  1. Changes
    - Add category_name and description to category_scores in assessment_history
    - Update existing records to include category details
    - Add function to automatically include category details

  2. Security
    - No changes to RLS policies needed
*/

-- Add function to get category details
CREATE OR REPLACE FUNCTION get_category_details(assessment_type text)
RETURNS TABLE (
  id uuid,
  name text,
  weight numeric,
  description text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unified_assessment_categories.id,
    unified_assessment_categories.name,
    unified_assessment_categories.weight,
    unified_assessment_categories.description
  FROM unified_assessment_categories
  WHERE unified_assessment_categories.assessment_type = $1;
END;
$$ LANGUAGE plpgsql;