/*
  # Add "I love my partner" Question to All Assessment Types

  1. New Questions
    - Add "I love my partner" question to:
      - High-value man assessment (Emotional Traits category)
      - Bridal price assessment (Emotional Traits category)
      - Wife material assessment (Emotional Traits category)

  2. Changes
    - Inserts new question into unified_assessment_questions table
    - Uses the same rating scale (1-5) as existing questions
    - Adds to the Emotional Traits category for each assessment type
*/

-- Add the question to high-value assessment
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- Get the Emotional Traits category ID for high-value assessment
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    -- Insert the question if the category exists
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I love my partner', 'high-value', 1, 5);
    END IF;
END $$;

-- Add the question to bridal-price assessment
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- Get the Emotional Traits category ID for bridal-price assessment
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    -- Insert the question if the category exists
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I love my partner', 'bridal-price', 1, 5);
    END IF;
END $$;

-- Add the question to wife-material assessment
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- Get the Emotional Traits category ID for wife-material assessment
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    -- Insert the question if the category exists
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I love my partner', 'wife-material', 1, 5);
    END IF;
END $$;