/*
  # Add Development Plan Helper Function

  1. Changes
    - Create a function to extract tasks from development plans
    - Add helper function to update task status in development plans
    - Fix any missing constraints or indexes

  2. Security
    - No changes to RLS policies needed
*/

-- Create function to extract tasks from development plans
CREATE OR REPLACE FUNCTION extract_tasks_from_plan(plan_data jsonb)
RETURNS TABLE (
  task_text text,
  completed boolean
) AS $$
DECLARE
  plan_text text;
BEGIN
  -- Extract plan text from jsonb
  IF jsonb_typeof(plan_data->'plan') = 'string' THEN
    plan_text := plan_data->>'plan';
  ELSE
    plan_text := plan_data::text;
  END IF;
  
  -- Return tasks with completion status
  RETURN QUERY
  WITH task_matches AS (
    SELECT 
      (regexp_matches(plan_text, '- \[([ x])\] (.*?)(\n|$)', 'g'))[2] AS status,
      (regexp_matches(plan_text, '- \[([ x])\] (.*?)(\n|$)', 'g'))[3] AS task
  )
  SELECT 
    task,
    CASE WHEN status = 'x' THEN true ELSE false END AS completed
  FROM task_matches;
END;
$$ LANGUAGE plpgsql;

-- Create function to update task status in development plans
CREATE OR REPLACE FUNCTION update_task_status_in_plan(
  p_assessment_id uuid,
  p_task_text text,
  p_completed boolean
) RETURNS jsonb AS $$
DECLARE
  plan_data jsonb;
  plan_text text;
  updated_plan text;
  checkbox_char text;
BEGIN
  -- Get the current plan
  SELECT development_plans.plan_data INTO plan_data
  FROM development_plans
  WHERE assessment_id = p_assessment_id;
  
  IF plan_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Extract plan text
  IF jsonb_typeof(plan_data->'plan') = 'string' THEN
    plan_text := plan_data->>'plan';
  ELSE
    plan_text := plan_data::text;
  END IF;
  
  -- Determine checkbox character
  checkbox_char := CASE WHEN p_completed THEN 'x' ELSE ' ' END;
  
  -- Update the task status in the plan text
  -- Escape special regex characters in the task text
  p_task_text := regexp_replace(p_task_text, '([[\]().+*?^${}|])', '\\\1', 'g');
  
  -- Replace the checkbox status
  updated_plan := regexp_replace(
    plan_text,
    '- \[[ x]\] ' || p_task_text,
    '- [' || checkbox_char || '] ' || p_task_text,
    'g'
  );
  
  -- Update the plan data
  IF jsonb_typeof(plan_data->'plan') = 'string' THEN
    plan_data := jsonb_set(plan_data, '{plan}', to_jsonb(updated_plan));
  ELSE
    plan_data := to_jsonb(updated_plan);
  END IF;
  
  -- Return the updated plan data
  RETURN plan_data;
END;
$$ LANGUAGE plpgsql;

-- Add index on assessment_id for faster lookups
CREATE INDEX IF NOT EXISTS development_plans_assessment_id_idx ON development_plans(assessment_id);

-- Ensure development_plans has proper constraints
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'development_plans_assessment_id_key'
  ) THEN
    ALTER TABLE development_plans ADD CONSTRAINT development_plans_assessment_id_key UNIQUE (assessment_id);
  END IF;
END $$;