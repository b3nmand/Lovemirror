/*
  # Dynamic Development Plan Updates

  1. New Functions
    - `update_development_plan_on_compatibility_score`
      - Updates development plan when compatibility score is added/updated
    - `update_development_plan_on_delusional_score`
      - Updates development plan when external assessment responses are received
    - `generate_goals_from_plan`
      - Extracts goals and tasks from development plan text

  2. Triggers
    - Add triggers to automatically update development plans
    - Ensure plans evolve as new data becomes available
*/

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS generate_goals_from_plan(uuid, jsonb);
DROP FUNCTION IF EXISTS update_development_plan_on_compatibility_score();
DROP FUNCTION IF EXISTS update_development_plan_on_delusional_score();

-- Function to update development plan when compatibility score is added/updated
CREATE OR REPLACE FUNCTION update_development_plan_on_compatibility_score()
RETURNS TRIGGER AS $$
DECLARE
  user_id uuid;
  assessment_id uuid;
  plan_data jsonb;
  current_plan jsonb;
  version_number integer;
BEGIN
  -- Get user ID (could be either user1 or user2)
  user_id := NEW.user1_id;
  
  -- Get the latest assessment ID for this user
  SELECT id INTO assessment_id
  FROM assessment_history
  WHERE user_id = user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no assessment found, try with user2_id
  IF assessment_id IS NULL THEN
    user_id := NEW.user2_id;
    
    SELECT id INTO assessment_id
    FROM assessment_history
    WHERE user_id = user_id
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;
  
  -- If still no assessment found, return
  IF assessment_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get current plan data
  SELECT plan_data INTO current_plan
  FROM development_plans
  WHERE assessment_id = assessment_id;
  
  -- If no plan exists, return
  IF current_plan IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get current version number or default to 1
  IF jsonb_typeof(current_plan->'version_info'->'version') = 'number' THEN
    version_number := (current_plan->'version_info'->>'version')::integer + 1;
  ELSE
    version_number := 1;
  END IF;
  
  -- Create updated plan with compatibility insights
  plan_data := jsonb_build_object(
    'timestamp', now(),
    'assessment_id', assessment_id,
    'plan', current_plan->'plan',
    'version_info', jsonb_build_object(
      'timestamp', now(),
      'source', 'compatibility_score',
      'version', version_number
    )
  );
  
  -- Add compatibility insights to the plan
  IF jsonb_typeof(current_plan->'plan') = 'string' THEN
    plan_data := jsonb_set(
      plan_data, 
      '{plan}', 
      to_jsonb(
        (current_plan->>'plan') || 
        E'\n\n# 🔄 Updated Based on Compatibility Score\n\n' ||
        'Your compatibility score shows areas where you and your partner differ. ' ||
        'Focus on improving these areas to strengthen your relationship:\n\n' ||
        '- [ ] Discuss expectations in areas with low compatibility\n' ||
        '- [ ] Practice active listening when your partner shares their perspective\n' ||
        '- [ ] Find compromise solutions that respect both viewpoints\n'
      )
    );
  END IF;
  
  -- Update the development plan
  UPDATE development_plans
  SET plan_data = plan_data,
      updated_at = now()
  WHERE assessment_id = assessment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update development plan when delusional score is calculated
CREATE OR REPLACE FUNCTION update_development_plan_on_delusional_score()
RETURNS TRIGGER AS $$
DECLARE
  user_id uuid;
  assessment_id uuid;
  plan_data jsonb;
  current_plan jsonb;
  version_number integer;
BEGIN
  -- Get the user ID and assessment ID
  SELECT ah.user_id, ah.id INTO user_id, assessment_id
  FROM assessment_history ah
  JOIN external_assessors ea ON ea.user_id = ah.user_id
  WHERE ea.id = NEW.assessor_id
  ORDER BY ah.created_at DESC
  LIMIT 1;
  
  -- If no assessment found, return
  IF assessment_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get current plan data
  SELECT plan_data INTO current_plan
  FROM development_plans
  WHERE assessment_id = assessment_id;
  
  -- If no plan exists, return
  IF current_plan IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get current version number or default to 1
  IF jsonb_typeof(current_plan->'version_info'->'version') = 'number' THEN
    version_number := (current_plan->'version_info'->>'version')::integer + 1;
  ELSE
    version_number := 1;
  END IF;
  
  -- Create updated plan with delusional score insights
  plan_data := jsonb_build_object(
    'timestamp', now(),
    'assessment_id', assessment_id,
    'plan', current_plan->'plan',
    'version_info', jsonb_build_object(
      'timestamp', now(),
      'source', 'delusional_score',
      'version', version_number
    )
  );
  
  -- Add delusional score insights to the plan
  IF jsonb_typeof(current_plan->'plan') = 'string' THEN
    plan_data := jsonb_set(
      plan_data, 
      '{plan}', 
      to_jsonb(
        (current_plan->>'plan') || 
        E'\n\n# 🔍 Updated Based on External Assessment\n\n' ||
        'External feedback shows differences between your self-perception and how others see you. ' ||
        'Consider these insights to improve self-awareness:\n\n' ||
        '- [ ] Reflect on areas where external perception differs from self-perception\n' ||
        '- [ ] Ask for specific examples to better understand feedback\n' ||
        '- [ ] Practice self-reflection daily to increase self-awareness\n'
      )
    );
  END IF;
  
  -- Update the development plan
  UPDATE development_plans
  SET plan_data = plan_data,
      updated_at = now()
  WHERE assessment_id = assessment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate goals from development plan
CREATE OR REPLACE FUNCTION generate_goals_from_plan(
  p_user_id uuid,
  p_plan_data jsonb
)
RETURNS SETOF improvement_goals AS $$
DECLARE
  plan_text text;
  goal_match text;
  goal_id uuid;
  deadline timestamptz;
  area_match text;
  task_match text;
BEGIN
  -- Set deadline to 30 days from now
  deadline := now() + interval '30 days';
  
  -- Extract plan text
  IF jsonb_typeof(p_plan_data->'plan') = 'string' THEN
    plan_text := p_plan_data->>'plan';
  ELSE
    plan_text := p_plan_data::text;
  END IF;
  
  -- Extract focus areas from plan
  -- Look for section headers like "# 🎯 30-Day Action Plan" or "# Building on Strengths"
  FOR goal_match IN
    SELECT regexp_matches[1]
    FROM regexp_matches(
      plan_text,
      '# [^\n]+(.*?)(?=# |$)',
      'g'
    )
  LOOP
    -- Extract area from the goal section
    area_match := substring(goal_match from '([A-Za-z ]+)');
    
    IF area_match IS NOT NULL AND length(area_match) > 0 THEN
      -- Create a goal for this area
      INSERT INTO improvement_goals (
        user_id,
        area,
        title,
        target_score,
        current_score,
        deadline,
        status
      ) VALUES (
        p_user_id,
        'AI Generated',
        'Improve ' || area_match,
        80, -- Target score
        50, -- Current score (placeholder)
        deadline,
        'in_progress'
      )
      RETURNING id INTO goal_id;
      
      -- Extract tasks from this section
      FOR task_match IN
        SELECT regexp_matches[1]
        FROM regexp_matches(
          goal_match,
          '- \[[ x]\] (.*?)(?=\n|$)',
          'g'
        )
      LOOP
        -- Create a task for this goal
        INSERT INTO improvement_tasks (
          goal_id,
          title,
          completed,
          created_at
        ) VALUES (
          goal_id,
          task_match,
          false,
          now()
        );
      END LOOP;
      
      -- Return the created goal
      RETURN QUERY SELECT * FROM improvement_goals WHERE id = goal_id;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for compatibility score updates
DROP TRIGGER IF EXISTS update_plan_on_compatibility_score ON compatibility_scores;
CREATE TRIGGER update_plan_on_compatibility_score
  AFTER INSERT OR UPDATE ON compatibility_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_development_plan_on_compatibility_score();

-- Create trigger for delusional score updates
DROP TRIGGER IF EXISTS update_plan_on_external_assessment ON external_assessment_responses;
CREATE TRIGGER update_plan_on_external_assessment
  AFTER INSERT ON external_assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_development_plan_on_delusional_score();