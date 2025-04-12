/*
  # Update Bridal Price and Wife Material Assessment Questions

  1. Changes
    - Clear existing questions for bridal price and wife material assessments
    - Insert new questions from CSV data
    - Maintain categories and weights
    - Update question text to be more focused on self-assessment

  2. Security
    - No changes to RLS policies needed
*/

-- First, clear existing questions for these assessment types
DELETE FROM unified_assessment_questions 
WHERE assessment_type IN ('bridal-price', 'wife-material');

-- Insert new questions for bridal price assessment
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- Mental Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'bridal-price'),
    (cat_id, 'I communicate calmly about what''s wrong when I''m hurt instead of expecting my partner to guess', 'bridal-price'),
    (cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'bridal-price'),
    (cat_id, 'I take responsibility for my role in relationship problems', 'bridal-price'),
    (cat_id, 'I avoid saying hurtful things impulsively', 'bridal-price'),
    (cat_id, 'I stay calm and rational when my emotions are triggered', 'bridal-price'),
    (cat_id, 'I avoid using my emotions to gain control in conflict situations', 'bridal-price'),
    (cat_id, 'I self-reflect when my partner gives feedback instead of getting defensive', 'bridal-price'),
    (cat_id, 'I manage my mood independently without relying on my partner to fix it', 'bridal-price'),
    (cat_id, 'I am willing to unlearn negative patterns from past relationships', 'bridal-price');

    -- Emotional Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I regularly show appreciation for my partner, not just when things go wrong', 'bridal-price'),
    (cat_id, 'I focus on how loved I make my partner feel as much as how loved I feel', 'bridal-price'),
    (cat_id, 'I acknowledge and respect my partner''s emotional needs', 'bridal-price'),
    (cat_id, 'I listen to my partner''s feelings without making it about myself', 'bridal-price'),
    (cat_id, 'I self-regulate emotionally and do not expect constant reassurance', 'bridal-price'),
    (cat_id, 'I create emotional safety in my relationship', 'bridal-price'),
    (cat_id, 'I am emotionally open and available to talk', 'bridal-price'),
    (cat_id, 'I address issues directly without using tears or drama', 'bridal-price'),
    (cat_id, 'I offer peace and support when my partner is stressed', 'bridal-price'),
    (cat_id, 'I view emotional nurturing as a shared responsibility', 'bridal-price');

    -- Physical Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Physical Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I have maintained or improved my physical appearance since entering the relationship', 'bridal-price'),
    (cat_id, 'I dress in a way that makes my partner feel proud to be seen with me', 'bridal-price'),
    (cat_id, 'I prioritize fitness and health consistently', 'bridal-price'),
    (cat_id, 'I maintain effort in my appearance without using excuses', 'bridal-price'),
    (cat_id, 'I initiate physical intimacy without needing prompting', 'bridal-price'),
    (cat_id, 'I show affection without using touch as a transaction or test', 'bridal-price'),
    (cat_id, 'I maintain grooming habits as I did when first dating', 'bridal-price'),
    (cat_id, 'I avoid rejecting physical connection due to insecurity or ego', 'bridal-price'),
    (cat_id, 'I am sexually open, communicative, and attentive to my partner''s needs', 'bridal-price'),
    (cat_id, 'My partner would describe my appearance as respectful, attractive, and feminine', 'bridal-price');

    -- Financial Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'bridal-price' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I have my own financial plan and contribute to building our future together', 'bridal-price'),
    (cat_id, 'I focus on what we can build together rather than what my partner can buy me', 'bridal-price'),
    (cat_id, 'I save money and avoid spending based on impulsive feelings', 'bridal-price'),
    (cat_id, 'I am transparent about purchases and debt with my partner', 'bridal-price'),
    (cat_id, 'I avoid criticizing my partner''s financial habits while relying on their money', 'bridal-price'),
    (cat_id, 'I view money as a shared tool, not a test of masculinity', 'bridal-price'),
    (cat_id, 'I live within my means and avoid chasing a lifestyle image', 'bridal-price'),
    (cat_id, 'I openly discuss financial goals and struggles with my partner', 'bridal-price'),
    (cat_id, 'I contribute effort, planning, and discipline toward our future together', 'bridal-price'),
    (cat_id, 'My partner would describe me as financially responsible', 'bridal-price');

    -- Family & Cultural Compatibility
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'bridal-price' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I respect my partner''s culture as much as my own', 'bridal-price'),
    (cat_id, 'I defend my partner if my family disrespects them', 'bridal-price'),
    (cat_id, 'I believe marriage means partnership, not bringing my partner into my family''s control', 'bridal-price'),
    (cat_id, 'I avoid expecting my partner to conform completely to my traditions', 'bridal-price'),
    (cat_id, 'I respect my partner''s cultural values without dismissing them', 'bridal-price'),
    (cat_id, 'I bring peace when family is involved in our relationship', 'bridal-price'),
    (cat_id, 'I adapt and compromise during cultural clashes', 'bridal-price'),
    (cat_id, 'I understand and value the role of family in my partner''s upbringing', 'bridal-price'),
    (cat_id, 'I prioritize loyalty to my partner over outside opinions', 'bridal-price'),
    (cat_id, 'I have discussed family roles and expectations openly with my partner', 'bridal-price');

    -- Conflict Resolution Style
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Conflict Resolution Style' AND assessment_type = 'bridal-price' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I de-escalate conflicts calmly and constructively', 'bridal-price'),
    (cat_id, 'I start difficult conversations with curiosity instead of accusations', 'bridal-price'),
    (cat_id, 'I stay focused on the current issue during disagreements', 'bridal-price'),
    (cat_id, 'I apologize genuinely when I am wrong', 'bridal-price'),
    (cat_id, 'I prioritize being understood over being right', 'bridal-price'),
    (cat_id, 'I avoid punishing my partner with withdrawal or attitude after fights', 'bridal-price'),
    (cat_id, 'I admit mistakes clearly and work to change behavior', 'bridal-price'),
    (cat_id, 'I handle hard conversations without crying, yelling, or blaming', 'bridal-price'),
    (cat_id, 'I seek clarity by asking questions instead of making assumptions', 'bridal-price'),
    (cat_id, 'My partner would say I fight to fix issues, not just to vent', 'bridal-price');
END $$;

-- Insert new questions for wife material assessment
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- Mental Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I remain calm and avoid escalating small disagreements into emotional reactions', 'wife-material'),
    (cat_id, 'I communicate calmly about what''s wrong when I''m hurt instead of expecting my partner to guess', 'wife-material'),
    (cat_id, 'I avoid using emotional withdrawal or silence as a punishment', 'wife-material'),
    (cat_id, 'I take responsibility for my role in relationship problems', 'wife-material'),
    (cat_id, 'I avoid saying hurtful things impulsively', 'wife-material'),
    (cat_id, 'I stay calm and rational when my emotions are triggered', 'wife-material'),
    (cat_id, 'I avoid using my emotions to gain control in conflict situations', 'wife-material'),
    (cat_id, 'I self-reflect when my partner gives feedback instead of getting defensive', 'wife-material'),
    (cat_id, 'I manage my mood independently without relying on my partner to fix it', 'wife-material'),
    (cat_id, 'I am willing to unlearn negative patterns from past relationships', 'wife-material');

    -- Emotional Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I regularly show appreciation for my partner, not just when things go wrong', 'wife-material'),
    (cat_id, 'I focus on how loved I make my partner feel as much as how loved I feel', 'wife-material'),
    (cat_id, 'I acknowledge and respect my partner''s emotional needs', 'wife-material'),
    (cat_id, 'I listen to my partner''s feelings without making it about myself', 'wife-material'),
    (cat_id, 'I self-regulate emotionally and do not expect constant reassurance', 'wife-material'),
    (cat_id, 'I create emotional safety in my relationship', 'wife-material'),
    (cat_id, 'I am emotionally open and available to talk', 'wife-material'),
    (cat_id, 'I address issues directly without using tears or drama', 'wife-material'),
    (cat_id, 'I offer peace and support when my partner is stressed', 'wife-material'),
    (cat_id, 'I view emotional nurturing as a shared responsibility', 'wife-material');

    -- Physical Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Physical Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I have maintained or improved my physical appearance since entering the relationship', 'wife-material'),
    (cat_id, 'I dress in a way that makes my partner feel proud to be seen with me', 'wife-material'),
    (cat_id, 'I prioritize fitness and health consistently', 'wife-material'),
    (cat_id, 'I maintain effort in my appearance without using excuses', 'wife-material'),
    (cat_id, 'I initiate physical intimacy without needing prompting', 'wife-material'),
    (cat_id, 'I show affection without using touch as a transaction or test', 'wife-material'),
    (cat_id, 'I maintain grooming habits as I did when first dating', 'wife-material'),
    (cat_id, 'I avoid rejecting physical connection due to insecurity or ego', 'wife-material'),
    (cat_id, 'I am sexually open, communicative, and attentive to my partner''s needs', 'wife-material'),
    (cat_id, 'My partner would describe my appearance as respectful, attractive, and feminine', 'wife-material');

    -- Financial Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'wife-material' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I have my own financial plan and contribute to building our future together', 'wife-material'),
    (cat_id, 'I focus on what we can build together rather than what my partner can buy me', 'wife-material'),
    (cat_id, 'I save money and avoid spending based on impulsive feelings', 'wife-material'),
    (cat_id, 'I am transparent about purchases and debt with my partner', 'wife-material'),
    (cat_id, 'I avoid criticizing my partner''s financial habits while relying on their money', 'wife-material'),
    (cat_id, 'I view money as a shared tool, not a test of masculinity', 'wife-material'),
    (cat_id, 'I live within my means and avoid chasing a lifestyle image', 'wife-material'),
    (cat_id, 'I openly discuss financial goals and struggles with my partner', 'wife-material'),
    (cat_id, 'I contribute effort, planning, and discipline toward our future together', 'wife-material'),
    (cat_id, 'My partner would describe me as financially responsible', 'wife-material');

    -- Family & Cultural Compatibility
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'wife-material' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I respect my partner''s culture as much as my own', 'wife-material'),
    (cat_id, 'I defend my partner if my family disrespects them', 'wife-material'),
    (cat_id, 'I believe marriage means partnership, not bringing my partner into my family''s control', 'wife-material'),
    (cat_id, 'I avoid expecting my partner to conform completely to my traditions', 'wife-material'),
    (cat_id, 'I respect my partner''s cultural values without dismissing them', 'wife-material'),
    (cat_id, 'I bring peace when family is involved in our relationship', 'wife-material'),
    (cat_id, 'I adapt and compromise during cultural clashes', 'wife-material'),
    (cat_id, 'I understand and value the role of family in my partner''s upbringing', 'wife-material'),
    (cat_id, 'I prioritize loyalty to my partner over outside opinions', 'wife-material'),
    (cat_id, 'I have discussed family roles and expectations openly with my partner', 'wife-material');

    -- Conflict Resolution Style
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Conflict Resolution Style' AND assessment_type = 'wife-material' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cat_id, 'I de-escalate conflicts calmly and constructively', 'wife-material'),
    (cat_id, 'I start difficult conversations with curiosity instead of accusations', 'wife-material'),
    (cat_id, 'I stay focused on the current issue during disagreements', 'wife-material'),
    (cat_id, 'I apologize genuinely when I am wrong', 'wife-material'),
    (cat_id, 'I prioritize being understood over being right', 'wife-material'),
    (cat_id, 'I avoid punishing my partner with withdrawal or attitude after fights', 'wife-material'),
    (cat_id, 'I admit mistakes clearly and work to change behavior', 'wife-material'),
    (cat_id, 'I handle hard conversations without crying, yelling, or blaming', 'wife-material'),
    (cat_id, 'I seek clarity by asking questions instead of making assumptions', 'wife-material'),
    (cat_id, 'My partner would say I fight to fix issues, not just to vent', 'wife-material');
END $$;