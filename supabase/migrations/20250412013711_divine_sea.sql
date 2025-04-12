/*
  # Fix Assessment Questions Display

  1. Changes
    - Add assessment_type column to unified_assessment_questions if missing
    - Update assessment_type for all questions to match their category's type
    - Ensure all questions have proper min_value and max_value settings
    - Create missing categories for each assessment type if needed

  2. Security
    - No changes to RLS policies needed
*/

-- Ensure assessment_type column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'unified_assessment_questions' 
    AND column_name = 'assessment_type'
  ) THEN
    ALTER TABLE unified_assessment_questions ADD COLUMN assessment_type text;
    
    -- Add check constraint
    ALTER TABLE unified_assessment_questions 
    ADD CONSTRAINT unified_assessment_questions_type_check 
    CHECK (assessment_type = ANY (ARRAY['high-value', 'bridal-price', 'wife-material']));
  END IF;
END $$;

-- Update assessment_type for all questions based on their category's type
UPDATE unified_assessment_questions
SET assessment_type = unified_assessment_categories.assessment_type
FROM unified_assessment_categories
WHERE unified_assessment_questions.category_id = unified_assessment_categories.id
AND (unified_assessment_questions.assessment_type IS NULL OR unified_assessment_questions.assessment_type = '');

-- Ensure all questions have proper min_value and max_value
UPDATE unified_assessment_questions
SET min_value = 1, max_value = 5
WHERE assessment_type = 'high-value' AND (min_value IS NULL OR max_value IS NULL);

UPDATE unified_assessment_questions
SET min_value = 1, max_value = 5
WHERE assessment_type = 'bridal-price' AND (min_value IS NULL OR max_value IS NULL);

UPDATE unified_assessment_questions
SET min_value = 1, max_value = 5
WHERE assessment_type = 'wife-material' AND (min_value IS NULL OR max_value IS NULL);

-- Create missing categories for each assessment type if needed
DO $$ 
DECLARE
  high_value_count integer;
  bridal_price_count integer;
  wife_material_count integer;
BEGIN
  -- Check if categories exist for each type
  SELECT COUNT(*) INTO high_value_count FROM unified_assessment_categories WHERE assessment_type = 'high-value';
  SELECT COUNT(*) INTO bridal_price_count FROM unified_assessment_categories WHERE assessment_type = 'bridal-price';
  SELECT COUNT(*) INTO wife_material_count FROM unified_assessment_categories WHERE assessment_type = 'wife-material';
  
  -- Create default categories if none exist
  IF high_value_count = 0 THEN
    INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
      ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'high-value'),
      ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'high-value'),
      ('Physical Traits', 16.67, 'Physical health and appearance', 'high-value'),
      ('Financial Traits', 16.67, 'Financial management and stability', 'high-value'),
      ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'high-value'),
      ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'high-value');
  END IF;
  
  IF bridal_price_count = 0 THEN
    INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
      ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'bridal-price'),
      ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'bridal-price'),
      ('Physical Traits', 16.67, 'Physical health and appearance', 'bridal-price'),
      ('Financial Traits', 16.67, 'Financial management and stability', 'bridal-price'),
      ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'bridal-price'),
      ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'bridal-price');
  END IF;
  
  IF wife_material_count = 0 THEN
    INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
      ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'wife-material'),
      ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'wife-material'),
      ('Physical Traits', 16.67, 'Physical health and appearance', 'wife-material'),
      ('Financial Traits', 16.67, 'Financial management and stability', 'wife-material'),
      ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'wife-material'),
      ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'wife-material');
  END IF;
END $$;