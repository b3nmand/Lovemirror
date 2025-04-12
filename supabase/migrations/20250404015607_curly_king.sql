/*
  # Add Assessment Questions

  1. Changes
    - Insert questions for each assessment type:
      - High-value man assessment
      - Bridal price assessment
      - Wife material assessment
    - Each question is linked to its respective category
    - Questions are properly tagged with assessment_type

  2. Security
    - No changes to RLS policies needed
*/

-- First, ensure we have the categories
INSERT INTO unified_assessment_categories (name, weight, description, assessment_type)
SELECT * FROM (
  VALUES 
    ('Mental Traits', 20, 'Thought patterns, mindset, and emotional regulation', 'high-value'),
    ('Financial Traits', 20, 'Income, investments, and financial management', 'high-value'),
    ('Leadership Qualities', 20, 'Decision making and influence', 'high-value'),
    ('Physical Fitness', 20, 'Health, appearance, and lifestyle', 'high-value'),
    ('Social Skills', 20, 'Communication and relationship building', 'high-value'),

    ('Traditional Values', 25, 'Cultural and family values', 'bridal-price'),
    ('Domestic Skills', 25, 'Household management and care', 'bridal-price'),
    ('Character Traits', 25, 'Personal qualities and behavior', 'bridal-price'),
    ('Education & Career', 25, 'Academic and professional achievements', 'bridal-price'),

    ('Emotional Intelligence', 20, 'Understanding and managing emotions', 'wife-material'),
    ('Communication Skills', 20, 'Expression and active listening', 'wife-material'),
    ('Life Management', 20, 'Organization and responsibility', 'wife-material'),
    ('Relationship Skills', 20, 'Building and maintaining connections', 'wife-material'),
    ('Personal Growth', 20, 'Self-improvement and adaptability', 'wife-material')
) AS v(name, weight, description, assessment_type)
WHERE NOT EXISTS (
  SELECT 1 FROM unified_assessment_categories 
  WHERE name = v.name AND assessment_type = v.assessment_type
);

-- Insert questions for each category
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- High-Value Man Questions
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
        (cat_id, 'How well do you handle stress and pressure?', 'high-value'),
        (cat_id, 'How often do you make decisions based on logic rather than emotion?', 'high-value'),
        (cat_id, 'How well do you maintain emotional stability during conflicts?', 'high-value');
    END IF;

    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
        (cat_id, 'How consistently do you save and invest your income?', 'high-value'),
        (cat_id, 'How well do you manage your financial responsibilities?', 'high-value'),
        (cat_id, 'How effectively do you plan for long-term financial goals?', 'high-value');
    END IF;

    -- Bridal Price Questions
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Traditional Values' AND assessment_type = 'bridal-price' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
        (cat_id, 'How well do you understand and respect traditional customs?', 'bridal-price'),
        (cat_id, 'How important is family hierarchy in your decisions?', 'bridal-price'),
        (cat_id, 'How well do you maintain cultural practices?', 'bridal-price');
    END IF;

    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Domestic Skills' AND assessment_type = 'bridal-price' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
        (cat_id, 'How well can you manage household responsibilities?', 'bridal-price'),
        (cat_id, 'How skilled are you in traditional cooking?', 'bridal-price'),
        (cat_id, 'How effectively do you maintain a clean and organized home?', 'bridal-price');
    END IF;

    -- Wife Material Questions
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Intelligence' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
        (cat_id, 'How well do you understand your own emotions?', 'wife-material'),
        (cat_id, 'How effectively do you handle emotional conflicts?', 'wife-material'),
        (cat_id, 'How well can you empathize with others'' feelings?', 'wife-material');
    END IF;

    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Communication Skills' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
        (cat_id, 'How effectively do you express your needs and feelings?', 'wife-material'),
        (cat_id, 'How well do you practice active listening?', 'wife-material'),
        (cat_id, 'How skilled are you at resolving conflicts through communication?', 'wife-material');
    END IF;
END $$;