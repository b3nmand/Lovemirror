/*
  # Wife Material Assessment Schema

  1. New Tables
    - `wife_material_categories`
      - Stores assessment categories with weights
    - `wife_material_questions`
      - Stores questions for each category
    - `wife_material_results`
      - Stores assessment results with category breakdowns

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create wife material categories table
CREATE TABLE IF NOT EXISTS wife_material_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 100),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create wife material questions table
CREATE TABLE IF NOT EXISTS wife_material_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES wife_material_categories(id),
  question_text text NOT NULL,
  min_value integer DEFAULT 1,
  max_value integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create wife material results table
CREATE TABLE IF NOT EXISTS wife_material_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES wife_material_categories(id),
  score numeric NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Enable RLS
ALTER TABLE wife_material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wife_material_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wife_material_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read wife material categories"
  ON wife_material_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read wife material questions"
  ON wife_material_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their wife material results"
  ON wife_material_results FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert assessment categories
INSERT INTO wife_material_categories (name, weight, description) VALUES
  ('Behavioral Alignment', 20, 'Values, principles, and personal conduct'),
  ('Communication Skills', 20, 'Active listening, expression, and conflict resolution'),
  ('Emotional Intelligence', 20, 'Self-awareness, empathy, and emotional management'),
  ('Financial Stability', 20, 'Financial literacy, planning, and responsibility'),
  ('Conflict Resolution & Lifestyle', 20, 'Problem-solving and life balance');

-- Insert assessment questions
INSERT INTO wife_material_questions (category_id, question_text) VALUES
  -- Behavioral Alignment
  ((SELECT id FROM wife_material_categories WHERE name = 'Behavioral Alignment'), 'How consistently do you demonstrate your core values in daily life?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Behavioral Alignment'), 'How well do you maintain personal boundaries and self-respect?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Behavioral Alignment'), 'How effectively do you balance independence with partnership?'),

  -- Communication Skills
  ((SELECT id FROM wife_material_categories WHERE name = 'Communication Skills'), 'How well do you express your needs and feelings constructively?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Communication Skills'), 'How effectively do you practice active listening?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Communication Skills'), 'How well do you handle difficult conversations?'),

  -- Emotional Intelligence
  ((SELECT id FROM wife_material_categories WHERE name = 'Emotional Intelligence'), 'How well do you understand and manage your emotions?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Emotional Intelligence'), 'How empathetic are you towards others'' feelings and perspectives?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Emotional Intelligence'), 'How well do you maintain emotional stability during stress?'),

  -- Financial Stability
  ((SELECT id FROM wife_material_categories WHERE name = 'Financial Stability'), 'How well do you manage your personal finances?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Financial Stability'), 'How effectively do you plan for long-term financial goals?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Financial Stability'), 'How responsible are you with spending and saving?'),

  -- Conflict Resolution & Lifestyle
  ((SELECT id FROM wife_material_categories WHERE name = 'Conflict Resolution & Lifestyle'), 'How effectively do you resolve conflicts without escalation?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Conflict Resolution & Lifestyle'), 'How well do you maintain work-life balance?'),
  ((SELECT id FROM wife_material_categories WHERE name = 'Conflict Resolution & Lifestyle'), 'How adaptable are you to change and challenges?');