/*
  # Update Assessment Categories and Questions

  1. Changes
    - Add color_code column to categories table
    - Update categories with new focused areas, weights, and color codes
    - Add detailed questions for each category

  2. Categories
    - Mental Traits (Purple)
    - Emotional Traits (Pink)
    - Physical Traits (Blue)
    - Financial Traits (Green)
    - Family & Cultural Compatibility (Orange)
    - Conflict Resolution Style (Red)
*/

-- Add color_code column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color_code text;

-- First, clear existing data
DELETE FROM assessment_responses;
DELETE FROM questions;
DELETE FROM categories;

-- Insert updated categories with color codes
INSERT INTO categories (id, name, weight, description, color_code) VALUES
  (gen_random_uuid(), 'Mental Traits', 0.20, 'Thought patterns, mindset, emotional regulation, and problem-solving', '#8B5CF6'),
  (gen_random_uuid(), 'Emotional Traits', 0.20, 'Empathy, vulnerability, emotional intelligence, and affection handling', '#EC4899'),
  (gen_random_uuid(), 'Physical Traits', 0.15, 'Grooming, lifestyle habits, physical affection, health, and connection', '#3B82F6'),
  (gen_random_uuid(), 'Financial Traits', 0.15, 'Financial habits, transparency, planning, and maturity', '#10B981'),
  (gen_random_uuid(), 'Family & Cultural Compatibility', 0.15, 'Values, traditions, family roles, and expectations', '#F97316'),
  (gen_random_uuid(), 'Conflict Resolution Style', 0.15, 'Handling disagreements, tension, and emotional moments', '#EF4444');

-- Insert questions for Mental Traits
DO $$ 
DECLARE 
    mental_id uuid := (SELECT id FROM categories WHERE name = 'Mental Traits' LIMIT 1);
BEGIN
    INSERT INTO questions (category_id, question_text) VALUES
    (mental_id, 'Do you tend to shut down emotionally during disagreements?'),
    (mental_id, 'How often do you overthink your partner''s actions or words?'),
    (mental_id, 'When you''re upset, do you communicate clearly or withdraw?'),
    (mental_id, 'How often do you try to understand your partner''s perspective before responding?'),
    (mental_id, 'Do you believe compromise is a sign of weakness or strength?'),
    (mental_id, 'Can you handle criticism from your partner without becoming defensive?'),
    (mental_id, 'How often do you reflect on your own contribution to relationship problems?'),
    (mental_id, 'Do you react impulsively when you feel disrespected?'),
    (mental_id, 'Can you stay calm when your partner triggers you emotionally?'),
    (mental_id, 'Do you take time to self-assess your mental health and its impact on your relationship?');
END $$;

-- Insert questions for Emotional Traits
DO $$ 
DECLARE 
    emotional_id uuid := (SELECT id FROM categories WHERE name = 'Emotional Traits' LIMIT 1);
BEGIN
    INSERT INTO questions (category_id, question_text) VALUES
    (emotional_id, 'Are you comfortable expressing your feelings directly to your partner?'),
    (emotional_id, 'Do you feel safe being emotionally vulnerable in your relationship?'),
    (emotional_id, 'When your partner shares something emotional, do you usually offer support or solutions?'),
    (emotional_id, 'How often do you validate your partner''s emotions, even if you disagree?'),
    (emotional_id, 'Do you find it difficult to trust someone with your deeper emotions?'),
    (emotional_id, 'When your partner cries or is upset, how do you typically respond?'),
    (emotional_id, 'Do you require external validation to feel emotionally secure?'),
    (emotional_id, 'How do you respond to emotional distance from your partner?'),
    (emotional_id, 'Can you recognize emotional manipulation in a relationship?'),
    (emotional_id, 'Are you emotionally available or emotionally avoidant in romantic relationships?');
END $$;

-- Insert questions for Physical Traits
DO $$ 
DECLARE 
    physical_id uuid := (SELECT id FROM categories WHERE name = 'Physical Traits' LIMIT 1);
BEGIN
    INSERT INTO questions (category_id, question_text) VALUES
    (physical_id, 'Have you maintained a healthy weight and lifestyle during your relationships?'),
    (physical_id, 'Do you maintain your personal hygiene and grooming daily, even during routine days?'),
    (physical_id, 'How often do you initiate non-sexual physical affection (hugs, touch)?'),
    (physical_id, 'Do you avoid physical closeness because of body insecurities?'),
    (physical_id, 'How often do you prioritize your physical health for your own well-being?'),
    (physical_id, 'How does your current lifestyle (diet, exercise, rest) support your romantic relationship?'),
    (physical_id, 'Do you use physical intimacy as a reward or punishment in the relationship?'),
    (physical_id, 'Do you consistently put effort into your physical presentation?'),
    (physical_id, 'Are you sexually responsive to your partner''s needs and open to communication around it?'),
    (physical_id, 'Do you take responsibility for your physical presence in your relationship?');
END $$;

-- Insert questions for Financial Traits
DO $$ 
DECLARE 
    financial_id uuid := (SELECT id FROM categories WHERE name = 'Financial Traits' LIMIT 1);
BEGIN
    INSERT INTO questions (category_id, question_text) VALUES
    (financial_id, 'Do you have a monthly budget or do you spend based on how you feel?'),
    (financial_id, 'Are you open with your partner about your financial struggles or debts?'),
    (financial_id, 'How often do you save money versus spend impulsively?'),
    (financial_id, 'Would you feel uncomfortable if your partner earned more than you?'),
    (financial_id, 'Do you believe financial roles in a relationship should be traditional or equal?'),
    (financial_id, 'How do you manage financial pressure—by planning or avoiding?'),
    (financial_id, 'Do you borrow money without telling your partner?'),
    (financial_id, 'Have you ever used money as a tool for control in a relationship?'),
    (financial_id, 'Can you commit to long-term financial planning (e.g., investments, home ownership)?'),
    (financial_id, 'Do you feel financially secure and mature enough to build a future with someone?');
END $$;

-- Insert questions for Family & Cultural Compatibility
DO $$ 
DECLARE 
    cultural_id uuid := (SELECT id FROM categories WHERE name = 'Family & Cultural Compatibility' LIMIT 1);
BEGIN
    INSERT INTO questions (category_id, question_text) VALUES
    (cultural_id, 'Do you and your partner share the same values when it comes to marriage roles?'),
    (cultural_id, 'How involved do you expect extended family to be in your relationship?'),
    (cultural_id, 'Do you and your partner practice the same religion or spiritual beliefs?'),
    (cultural_id, 'How aligned are you with your partner on cultural practices?'),
    (cultural_id, 'Would you be willing to compromise on cultural expectations for love or peace?'),
    (cultural_id, 'Have you discussed raising children within your cultural or religious tradition?'),
    (cultural_id, 'Has a cultural or family disagreement ever caused friction with your partner?'),
    (cultural_id, 'How do you handle cultural differences in communication styles?'),
    (cultural_id, 'Would your family approve of your partner based on culture or ethnicity?'),
    (cultural_id, 'Are you more loyal to your partner''s preferences or your family''s expectations?');
END $$;

-- Insert questions for Conflict Resolution Style
DO $$ 
DECLARE 
    conflict_id uuid := (SELECT id FROM categories WHERE name = 'Conflict Resolution Style' LIMIT 1);
BEGIN
    INSERT INTO questions (category_id, question_text) VALUES
    (conflict_id, 'Do you prefer to avoid conflict or address it head-on?'),
    (conflict_id, 'When arguments get heated, do you raise your voice or remain calm?'),
    (conflict_id, 'Can you have tough conversations without becoming defensive?'),
    (conflict_id, 'Are you able to listen actively even when you feel attacked?'),
    (conflict_id, 'Do you seek to understand or just to win in a disagreement?'),
    (conflict_id, 'How often do you apologize without being told to?'),
    (conflict_id, 'Do you shut down emotionally when overwhelmed?'),
    (conflict_id, 'How often do arguments turn into personal attacks?'),
    (conflict_id, 'Are you able to find compromise even if you don''t fully agree?'),
    (conflict_id, 'Do your arguments tend to resolve constructively or end in silence?');
END $$;