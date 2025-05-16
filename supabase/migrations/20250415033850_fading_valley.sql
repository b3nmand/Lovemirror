/*
  # Fix Missing Categories for Assessment Types

  1. Changes
    - Ensure all assessment types have the same category structure
    - Create missing categories for each assessment type if needed
    - Set consistent weights and descriptions

  2. Security
    - No changes to RLS policies needed
*/

-- First, check if we have the necessary categories for each assessment type
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
    
    -- Create categories if they don't exist or count is less than expected
    IF high_value_count < 6 THEN
        -- Delete existing categories to avoid duplicates
        DELETE FROM unified_assessment_questions WHERE assessment_type = 'high-value';
        DELETE FROM unified_assessment_categories WHERE assessment_type = 'high-value';
        
        -- Create high-value man categories
        INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
            ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'high-value'),
            ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'high-value'),
            ('Physical Traits', 16.67, 'Physical health and appearance', 'high-value'),
            ('Financial Traits', 16.67, 'Financial management and stability', 'high-value'),
            ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'high-value'),
            ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'high-value');
    END IF;
    
    IF bridal_price_count < 6 THEN
        -- Delete existing categories to avoid duplicates
        DELETE FROM unified_assessment_questions WHERE assessment_type = 'bridal-price';
        DELETE FROM unified_assessment_categories WHERE assessment_type = 'bridal-price';
        
        -- Create bridal price categories
        INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
            ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'bridal-price'),
            ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'bridal-price'),
            ('Physical Traits', 16.67, 'Physical health and appearance', 'bridal-price'),
            ('Financial Traits', 16.67, 'Financial management and stability', 'bridal-price'),
            ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'bridal-price'),
            ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'bridal-price');
    END IF;
    
    IF wife_material_count < 6 THEN
        -- Delete existing categories to avoid duplicates
        DELETE FROM unified_assessment_questions WHERE assessment_type = 'wife-material';
        DELETE FROM unified_assessment_categories WHERE assessment_type = 'wife-material';
        
        -- Create wife material categories
        INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
            ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'wife-material'),
            ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'wife-material'),
            ('Physical Traits', 16.67, 'Physical health and appearance', 'wife-material'),
            ('Financial Traits', 16.67, 'Financial management and stability', 'wife-material'),
            ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'wife-material'),
            ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'wife-material');
    END IF;
END $$;

-- Insert basic questions for each category if none exist
DO $$ 
DECLARE 
    cat_id uuid;
    question_count integer;
BEGIN
    -- Check if we have questions for high-value assessment
    SELECT COUNT(*) INTO question_count FROM unified_assessment_questions WHERE assessment_type = 'high-value';
    
    IF question_count = 0 THEN
        -- Mental Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Mental Traits' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I take accountability when I''m wrong instead of deflecting blame', 'high-value', 1, 5),
        (cat_id, 'I respond calmly when my partner challenges me', 'high-value', 1, 5),
        (cat_id, 'I am open to personal growth and avoid outdated mindsets', 'high-value', 1, 5);
        
        -- Emotional Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Emotional Traits' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I make space for my partner''s emotions without trying to fix them', 'high-value', 1, 5),
        (cat_id, 'I regularly express appreciation, affection, and care non-sexually', 'high-value', 1, 5),
        (cat_id, 'I am emotionally consistent in showing care', 'high-value', 1, 5);
    END IF;
    
    -- Check if we have questions for bridal-price assessment
    SELECT COUNT(*) INTO question_count FROM unified_assessment_questions WHERE assessment_type = 'bridal-price';
    
    IF question_count = 0 THEN
        -- Mental Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Mental Traits' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'bridal-price', 1, 5),
        (cat_id, 'I communicate calmly about what''s wrong when I''m hurt', 'bridal-price', 1, 5),
        (cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'bridal-price', 1, 5);
        
        -- Emotional Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Emotional Traits' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I regularly show appreciation for my partner', 'bridal-price', 1, 5),
        (cat_id, 'I focus on how loved I make my partner feel', 'bridal-price', 1, 5),
        (cat_id, 'I acknowledge and respect my partner''s emotional needs', 'bridal-price', 1, 5);
    END IF;
    
    -- Check if we have questions for wife-material assessment
    SELECT COUNT(*) INTO question_count FROM unified_assessment_questions WHERE assessment_type = 'wife-material';
    
    IF question_count = 0 THEN
        -- Mental Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Mental Traits' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'wife-material', 1, 5),
        (cat_id, 'I communicate calmly about what''s wrong when I''m hurt', 'wife-material', 1, 5),
        (cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'wife-material', 1, 5);
        
        -- Emotional Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Emotional Traits' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I regularly show appreciation for my partner', 'wife-material', 1, 5),
        (cat_id, 'I focus on how loved I make my partner feel', 'wife-material', 1, 5),
        (cat_id, 'I acknowledge and respect my partner''s emotional needs', 'wife-material', 1, 5);
    END IF;
END $$;