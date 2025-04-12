/*
  # Unified Assessment Questions Schema

  1. Changes
    - Create unified categories and questions tables
    - Migrate existing questions to new structure
    - Add assessment type field to track which questions belong to which assessment

  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create unified assessment categories
CREATE TABLE IF NOT EXISTS unified_assessment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 100),
  description text,
  assessment_type text NOT NULL CHECK (assessment_type = ANY (ARRAY['high-value', 'bridal-price', 'wife-material'])),
  created_at timestamptz DEFAULT now()
);

-- Create unified assessment questions
CREATE TABLE IF NOT EXISTS unified_assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES unified_assessment_categories(id),
  question_text text NOT NULL,
  min_value integer DEFAULT 1,
  max_value integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE unified_assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_assessment_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read unified assessment categories"
  ON unified_assessment_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read unified assessment questions"
  ON unified_assessment_questions FOR SELECT
  TO authenticated
  USING (true);

-- Insert categories and questions
INSERT INTO unified_assessment_categories (name, weight, description, assessment_type) VALUES
  -- High Value Man Categories
  ('Behavioral Traits', 20, 'Leadership, Discipline, Integrity', 'high-value'),
  ('Financial Stability', 20, 'Income, Investments, Debt Management', 'high-value'),
  ('Mental Strength', 20, 'Emotional Control, Decision Making', 'high-value'),
  ('Lifestyle Choices', 20, 'Fitness, Social Circle, Habits', 'high-value'),
  ('Communication Skills', 20, 'Conflict Resolution, Listening', 'high-value'),

  -- Bridal Price Categories
  ('Behavioral Traits', 25, 'Respect, Family Orientation, Cultural Values', 'bridal-price'),
  ('Economic Factors', 25, 'Education, Career Prospects, Financial Management', 'bridal-price'),
  ('Physical Attributes', 25, 'Health, Fitness, Personal Care', 'bridal-price'),
  ('Mental Stability', 25, 'Emotional Maturity, Conflict Resolution', 'bridal-price'),

  -- Wife Material Categories
  ('Behavioral Alignment', 20, 'Values, principles, and personal conduct', 'wife-material'),
  ('Communication Skills', 20, 'Active listening, expression, and conflict resolution', 'wife-material'),
  ('Emotional Intelligence', 20, 'Self-awareness, empathy, and emotional management', 'wife-material'),
  ('Financial Stability', 20, 'Financial literacy, planning, and responsibility', 'wife-material'),
  ('Conflict Resolution & Lifestyle', 20, 'Problem-solving and life balance', 'wife-material');

-- Insert shared assessment questions
INSERT INTO unified_assessment_questions (category_id, question_text) VALUES
  -- High Value Man Questions
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Traits' AND assessment_type = 'high-value'),
   'How consistently do you demonstrate leadership qualities in your daily life?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Traits' AND assessment_type = 'high-value'),
   'How well do you maintain personal discipline and follow through on commitments?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Traits' AND assessment_type = 'high-value'),
   'How strongly do you uphold your personal values and integrity?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Financial Stability' AND assessment_type = 'high-value'),
   'How well do you manage your income and expenses?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Financial Stability' AND assessment_type = 'high-value'),
   'How diversified are your investments and savings?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Financial Stability' AND assessment_type = 'high-value'),
   'How effectively do you manage and minimize debt?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Mental Strength' AND assessment_type = 'high-value'),
   'How well do you control your emotions during challenging situations?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Mental Strength' AND assessment_type = 'high-value'),
   'How confident are you in making important life decisions?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Mental Strength' AND assessment_type = 'high-value'),
   'How resilient are you when facing setbacks?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Lifestyle Choices' AND assessment_type = 'high-value'),
   'How consistently do you maintain physical fitness?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Lifestyle Choices' AND assessment_type = 'high-value'),
   'How positive and supportive is your social circle?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Lifestyle Choices' AND assessment_type = 'high-value'),
   'How healthy are your daily habits and routines?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Communication Skills' AND assessment_type = 'high-value'),
   'How effectively do you resolve conflicts?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Communication Skills' AND assessment_type = 'high-value'),
   'How well do you practice active listening?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Communication Skills' AND assessment_type = 'high-value'),
   'How clearly do you express your thoughts and feelings?'),

  -- Bridal Price Questions
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Traits' AND assessment_type = 'bridal-price'),
   'How well do you uphold traditional family values?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Traits' AND assessment_type = 'bridal-price'),
   'How respectful are you towards elders and family traditions?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Traits' AND assessment_type = 'bridal-price'),
   'How committed are you to maintaining cultural practices?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Economic Factors' AND assessment_type = 'bridal-price'),
   'What level of education have you achieved?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Economic Factors' AND assessment_type = 'bridal-price'),
   'How stable is your career or business prospects?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Economic Factors' AND assessment_type = 'bridal-price'),
   'How well do you manage household finances?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Physical Attributes' AND assessment_type = 'bridal-price'),
   'How consistently do you maintain your health and fitness?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Physical Attributes' AND assessment_type = 'bridal-price'),
   'How well do you maintain personal grooming and presentation?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Physical Attributes' AND assessment_type = 'bridal-price'),
   'How active are you in maintaining a healthy lifestyle?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Mental Stability' AND assessment_type = 'bridal-price'),
   'How well do you handle emotional challenges?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Mental Stability' AND assessment_type = 'bridal-price'),
   'How effectively do you resolve conflicts in relationships?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Mental Stability' AND assessment_type = 'bridal-price'),
   'How stable are you in maintaining long-term commitments?'),

  -- Wife Material Questions
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Alignment' AND assessment_type = 'wife-material'),
   'How consistently do you demonstrate your core values in daily life?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Alignment' AND assessment_type = 'wife-material'),
   'How well do you maintain personal boundaries and self-respect?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Behavioral Alignment' AND assessment_type = 'wife-material'),
   'How effectively do you balance independence with partnership?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Communication Skills' AND assessment_type = 'wife-material'),
   'How well do you express your needs and feelings constructively?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Communication Skills' AND assessment_type = 'wife-material'),
   'How effectively do you practice active listening?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Communication Skills' AND assessment_type = 'wife-material'),
   'How well do you handle difficult conversations?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Emotional Intelligence' AND assessment_type = 'wife-material'),
   'How well do you understand and manage your emotions?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Emotional Intelligence' AND assessment_type = 'wife-material'),
   'How empathetic are you towards others'' feelings and perspectives?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Emotional Intelligence' AND assessment_type = 'wife-material'),
   'How well do you maintain emotional stability during stress?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Financial Stability' AND assessment_type = 'wife-material'),
   'How well do you manage your personal finances?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Financial Stability' AND assessment_type = 'wife-material'),
   'How effectively do you plan for long-term financial goals?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Financial Stability' AND assessment_type = 'wife-material'),
   'How responsible are you with spending and saving?'),

  ((SELECT id FROM unified_assessment_categories WHERE name = 'Conflict Resolution & Lifestyle' AND assessment_type = 'wife-material'),
   'How effectively do you resolve conflicts without escalation?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Conflict Resolution & Lifestyle' AND assessment_type = 'wife-material'),
   'How well do you maintain work-life balance?'),
  ((SELECT id FROM unified_assessment_categories WHERE name = 'Conflict Resolution & Lifestyle' AND assessment_type = 'wife-material'),
   'How adaptable are you to change and challenges?');