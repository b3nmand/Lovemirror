/*
  # Update Assessment Categories and Questions

  1. Changes
    - Clear existing categories and questions
    - Insert new categories with weights
    - Insert questions from CSV data
    - Maintain RLS policies

  2. Categories from CSV:
    - Mental Traits
    - Emotional Traits
    - Physical Traits
    - Financial Traits
    - Family & Cultural Compatibility
    - Conflict Resolution Style
*/

-- First, clear existing data
DELETE FROM assessment_responses;
DELETE FROM unified_assessment_questions;
DELETE FROM unified_assessment_categories;

-- Insert new categories with weights
INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
  ('Mental Traits', 16.67, 'Thought patterns, mindset, and emotional regulation', 'high-value'),
  ('Emotional Traits', 16.67, 'Understanding and expressing emotions', 'high-value'),
  ('Physical Traits', 16.67, 'Physical health and appearance', 'high-value'),
  ('Financial Traits', 16.67, 'Financial management and stability', 'high-value'),
  ('Family & Cultural Compatibility', 16.67, 'Cultural values and family dynamics', 'high-value'),
  ('Conflict Resolution Style', 16.67, 'Handling disagreements and conflicts', 'high-value');

-- Insert Mental Traits questions
DO $$ 
DECLARE 
    mental_id uuid;
BEGIN
    SELECT id INTO mental_id FROM unified_assessment_categories 
    WHERE name = 'Mental Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (mental_id, 'Do you tend to shut down emotionally during disagreements?', 'high-value'),
    (mental_id, 'How often do you overthink your partner''s actions or words?', 'high-value'),
    (mental_id, 'When you''re upset, do you communicate clearly or withdraw?', 'high-value'),
    (mental_id, 'How often do you try to understand your partner''s perspective before responding?', 'high-value'),
    (mental_id, 'Do you believe compromise is a sign of weakness or strength?', 'high-value'),
    (mental_id, 'Can you handle criticism from your partner without becoming defensive?', 'high-value'),
    (mental_id, 'How often do you reflect on your own contribution to relationship problems?', 'high-value'),
    (mental_id, 'Do you react impulsively when you feel disrespected?', 'high-value'),
    (mental_id, 'Can you stay calm when your partner triggers you emotionally?', 'high-value'),
    (mental_id, 'Do you take time to self-assess your mental health and its impact on your relationship?', 'high-value');
END $$;

-- Insert Emotional Traits questions
DO $$ 
DECLARE 
    emotional_id uuid;
BEGIN
    SELECT id INTO emotional_id FROM unified_assessment_categories 
    WHERE name = 'Emotional Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (emotional_id, 'Are you comfortable expressing your feelings directly to your partner?', 'high-value'),
    (emotional_id, 'Do you feel safe being emotionally vulnerable in your relationship?', 'high-value'),
    (emotional_id, 'When your partner shares something emotional, do you usually offer support or solutions?', 'high-value'),
    (emotional_id, 'How often do you validate your partner''s emotions, even if you disagree?', 'high-value'),
    (emotional_id, 'Do you find it difficult to trust someone with your deeper emotions?', 'high-value'),
    (emotional_id, 'When your partner cries or is upset, how do you typically respond?', 'high-value'),
    (emotional_id, 'Do you require external validation to feel emotionally secure?', 'high-value'),
    (emotional_id, 'How do you respond to emotional distance from your partner?', 'high-value'),
    (emotional_id, 'Can you recognize emotional manipulation in a relationship?', 'high-value'),
    (emotional_id, 'Are you emotionally available or emotionally avoidant in romantic relationships?', 'high-value');
END $$;

-- Insert Physical Traits questions
DO $$ 
DECLARE 
    physical_id uuid;
BEGIN
    SELECT id INTO physical_id FROM unified_assessment_categories 
    WHERE name = 'Physical Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (physical_id, 'Have you gained or lost a significant amount of weight in your relationship, and how has that affected your connection?', 'high-value'),
    (physical_id, 'Do you maintain your personal hygiene and grooming daily, even during routine days?', 'high-value'),
    (physical_id, 'How often do you initiate non-sexual physical affection (hugs, touch)?', 'high-value'),
    (physical_id, 'Do you avoid physical closeness because of body insecurities?', 'high-value'),
    (physical_id, 'When was the last time you prioritized your physical health for your own well-being?', 'high-value'),
    (physical_id, 'How does your current lifestyle (diet, exercise, rest) support your romantic relationship?', 'high-value'),
    (physical_id, 'Do you use physical intimacy as a reward or punishment in the relationship?', 'high-value'),
    (physical_id, 'Has your partner ever expressed concern about your lack of effort in physical presentation?', 'high-value'),
    (physical_id, 'Are you sexually responsive to your partner''s needs and open to communication around it?', 'high-value'),
    (physical_id, 'Do you take responsibility for your physical presence (appearance, health, affection) in your relationship?', 'high-value');
END $$;

-- Insert Financial Traits questions
DO $$ 
DECLARE 
    financial_id uuid;
BEGIN
    SELECT id INTO financial_id FROM unified_assessment_categories 
    WHERE name = 'Financial Traits' AND assessment_type = 'high-value' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (financial_id, 'Do you have a monthly budget or do you spend based on how you feel?', 'high-value'),
    (financial_id, 'Are you open with your partner about your financial struggles or debts?', 'high-value'),
    (financial_id, 'How often do you save money versus spend impulsively?', 'high-value'),
    (financial_id, 'Would you feel uncomfortable if your partner earned more than you?', 'high-value'),
    (financial_id, 'Do you believe financial roles in a relationship should be traditional or equal?', 'high-value'),
    (financial_id, 'How do you manage financial pressure—by planning or avoiding?', 'high-value'),
    (financial_id, 'Do you borrow money without telling your partner?', 'high-value'),
    (financial_id, 'Have you ever used money as a tool for control in a relationship?', 'high-value'),
    (financial_id, 'Can you commit to long-term financial planning (e.g., investments, home ownership)?', 'high-value'),
    (financial_id, 'Do you feel financially secure and mature enough to build a future with someone?', 'high-value');
END $$;

-- Insert Family & Cultural Compatibility questions
DO $$ 
DECLARE 
    cultural_id uuid;
BEGIN
    SELECT id INTO cultural_id FROM unified_assessment_categories 
    WHERE name = 'Family & Cultural Compatibility' AND assessment_type = 'high-value' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (cultural_id, 'Do you and your partner share the same values when it comes to marriage roles?', 'high-value'),
    (cultural_id, 'How involved do you expect extended family to be in your relationship?', 'high-value'),
    (cultural_id, 'Do you and your partner practice the same religion or spiritual beliefs?', 'high-value'),
    (cultural_id, 'How aligned are you with your partner on cultural practices (e.g., bride price, holidays, rituals)?', 'high-value'),
    (cultural_id, 'Would you be willing to compromise on cultural expectations for love or peace?', 'high-value'),
    (cultural_id, 'Have you discussed raising children within your cultural or religious tradition?', 'high-value'),
    (cultural_id, 'Has a cultural or family disagreement ever caused friction between you and your partner?', 'high-value'),
    (cultural_id, 'How do you handle cultural differences in communication styles or emotional expression?', 'high-value'),
    (cultural_id, 'Would your family approve of your partner based on culture or ethnicity?', 'high-value'),
    (cultural_id, 'Are you more loyal to your partner''s preferences or your family''s expectations?', 'high-value');
END $$;

-- Insert Conflict Resolution Style questions
DO $$ 
DECLARE 
    conflict_id uuid;
BEGIN
    SELECT id INTO conflict_id FROM unified_assessment_categories 
    WHERE name = 'Conflict Resolution Style' AND assessment_type = 'high-value' LIMIT 1;
    
    INSERT INTO unified_assessment_questions (category_id, question_text, assessment_type) VALUES
    (conflict_id, 'Do you prefer to avoid conflict or address it head-on?', 'high-value'),
    (conflict_id, 'When arguments get heated, do you raise your voice or remain calm?', 'high-value'),
    (conflict_id, 'Can you have tough conversations without becoming defensive?', 'high-value'),
    (conflict_id, 'Are you able to listen actively even when you feel attacked?', 'high-value'),
    (conflict_id, 'Do you seek to understand or just to win in a disagreement?', 'high-value'),
    (conflict_id, 'How often do you apologize without being told to?', 'high-value'),
    (conflict_id, 'Do you shut down emotionally when overwhelmed?', 'high-value'),
    (conflict_id, 'How often do arguments turn into personal attacks?', 'high-value'),
    (conflict_id, 'Are you able to find compromise even if you don''t fully agree?', 'high-value'),
    (conflict_id, 'Do your arguments tend to resolve constructively or end in silence?', 'high-value');
END $$;