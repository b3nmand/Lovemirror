/*
  # Update High-Value Man Questions and Rating Scale

  1. Changes
    - Clear existing high-value man questions
    - Insert new questions from CSV
    - Update min_value and max_value for rating scale
    - Maintain existing RLS policies

  2. Security
    - No changes to RLS policies needed
*/

-- First, clear existing high-value man questions
DELETE FROM unified_assessment_questions 
WHERE assessment_type = 'high-value';

-- Insert new questions for high-value man assessment
DO $$ 
DECLARE 
    cat_id uuid;
BEGIN
    -- Mental Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'high-value' LIMIT 1;
    
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

    -- Emotional Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'high-value' LIMIT 1;
    
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

    -- Physical Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Physical Traits' AND assessment_type = 'high-value' LIMIT 1;
    
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

    -- Financial Traits
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'high-value' LIMIT 1;
    
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

    -- Family & Cultural Compatibility
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'high-value' LIMIT 1;
    
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

    -- Conflict Resolution Style
    SELECT id INTO cat_id FROM unified_assessment_categories 
    WHERE name = 'Conflict Resolution Style' AND assessment_type = 'high-value' LIMIT 1;
    
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
END $$;