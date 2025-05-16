/*
  # Fix Assessment Questions and Categories

  1. Changes
    - Ensure all assessment types have the required categories
    - Add missing questions for each assessment type
    - Set proper min_value and max_value for all questions (1-5 scale)
    - Fix any missing assessment_type values in questions

  2. Security
    - No changes to RLS policies needed
*/

-- First, ensure all assessment types have the required categories
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

-- Insert questions for high-value man assessment
DO $$ 
DECLARE 
    cat_id uuid;
    question_count integer;
BEGIN
    -- Check if we have questions for high-value assessment
    SELECT COUNT(*) INTO question_count FROM unified_assessment_questions WHERE assessment_type = 'high-value';
    
    IF question_count < 10 THEN
        -- Clear existing questions to avoid duplicates
        DELETE FROM unified_assessment_questions WHERE assessment_type = 'high-value';
        
        -- Mental Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Mental Traits' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I take accountability when I''m wrong instead of deflecting blame', 'high-value', 1, 5),
        (cat_id, 'I respond calmly when my partner challenges me', 'high-value', 1, 5),
        (cat_id, 'I am open to personal growth and avoid outdated mindsets', 'high-value', 1, 5),
        (cat_id, 'I listen with the intent to understand, not just to respond', 'high-value', 1, 5),
        (cat_id, 'I manage my emotions constructively when triggered', 'high-value', 1, 5);
        
        -- Emotional Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Emotional Traits' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I make space for my partner''s emotions without trying to fix them', 'high-value', 1, 5),
        (cat_id, 'I regularly express appreciation, affection, and care non-sexually', 'high-value', 1, 5),
        (cat_id, 'I am emotionally consistent in showing care', 'high-value', 1, 5),
        (cat_id, 'I validate my partner''s feelings instead of dismissing them', 'high-value', 1, 5),
        (cat_id, 'I openly share my emotions instead of keeping them inside', 'high-value', 1, 5);
        
        -- Physical Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Physical Traits' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I maintain daily hygiene and grooming habits', 'high-value', 1, 5),
        (cat_id, 'I stay mindful of my health and appearance since the relationship began', 'high-value', 1, 5),
        (cat_id, 'I dress in a way that reflects pride in my appearance', 'high-value', 1, 5),
        (cat_id, 'I try to impress my partner physically consistently', 'high-value', 1, 5),
        (cat_id, 'I am attentive to my partner''s sexual needs as well as my own', 'high-value', 1, 5);
        
        -- Financial Traits
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Financial Traits' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I have a clear financial plan and savings habits', 'high-value', 1, 5),
        (cat_id, 'I am honest about my finances and avoid hiding spending/debt', 'high-value', 1, 5),
        (cat_id, 'I discuss financial burdens openly with my partner', 'high-value', 1, 5),
        (cat_id, 'I focus on building a future with long-term goals', 'high-value', 1, 5),
        (cat_id, 'I invest in personal growth instead of wasting money to impress others', 'high-value', 1, 5);
        
        -- Family & Cultural Compatibility
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I respect my partner''s culture and avoid imposing mine', 'high-value', 1, 5),
        (cat_id, 'I protect my partner from family disrespect', 'high-value', 1, 5),
        (cat_id, 'I shield my partner from family drama and pressure', 'high-value', 1, 5),
        (cat_id, 'I make my partner feel like we''re in a partnership, not just joining my tribe', 'high-value', 1, 5),
        (cat_id, 'I value her family''s involvement as much as my own', 'high-value', 1, 5);
        
        -- Conflict Resolution Style
        SELECT id INTO cat_id FROM unified_assessment_categories 
        WHERE name = 'Conflict Resolution Style' AND assessment_type = 'high-value' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I communicate openly instead of shutting down when angry', 'high-value', 1, 5),
        (cat_id, 'I avoid raising my voice, sarcasm, or threats during fights', 'high-value', 1, 5),
        (cat_id, 'I de-escalate conflicts instead of dominating them', 'high-value', 1, 5),
        (cat_id, 'I stay engaged in disagreements until resolution', 'high-value', 1, 5),
        (cat_id, 'I take accountability after conflicts instead of just moving on', 'high-value', 1, 5);
    END IF;
END $$;

-- Insert questions for bridal-price and wife-material assessments
DO $$ 
DECLARE 
    bridal_cat_id uuid;
    wife_cat_id uuid;
    bridal_question_count integer;
    wife_question_count integer;
BEGIN
    -- Check if we have questions for these assessment types
    SELECT COUNT(*) INTO bridal_question_count FROM unified_assessment_questions WHERE assessment_type = 'bridal-price';
    SELECT COUNT(*) INTO wife_question_count FROM unified_assessment_questions WHERE assessment_type = 'wife-material';
    
    IF bridal_question_count < 10 THEN
        -- Clear existing questions to avoid duplicates
        DELETE FROM unified_assessment_questions WHERE assessment_type = 'bridal-price';
        
        -- Mental Traits
        SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
        WHERE name = 'Mental Traits' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I communicate calmly about what''s wrong when I''m hurt', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I take responsibility for my role in relationship problems', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid saying hurtful things impulsively', 'bridal-price', 1, 5);
        
        -- Emotional Traits
        SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
        WHERE name = 'Emotional Traits' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I regularly show appreciation for my partner', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I focus on how loved I make my partner feel', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I acknowledge and respect my partner''s emotional needs', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I listen to my partner''s feelings without making it about myself', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I self-regulate emotionally and do not expect constant reassurance', 'bridal-price', 1, 5);
        
        -- Physical Traits
        SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
        WHERE name = 'Physical Traits' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I have maintained or improved my physical appearance since entering the relationship', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I dress in a way that makes my partner feel proud to be seen with me', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I prioritize fitness and health consistently', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I maintain effort in my appearance without using excuses', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I initiate physical intimacy without needing prompting', 'bridal-price', 1, 5);
        
        -- Financial Traits
        SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
        WHERE name = 'Financial Traits' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I have my own financial plan and contribute to building our future together', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I focus on what we can build together rather than what my partner can buy me', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I save money and avoid spending based on impulsive feelings', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I am transparent about purchases and debt with my partner', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid criticizing my partner''s financial habits while relying on their money', 'bridal-price', 1, 5);
        
        -- Family & Cultural Compatibility
        SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
        WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I respect my partner''s culture as much as my own', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I defend my partner if my family disrespects them', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I believe marriage means partnership, not bringing my partner into my family''s control', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid expecting my partner to conform completely to my traditions', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I respect my partner''s cultural values without dismissing them', 'bridal-price', 1, 5);
        
        -- Conflict Resolution Style
        SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
        WHERE name = 'Conflict Resolution Style' AND assessment_type = 'bridal-price' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I de-escalate conflicts calmly and constructively', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I start difficult conversations with curiosity instead of accusations', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I stay focused on the current issue during disagreements', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I apologize genuinely when I am wrong', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I prioritize being understood over being right', 'bridal-price', 1, 5);
    END IF;
    
    IF wife_question_count < 10 THEN
        -- Clear existing questions to avoid duplicates
        DELETE FROM unified_assessment_questions WHERE assessment_type = 'wife-material';
        
        -- Mental Traits
        SELECT id INTO wife_cat_id FROM unified_assessment_categories 
        WHERE name = 'Mental Traits' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'wife-material', 1, 5),
        (wife_cat_id, 'I communicate calmly about what''s wrong when I''m hurt', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'wife-material', 1, 5),
        (wife_cat_id, 'I take responsibility for my role in relationship problems', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid saying hurtful things impulsively', 'wife-material', 1, 5);
        
        -- Emotional Traits
        SELECT id INTO wife_cat_id FROM unified_assessment_categories 
        WHERE name = 'Emotional Traits' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I regularly show appreciation for my partner', 'wife-material', 1, 5),
        (wife_cat_id, 'I focus on how loved I make my partner feel', 'wife-material', 1, 5),
        (wife_cat_id, 'I acknowledge and respect my partner''s emotional needs', 'wife-material', 1, 5),
        (wife_cat_id, 'I listen to my partner''s feelings without making it about myself', 'wife-material', 1, 5),
        (wife_cat_id, 'I self-regulate emotionally and do not expect constant reassurance', 'wife-material', 1, 5);
        
        -- Physical Traits
        SELECT id INTO wife_cat_id FROM unified_assessment_categories 
        WHERE name = 'Physical Traits' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I have maintained or improved my physical appearance since entering the relationship', 'wife-material', 1, 5),
        (wife_cat_id, 'I dress in a way that makes my partner feel proud to be seen with me', 'wife-material', 1, 5),
        (wife_cat_id, 'I prioritize fitness and health consistently', 'wife-material', 1, 5),
        (wife_cat_id, 'I maintain effort in my appearance without using excuses', 'wife-material', 1, 5),
        (wife_cat_id, 'I initiate physical intimacy without needing prompting', 'wife-material', 1, 5);
        
        -- Financial Traits
        SELECT id INTO wife_cat_id FROM unified_assessment_categories 
        WHERE name = 'Financial Traits' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I have my own financial plan and contribute to building our future together', 'wife-material', 1, 5),
        (wife_cat_id, 'I focus on what we can build together rather than what my partner can buy me', 'wife-material', 1, 5),
        (wife_cat_id, 'I save money and avoid spending based on impulsive feelings', 'wife-material', 1, 5),
        (wife_cat_id, 'I am transparent about purchases and debt with my partner', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid criticizing my partner''s financial habits while relying on their money', 'wife-material', 1, 5);
        
        -- Family & Cultural Compatibility
        SELECT id INTO wife_cat_id FROM unified_assessment_categories 
        WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I respect my partner''s culture as much as my own', 'wife-material', 1, 5),
        (wife_cat_id, 'I defend my partner if my family disrespects them', 'wife-material', 1, 5),
        (wife_cat_id, 'I believe marriage means partnership, not bringing my partner into my family''s control', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid expecting my partner to conform completely to my traditions', 'wife-material', 1, 5),
        (wife_cat_id, 'I respect my partner''s cultural values without dismissing them', 'wife-material', 1, 5);
        
        -- Conflict Resolution Style
        SELECT id INTO wife_cat_id FROM unified_assessment_categories 
        WHERE name = 'Conflict Resolution Style' AND assessment_type = 'wife-material' LIMIT 1;
        
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I de-escalate conflicts calmly and constructively', 'wife-material', 1, 5),
        (wife_cat_id, 'I start difficult conversations with curiosity instead of accusations', 'wife-material', 1, 5),
        (wife_cat_id, 'I stay focused on the current issue during disagreements', 'wife-material', 1, 5),
        (wife_cat_id, 'I apologize genuinely when I am wrong', 'wife-material', 1, 5),
        (wife_cat_id, 'I prioritize being understood over being right', 'wife-material', 1, 5);
    END IF;
END $$;

-- Ensure all questions have proper min_value and max_value
UPDATE unified_assessment_questions
SET min_value = 1, max_value = 5
WHERE (min_value IS NULL OR max_value IS NULL OR min_value != 1 OR max_value != 5);

-- Fix any missing assessment_type values
UPDATE unified_assessment_questions
SET assessment_type = unified_assessment_categories.assessment_type
FROM unified_assessment_categories
WHERE unified_assessment_questions.category_id = unified_assessment_categories.id
AND (unified_assessment_questions.assessment_type IS NULL OR unified_assessment_questions.assessment_type = '');