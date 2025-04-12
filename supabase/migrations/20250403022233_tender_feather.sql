/*
  # Initial Schema Setup for Relationship Assessment App

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to auth.users
    - `assessments`
      - Stores assessment results and metadata
    - `assessment_responses`
      - Stores individual question responses
    - `categories`
      - Stores assessment categories and weights
    - `questions`
      - Stores assessment questions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text,
  age int,
  gender text,
  region text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight decimal NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  question_text text NOT NULL,
  min_value int DEFAULT 1,
  max_value int DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  mode text NOT NULL CHECK (mode IN ('traditional', 'modern')),
  overall_score decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessment_responses table
CREATE TABLE IF NOT EXISTS assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id),
  question_id uuid REFERENCES questions(id),
  response_value int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own responses"
  ON assessment_responses FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM assessments
    WHERE assessments.id = assessment_responses.assessment_id
    AND assessments.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own responses"
  ON assessment_responses FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM assessments
    WHERE assessments.id = assessment_responses.assessment_id
    AND assessments.user_id = auth.uid()
  ));

-- Insert initial categories with weights
INSERT INTO categories (name, weight, description) VALUES
  ('Economic & Financial Stability', 0.15, 'Assessment of financial readiness and stability'),
  ('Communication & Conflict Resolution', 0.15, 'Ability to communicate effectively and resolve conflicts'),
  ('Trust & Loyalty', 0.15, 'Assessment of trust and loyalty in relationships'),
  ('Mental & Emotional Health', 0.10, 'Mental and emotional well-being evaluation'),
  ('Behavioral Alignment', 0.10, 'Assessment of behavioral compatibility'),
  ('Gender Roles & Expectations', 0.10, 'Understanding of gender roles and expectations'),
  ('External Influences', 0.10, 'Impact of friends and family on relationships'),
  ('Social Media Impact', 0.05, 'Effect of social media on relationships'),
  ('Commitment & Accountability', 0.05, 'Level of commitment and responsibility'),
  ('Dating Marketplace Realism', 0.05, 'Understanding of modern dating dynamics');