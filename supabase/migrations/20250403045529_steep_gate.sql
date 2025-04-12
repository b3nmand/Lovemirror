/*
  # Add Goals and Habits Tables

  1. New Tables
    - `goals`: Stores user improvement goals
    - `habits`: Stores daily habits and streaks
    - `settings`: Stores user preferences and settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create goals table if it doesn't exist
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES categories(id),
  target numeric NOT NULL,
  current numeric DEFAULT 0,
  deadline timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habits table if it doesn't exist
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  streak int DEFAULT 0,
  last_completed timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  notifications boolean DEFAULT true,
  currency text DEFAULT 'USD',
  gold_price numeric DEFAULT 1800,
  regional_pricing boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their goals" ON goals;
  DROP POLICY IF EXISTS "Users can manage their habits" ON habits;
  DROP POLICY IF EXISTS "Users can manage their settings" ON settings;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policies
CREATE POLICY "Users can manage their goals"
  ON goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their habits"
  ON habits FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their settings"
  ON settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create or replace function to handle timestamps
CREATE OR REPLACE FUNCTION handle_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_goals_timestamp ON goals;
DROP TRIGGER IF EXISTS update_habits_timestamp ON habits;
DROP TRIGGER IF EXISTS update_settings_timestamp ON settings;

-- Create triggers
CREATE TRIGGER update_goals_timestamp
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_timestamp();

CREATE TRIGGER update_habits_timestamp
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_timestamp();

CREATE TRIGGER update_settings_timestamp
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_timestamp();