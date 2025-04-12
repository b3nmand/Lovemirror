/*
  # Bridal Price Assessment Schema

  1. New Tables
    - `bridal_assessment_categories`
      - Stores the main trait categories with weights
    - `bridal_assessment_questions`
      - Stores questions for each category
    - `bridal_assessment_results`
      - Stores user assessment results with category breakdowns
    - `regional_price_factors`
      - Stores regional pricing adjustments

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create regional price factors table
CREATE TABLE IF NOT EXISTS regional_price_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL UNIQUE,
  base_price numeric NOT NULL DEFAULT 10000,
  multiplier numeric NOT NULL DEFAULT 1.0,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz DEFAULT now()
);

-- Create bridal assessment categories table
CREATE TABLE IF NOT EXISTS bridal_assessment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 100),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create bridal assessment questions table
CREATE TABLE IF NOT EXISTS bridal_assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES bridal_assessment_categories(id),
  question_text text NOT NULL,
  min_value integer DEFAULT 1,
  max_value integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create bridal assessment results table
CREATE TABLE IF NOT EXISTS bridal_assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES bridal_assessment_categories(id),
  score numeric NOT NULL CHECK (score >= 0 AND score <= 100),
  price_contribution numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Enable RLS
ALTER TABLE regional_price_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridal_assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridal_assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridal_assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read regional price factors"
  ON regional_price_factors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read bridal assessment categories"
  ON bridal_assessment_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read bridal assessment questions"
  ON bridal_assessment_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their bridal assessment results"
  ON bridal_assessment_results FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert regional price factors
INSERT INTO regional_price_factors (region, base_price, multiplier, currency) VALUES
  ('nigeria', 15000, 1.2, 'NGN'),
  ('kenya', 12000, 1.1, 'KES'),
  ('ghana', 13000, 1.15, 'GHS'),
  ('south_africa', 14000, 1.25, 'ZAR'),
  ('ethiopia', 11000, 1.05, 'ETB');

-- Insert assessment categories
INSERT INTO bridal_assessment_categories (name, weight, description) VALUES
  ('Behavioral Traits', 25, 'Respect, Family Orientation, Cultural Values'),
  ('Economic Factors', 25, 'Education, Career Prospects, Financial Management'),
  ('Physical Attributes', 25, 'Health, Fitness, Personal Care'),
  ('Mental Stability', 25, 'Emotional Maturity, Conflict Resolution');

-- Insert assessment questions
INSERT INTO bridal_assessment_questions (category_id, question_text) VALUES
  -- Behavioral Traits
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Behavioral Traits'), 'How well do you uphold traditional family values?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Behavioral Traits'), 'How respectful are you towards elders and family traditions?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Behavioral Traits'), 'How committed are you to maintaining cultural practices?'),
  
  -- Economic Factors
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Economic Factors'), 'What level of education have you achieved?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Economic Factors'), 'How stable is your career or business prospects?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Economic Factors'), 'How well do you manage household finances?'),
  
  -- Physical Attributes
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Physical Attributes'), 'How consistently do you maintain your health and fitness?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Physical Attributes'), 'How well do you maintain personal grooming and presentation?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Physical Attributes'), 'How active are you in maintaining a healthy lifestyle?'),
  
  -- Mental Stability
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Mental Stability'), 'How well do you handle emotional challenges?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Mental Stability'), 'How effectively do you resolve conflicts in relationships?'),
  ((SELECT id FROM bridal_assessment_categories WHERE name = 'Mental Stability'), 'How stable are you in maintaining long-term commitments?');