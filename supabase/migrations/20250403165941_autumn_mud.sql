/*
  # Add Self-Improvement Goals and Progress Tracking

  1. New Tables
    - `improvement_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `area` (text, improvement area)
      - `title` (text, goal title)
      - `target_score` (numeric, target value)
      - `current_score` (numeric, current value)
      - `deadline` (timestamptz)
      - `status` (text, goal status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `improvement_tasks`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references improvement_goals)
      - `title` (text, task title)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access
*/

-- Create improvement_goals table
CREATE TABLE IF NOT EXISTS improvement_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  area text NOT NULL,
  title text NOT NULL,
  target_score numeric NOT NULL CHECK (target_score >= 0 AND target_score <= 100),
  current_score numeric DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
  deadline timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create improvement_tasks table
CREATE TABLE IF NOT EXISTS improvement_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES improvement_goals(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE improvement_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for improvement_goals
CREATE POLICY "Users can manage their improvement goals"
  ON improvement_goals
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for improvement_tasks
CREATE POLICY "Users can manage tasks for their goals"
  ON improvement_tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM improvement_goals
      WHERE improvement_goals.id = improvement_tasks.goal_id
      AND improvement_goals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM improvement_goals
      WHERE improvement_goals.id = improvement_tasks.goal_id
      AND improvement_goals.user_id = auth.uid()
    )
  );