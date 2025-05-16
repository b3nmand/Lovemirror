/*
  # Import Assessment Questions from CSV Files

  1. Changes
    - Clear existing questions in unified_assessment_questions
    - Import questions from male_questions.csv for high-value assessment type
    - Import questions from female_questions.csv for bridal-price and wife-material assessment types
    - Set proper category associations and rating scales

  2. Security
    - No changes to RLS policies needed
*/

-- First, clear existing questions to avoid duplicates
DELETE FROM unified_assessment_questions;

-- Make sure we have the necessary categories for each assessment type
DO $$ 
DECLARE
    categories_exist BOOLEAN;
BEGIN
    -- Check if categories exist for each assessment type
    SELECT EXISTS (
        SELECT 1 FROM unified_assessment_categories 
        WHERE assessment_type IN ('high-value', 'bridal-price', 'wife-material')
    ) INTO categories_exist;
    
    -- If no categories exist, create the basic structure
    IF NOT categories_exist THEN
        -- Create high-value man categories
        INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
            ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'high-value'),
            ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'high-value'),
            ('Physical Traits', 16.67, 'Physical health and appearance', 'high-value'),
            ('Financial Traits', 16.67, 'Financial management and stability', 'high-value'),
            ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'high-value'),
            ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'high-value');
            
        -- Create bridal price categories (same structure)
        INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
            ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'bridal-price'),
            ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'bridal-price'),
            ('Physical Traits', 16.67, 'Physical health and appearance', 'bridal-price'),
            ('Financial Traits', 16.67, 'Financial management and stability', 'bridal-price'),
            ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'bridal-price'),
            ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'bridal-price');
            
        -- Create wife material categories (same structure)
        INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
            ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'wife-material'),
            ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'wife-material'),
            ('Physical Traits', 16.67, 'Physical health and appearance', 'wife-material'),
            ('Financial Traits', 16.67, 'Financial management and stability', 'wife-material'),
            ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'wife-material'),
            ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'wife-material');
    END IF;
END $$;

-- Insert questions from male_questions.csv (high-value man assessment)
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- Mental Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I take accountability when I''m wrong instead of deflecting blame', 'high-value', 1, 5),
        (cat_id, 'I respond calmly when my partner challenges me', 'high-value', 1, 5),
        (cat_id, 'I am open to personal growth and avoid outdated mindsets', 'high-value', 1, 5),
        (cat_id, 'I listen with the intent to understand, not just to respond', 'high-value', 1, 5),
        (cat_id, 'I manage my emotions constructively when triggered', 'high-value', 1, 5),
        (cat_id, 'I reflect on how my behavior affects my partner', 'high-value', 1, 5),
        (cat_id, 'I am comfortable being vulnerable and see it as strength', 'high-value', 1, 5),
        (cat_id, 'I correct bad habits instead of expecting my partner to tolerate them', 'high-value', 1, 5),
        (cat_id, 'I handle constructive criticism without defensiveness', 'high-value', 1, 5),
        (cat_id, 'I avoid conflating being ''alpha'' with emotional unavailability', 'high-value', 1, 5);
    END IF;
    
    -- Emotional Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I make space for my partner''s emotions without trying to fix them', 'high-value', 1, 5),
        (cat_id, 'I regularly express appreciation, affection, and care non-sexually', 'high-value', 1, 5),
        (cat_id, 'I am emotionally consistent in showing care', 'high-value', 1, 5),
        (cat_id, 'I validate my partner''s feelings instead of dismissing them', 'high-value', 1, 5),
        (cat_id, 'I openly share my emotions instead of keeping them inside', 'high-value', 1, 5),
        (cat_id, 'I make my partner feel emotionally safe', 'high-value', 1, 5),
        (cat_id, 'I remain calm and engaged when my partner is upset', 'high-value', 1, 5),
        (cat_id, 'I value emotional intimacy as much as physical intimacy', 'high-value', 1, 5),
        (cat_id, 'I give reassurance without feeling controlled', 'high-value', 1, 5),
        (cat_id, 'My partner feels seen, heard, and emotionally secure with me', 'high-value', 1, 5);
    END IF;
    
    -- Physical Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Physical Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I maintain daily hygiene and grooming habits', 'high-value', 1, 5),
        (cat_id, 'I stay mindful of my health and appearance since the relationship began', 'high-value', 1, 5),
        (cat_id, 'I dress in a way that reflects pride in my appearance', 'high-value', 1, 5),
        (cat_id, 'I try to impress my partner physically consistently', 'high-value', 1, 5),
        (cat_id, 'I am attentive to my partner''s sexual needs as well as my own', 'high-value', 1, 5),
        (cat_id, 'I bring physical affection outside of sexual moments', 'high-value', 1, 5),
        (cat_id, 'I work consistently on fitness, energy, and presentation', 'high-value', 1, 5),
        (cat_id, 'I listen to my partner''s feedback about attraction', 'high-value', 1, 5),
        (cat_id, 'I show effort in date nights and special occasions', 'high-value', 1, 5),
        (cat_id, 'My partner would describe me as physically present, attractive, and invested', 'high-value', 1, 5);
    END IF;
    
    -- Financial Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I have a clear financial plan and savings habits', 'high-value', 1, 5),
        (cat_id, 'I am honest about my finances and avoid hiding spending/debt', 'high-value', 1, 5),
        (cat_id, 'I discuss financial burdens openly with my partner', 'high-value', 1, 5),
        (cat_id, 'I focus on building a future with long-term goals', 'high-value', 1, 5),
        (cat_id, 'I invest in personal growth instead of wasting money to impress others', 'high-value', 1, 5),
        (cat_id, 'I comfortably fulfill provider roles without resentment', 'high-value', 1, 5),
        (cat_id, 'I support my partner''s earning success without feeling threatened', 'high-value', 1, 5),
        (cat_id, 'I manage money with discipline, not impulsively', 'high-value', 1, 5),
        (cat_id, 'I am generous in healthy ways without manipulation', 'high-value', 1, 5),
        (cat_id, 'My partner feels financially secure with me', 'high-value', 1, 5);
    END IF;
    
    -- Family & Cultural Compatibility
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I respect my partner''s culture and avoid imposing mine', 'high-value', 1, 5),
        (cat_id, 'I protect my partner from family disrespect', 'high-value', 1, 5),
        (cat_id, 'I shield my partner from family drama and pressure', 'high-value', 1, 5),
        (cat_id, 'I make my partner feel like we''re in a partnership, not just joining my tribe', 'high-value', 1, 5),
        (cat_id, 'I value her family''s involvement as much as my own', 'high-value', 1, 5),
        (cat_id, 'I build healthy boundaries between my family and our relationship', 'high-value', 1, 5),
        (cat_id, 'I avoid expecting submission without offering security and respect', 'high-value', 1, 5),
        (cat_id, 'I discuss cultural clashes openly instead of dictating', 'high-value', 1, 5),
        (cat_id, 'I avoid using tradition or religion as excuses for control', 'high-value', 1, 5),
        (cat_id, 'My partner feels I integrate family values with emotional intelligence', 'high-value', 1, 5);
    END IF;
    
    -- Conflict Resolution Style
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Conflict Resolution Style' AND assessment_type = 'high-value' LIMIT 1;
    
    IF cat_id IS NOT NULL THEN
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (cat_id, 'I communicate openly instead of shutting down when angry', 'high-value', 1, 5),
        (cat_id, 'I avoid raising my voice, sarcasm, or threats during fights', 'high-value', 1, 5),
        (cat_id, 'I de-escalate conflicts instead of dominating them', 'high-value', 1, 5),
        (cat_id, 'I stay engaged in disagreements until resolution', 'high-value', 1, 5),
        (cat_id, 'I take accountability after conflicts instead of just moving on', 'high-value', 1, 5),
        (cat_id, 'I avoid using silence or ignoring emotional repair', 'high-value', 1, 5),
        (cat_id, 'I listen to my partner''s pain without deflecting blame', 'high-value', 1, 5),
        (cat_id, 'I avoid holding grudges or bringing up past fights', 'high-value', 1, 5),
        (cat_id, 'I seek clarity in arguments instead of rushing to end them', 'high-value', 1, 5),
        (cat_id, 'My partner feels safe, heard, and respected even during disagreements', 'high-value', 1, 5);
    END IF;
END $$;

-- Insert female questions for both bridal-price and wife-material assessment types
DO $$ 
DECLARE 
    bridal_cat_id uuid;
    wife_cat_id uuid;
BEGIN
    -- Mental Traits
    SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    SELECT id INTO wife_cat_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF bridal_cat_id IS NOT NULL AND wife_cat_id IS NOT NULL THEN
        -- Add to bridal-price
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I communicate calmly about what''s wrong when I''m hurt instead of expecting my partner to guess', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I take responsibility for my role in relationship problems', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid saying hurtful things impulsively', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I stay calm and rational when my emotions are triggered', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid using my emotions to gain control in conflict situations', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I self-reflect when my partner gives feedback instead of getting defensive', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I manage my mood independently without relying on my partner to fix it', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I am willing to unlearn negative patterns from past relationships', 'bridal-price', 1, 5);
        
        -- Add to wife-material (same questions)
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'wife-material', 1, 5),
        (wife_cat_id, 'I communicate calmly about what''s wrong when I''m hurt instead of expecting my partner to guess', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'wife-material', 1, 5),
        (wife_cat_id, 'I take responsibility for my role in relationship problems', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid saying hurtful things impulsively', 'wife-material', 1, 5),
        (wife_cat_id, 'I stay calm and rational when my emotions are triggered', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid using my emotions to gain control in conflict situations', 'wife-material', 1, 5),
        (wife_cat_id, 'I self-reflect when my partner gives feedback instead of getting defensive', 'wife-material', 1, 5),
        (wife_cat_id, 'I manage my mood independently without relying on my partner to fix it', 'wife-material', 1, 5),
        (wife_cat_id, 'I am willing to unlearn negative patterns from past relationships', 'wife-material', 1, 5);
    END IF;
    
    -- Emotional Traits
    SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    SELECT id INTO wife_cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF bridal_cat_id IS NOT NULL AND wife_cat_id IS NOT NULL THEN
        -- Add to bridal-price
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I regularly show appreciation for my partner, not just when things go wrong', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I focus on how loved I make my partner feel as much as how loved I feel', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I acknowledge and respect my partner''s emotional needs', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I listen to my partner''s feelings without making it about myself', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I self-regulate emotionally and do not expect constant reassurance', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I create emotional safety in my relationship', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I am emotionally open and available to talk', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I address issues directly without using tears or drama', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I offer peace and support when my partner is stressed', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I view emotional nurturing as a shared responsibility', 'bridal-price', 1, 5);
        
        -- Add to wife-material (same questions)
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I regularly show appreciation for my partner, not just when things go wrong', 'wife-material', 1, 5),
        (wife_cat_id, 'I focus on how loved I make my partner feel as much as how loved I feel', 'wife-material', 1, 5),
        (wife_cat_id, 'I acknowledge and respect my partner''s emotional needs', 'wife-material', 1, 5),
        (wife_cat_id, 'I listen to my partner''s feelings without making it about myself', 'wife-material', 1, 5),
        (wife_cat_id, 'I self-regulate emotionally and do not expect constant reassurance', 'wife-material', 1, 5),
        (wife_cat_id, 'I create emotional safety in my relationship', 'wife-material', 1, 5),
        (wife_cat_id, 'I am emotionally open and available to talk', 'wife-material', 1, 5),
        (wife_cat_id, 'I address issues directly without using tears or drama', 'wife-material', 1, 5),
        (wife_cat_id, 'I offer peace and support when my partner is stressed', 'wife-material', 1, 5),
        (wife_cat_id, 'I view emotional nurturing as a shared responsibility', 'wife-material', 1, 5);
    END IF;

    -- Physical Traits
    SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
    WHERE name = 'Physical Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    SELECT id INTO wife_cat_id FROM unified_assessment_categories 
    WHERE name = 'Physical Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF bridal_cat_id IS NOT NULL AND wife_cat_id IS NOT NULL THEN
        -- Add to bridal-price
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I have maintained or improved my physical appearance since entering the relationship', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I dress in a way that makes my partner feel proud to be seen with me', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I prioritize fitness and health consistently', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I maintain effort in my appearance without using excuses', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I initiate physical intimacy without needing prompting', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I show affection without using touch as a transaction or test', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I maintain grooming habits as I did when first dating', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid rejecting physical connection due to insecurity or ego', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I am sexually open, communicative, and attentive to my partner''s needs', 'bridal-price', 1, 5),
        (bridal_cat_id, 'My partner would describe my appearance as respectful, attractive, and feminine', 'bridal-price', 1, 5);
        
        -- Add to wife-material (same questions)
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I have maintained or improved my physical appearance since entering the relationship', 'wife-material', 1, 5),
        (wife_cat_id, 'I dress in a way that makes my partner feel proud to be seen with me', 'wife-material', 1, 5),
        (wife_cat_id, 'I prioritize fitness and health consistently', 'wife-material', 1, 5),
        (wife_cat_id, 'I maintain effort in my appearance without using excuses', 'wife-material', 1, 5),
        (wife_cat_id, 'I initiate physical intimacy without needing prompting', 'wife-material', 1, 5),
        (wife_cat_id, 'I show affection without using touch as a transaction or test', 'wife-material', 1, 5),
        (wife_cat_id, 'I maintain grooming habits as I did when first dating', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid rejecting physical connection due to insecurity or ego', 'wife-material', 1, 5),
        (wife_cat_id, 'I am sexually open, communicative, and attentive to my partner''s needs', 'wife-material', 1, 5),
        (wife_cat_id, 'My partner would describe my appearance as respectful, attractive, and feminine', 'wife-material', 1, 5);
    END IF;
    
    -- Financial Traits
    SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    SELECT id INTO wife_cat_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF bridal_cat_id IS NOT NULL AND wife_cat_id IS NOT NULL THEN
        -- Add to bridal-price
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I have my own financial plan and contribute to building our future together', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I focus on what we can build together rather than what my partner can buy me', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I save money and avoid spending based on impulsive feelings', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I am transparent about purchases and debt with my partner', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid criticizing my partner''s financial habits while relying on their money', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I view money as a shared tool, not a test of masculinity', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I live within my means and avoid chasing a lifestyle image', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I openly discuss financial goals and struggles with my partner', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I contribute effort, planning, and discipline toward our future together', 'bridal-price', 1, 5),
        (bridal_cat_id, 'My partner would describe me as financially responsible', 'bridal-price', 1, 5);
        
        -- Add to wife-material (same questions)
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I have my own financial plan and contribute to building our future together', 'wife-material', 1, 5),
        (wife_cat_id, 'I focus on what we can build together rather than what my partner can buy me', 'wife-material', 1, 5),
        (wife_cat_id, 'I save money and avoid spending based on impulsive feelings', 'wife-material', 1, 5),
        (wife_cat_id, 'I am transparent about purchases and debt with my partner', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid criticizing my partner''s financial habits while relying on their money', 'wife-material', 1, 5),
        (wife_cat_id, 'I view money as a shared tool, not a test of masculinity', 'wife-material', 1, 5),
        (wife_cat_id, 'I live within my means and avoid chasing a lifestyle image', 'wife-material', 1, 5),
        (wife_cat_id, 'I openly discuss financial goals and struggles with my partner', 'wife-material', 1, 5),
        (wife_cat_id, 'I contribute effort, planning, and discipline toward our future together', 'wife-material', 1, 5),
        (wife_cat_id, 'My partner would describe me as financially responsible', 'wife-material', 1, 5);
    END IF;
    
    -- Family & Cultural Compatibility
    SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
    WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'bridal-price' LIMIT 1;
    
    SELECT id INTO wife_cat_id FROM unified_assessment_categories 
    WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF bridal_cat_id IS NOT NULL AND wife_cat_id IS NOT NULL THEN
        -- Add to bridal-price
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I respect my partner''s culture as much as my own', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I defend my partner if my family disrespects them', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I believe marriage means partnership, not bringing my partner into my family''s control', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid expecting my partner to conform completely to my traditions', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I respect my partner''s cultural values without dismissing them', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I bring peace when family is involved in our relationship', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I adapt and compromise during cultural clashes', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I understand and value the role of family in my partner''s upbringing', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I prioritize loyalty to my partner over outside opinions', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I have discussed family roles and expectations openly with my partner', 'bridal-price', 1, 5);
        
        -- Add to wife-material (same questions)
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I respect my partner''s culture as much as my own', 'wife-material', 1, 5),
        (wife_cat_id, 'I defend my partner if my family disrespects them', 'wife-material', 1, 5),
        (wife_cat_id, 'I believe marriage means partnership, not bringing my partner into my family''s control', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid expecting my partner to conform completely to my traditions', 'wife-material', 1, 5),
        (wife_cat_id, 'I respect my partner''s cultural values without dismissing them', 'wife-material', 1, 5),
        (wife_cat_id, 'I bring peace when family is involved in our relationship', 'wife-material', 1, 5),
        (wife_cat_id, 'I adapt and compromise during cultural clashes', 'wife-material', 1, 5),
        (wife_cat_id, 'I understand and value the role of family in my partner''s upbringing', 'wife-material', 1, 5),
        (wife_cat_id, 'I prioritize loyalty to my partner over outside opinions', 'wife-material', 1, 5),
        (wife_cat_id, 'I have discussed family roles and expectations openly with my partner', 'wife-material', 1, 5);
    END IF;
    
    -- Conflict Resolution Style
    SELECT id INTO bridal_cat_id FROM unified_assessment_categories 
    WHERE name = 'Conflict Resolution Style' AND assessment_type = 'bridal-price' LIMIT 1;
    
    SELECT id INTO wife_cat_id FROM unified_assessment_categories 
    WHERE name = 'Conflict Resolution Style' AND assessment_type = 'wife-material' LIMIT 1;
    
    IF bridal_cat_id IS NOT NULL AND wife_cat_id IS NOT NULL THEN
        -- Add to bridal-price
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (bridal_cat_id, 'I de-escalate conflicts calmly and constructively', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I start difficult conversations with curiosity instead of accusations', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I stay focused on the current issue during disagreements', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I apologize genuinely when I am wrong', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I prioritize being understood over being right', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I avoid punishing my partner with withdrawal or attitude after fights', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I admit mistakes clearly and work to change behavior', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I handle hard conversations without crying, yelling, or blaming', 'bridal-price', 1, 5),
        (bridal_cat_id, 'I seek clarity by asking questions instead of making assumptions', 'bridal-price', 1, 5),
        (bridal_cat_id, 'My partner would say I fight to fix issues, not just to vent', 'bridal-price', 1, 5);
        
        -- Add to wife-material (same questions)
        INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type, min_value, max_value) VALUES
        (wife_cat_id, 'I de-escalate conflicts calmly and constructively', 'wife-material', 1, 5),
        (wife_cat_id, 'I start difficult conversations with curiosity instead of accusations', 'wife-material', 1, 5),
        (wife_cat_id, 'I stay focused on the current issue during disagreements', 'wife-material', 1, 5),
        (wife_cat_id, 'I apologize genuinely when I am wrong', 'wife-material', 1, 5),
        (wife_cat_id, 'I prioritize being understood over being right', 'wife-material', 1, 5),
        (wife_cat_id, 'I avoid punishing my partner with withdrawal or attitude after fights', 'wife-material', 1, 5),
        (wife_cat_id, 'I admit mistakes clearly and work to change behavior', 'wife-material', 1, 5),
        (wife_cat_id, 'I handle hard conversations without crying, yelling, or blaming', 'wife-material', 1, 5),
        (wife_cat_id, 'I seek clarity by asking questions instead of making assumptions', 'wife-material', 1, 5),
        (wife_cat_id, 'My partner would say I fight to fix issues, not just to vent', 'wife-material', 1, 5);
    END IF;
END $$;