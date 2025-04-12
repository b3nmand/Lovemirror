/*
  # High-Value Man Assessment Schema

  1. New Tables
    - `assessment_categories`
      - Stores the main trait categories with weights
    - `assessment_questions`
      - Stores questions for each category
    - `assessment_results`
      - Stores user assessment results with category breakdowns

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create assessment categories table
CREATE TABLE IF NOT EXISTS assessment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 100),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create assessment questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES assessment_categories(id),
  question_text text NOT NULL,
  min_value integer DEFAULT 1,
  max_value integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create assessment results table
CREATE TABLE IF NOT EXISTS assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES assessment_categories(id),
  score numeric NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Enable RLS
ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read assessment categories"
  ON assessment_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read assessment questions"
  ON assessment_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their assessment results"
  ON assessment_results FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert assessment categories
INSERT INTO assessment_categories (name, weight, description) VALUES
  ('Behavioral Traits', 20, 'Leadership, Discipline, Integrity'),
  ('Financial Stability', 20, 'Income, Investments, Debt Management'),
  ('Mental Strength', 20, 'Emotional Control, Decision Making'),
  ('Lifestyle Choices', 20, 'Fitness, Social Circle, Habits'),
  ('Communication Skills', 20, 'Conflict Resolution, Listening');

-- Insert assessment questions
INSERT INTO assessment_questions (category_id, question_text) VALUES
  -- Behavioral Traits
  ((SELECT id FROM assessment_categories WHERE name = 'Behavioral Traits'), 'How consistently do you demonstrate leadership qualities in your daily life?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Behavioral Traits'), 'How well do you maintain personal discipline and follow through on commitments?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Behavioral Traits'), 'How strongly do you uphold your personal values and integrity?'),
  
  -- Financial Stability
  ((SELECT id FROM assessment_categories WHERE name = 'Financial Stability'), 'How well do you manage your income and expenses?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Financial Stability'), 'How diversified are your investments and savings?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Financial Stability'), 'How effectively do you manage and minimize debt?'),
  
  -- Mental Strength
  ((SELECT id FROM assessment_categories WHERE name = 'Mental Strength'), 'How well do you control your emotions during challenging situations?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Mental Strength'), 'How confident are you in making important life decisions?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Mental Strength'), 'How resilient are you when facing setbacks?'),
  
  -- Lifestyle Choices
  ((SELECT id FROM assessment_categories WHERE name = 'Lifestyle Choices'), 'How consistently do you maintain physical fitness?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Lifestyle Choices'), 'How positive and supportive is your social circle?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Lifestyle Choices'), 'How healthy are your daily habits and routines?'),
  
  -- Communication Skills
  ((SELECT id FROM assessment_categories WHERE name = 'Communication Skills'), 'How effectively do you resolve conflicts?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Communication Skills'), 'How well do you practice active listening?'),
  ((SELECT id FROM assessment_categories WHERE name = 'Communication Skills'), 'How clearly do you express your thoughts and feelings?');