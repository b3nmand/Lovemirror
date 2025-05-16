/*
  # Fix Subscription Model and Implement Required Features

  1. Changes
    - Add function to check if subscription has expired
    - Add function to calculate delusional score
    - Add function to calculate compatibility score
    - Add trigger to auto-generate development plan on assessment completion
    - Add function to generate goals from development plan

  2. Security
    - Maintain existing RLS policies
    - Add helper functions for subscription checks
*/

-- Function to check if subscription has expired
CREATE OR REPLACE FUNCTION has_subscription_expired(user_id uuid)
RETURNS boolean AS $$
DECLARE
  customer_id text;
  has_active boolean;
BEGIN
  -- First check direct subscription
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE subscriptions.user_id = has_subscription_expired.user_id
    AND status = 'active'
    AND current_period_end > now()
  ) INTO has_active;
  
  -- If direct subscription exists and is active, return false (not expired)
  IF has_active THEN
    RETURN false;
  END IF;
  
  -- Get the customer ID from the profile
  SELECT stripe_customer_id INTO customer_id
  FROM profiles
  WHERE id = user_id;
  
  -- If no customer ID, return true (expired)
  IF customer_id IS NULL THEN
    RETURN true;
  END IF;
  
  -- Check if there's an active subscription with this customer ID
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE stripe_customer_id = customer_id
    AND status = 'active'
    AND current_period_end > now()
  ) INTO has_active;
  
  -- Return true if no active subscription found (expired)
  RETURN NOT has_active;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate delusional score
CREATE OR REPLACE FUNCTION calculate_delusional_score(
  user_id uuid
)
RETURNS TABLE (
  category_id uuid,
  category_name text,
  self_score numeric,
  external_score numeric,
  gap_score numeric,
  overall_delusional_score numeric
) AS $$
DECLARE
  latest_assessment_id uuid;
BEGIN
  -- Get the latest assessment ID
  SELECT id INTO latest_assessment_id
  FROM assessment_history
  WHERE user_id = calculate_delusional_score.user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Return if no assessment found
  IF latest_assessment_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate scores for each category
  RETURN QUERY
  WITH self_scores AS (
    -- Get self-assessment scores from latest assessment
    SELECT 
      cs.category_id,
      uc.name AS category_name,
      cs.score AS score
    FROM jsonb_to_recordset(
      (SELECT category_scores FROM assessment_history WHERE id = latest_assessment_id)
    ) AS cs(category_id uuid, score numeric)
    JOIN unified_assessment_categories uc ON cs.category_id = uc.id
  ),
  external_scores AS (
    -- Get external assessment scores
    SELECT 
      uq.category_id,
      uc.name AS category_name,
      AVG(ear.response_value) * 20 AS score -- Convert 1-5 scale to percentage
    FROM external_assessment_responses ear
    JOIN unified_assessment_questions uq ON ear.question_id = uq.id
    JOIN unified_assessment_categories uc ON uq.category_id = uc.id
    JOIN external_assessors ea ON ear.assessor_id = ea.id
    WHERE ea.user_id = calculate_delusional_score.user_id
    AND ea.status = 'completed'
    GROUP BY uq.category_id, uc.name
  ),
  combined_scores AS (
    -- Combine self and external scores
    SELECT 
      s.category_id,
      s.category_name,
      s.score AS self_score,
      COALESCE(e.score, 0) AS external_score,
      ABS(s.score - COALESCE(e.score, 0)) AS gap_score
    FROM self_scores s
    LEFT JOIN external_scores e ON s.category_id = e.category_id
  )
  SELECT 
    c.category_id,
    c.category_name,
    c.self_score,
    c.external_score,
    c.gap_score,
    (100 - AVG(c.gap_score) OVER ()) AS overall_delusional_score
  FROM combined_scores c;
END;
$$ LANGUAGE plpgsql;

-- Drop existing compatibility score function if it exists
DROP FUNCTION IF EXISTS calculate_compatibility_score(uuid, uuid);

-- Function to calculate compatibility score
CREATE OR REPLACE FUNCTION calculate_compatibility_score(
  p_user_id uuid,
  p_partner_id uuid
)
RETURNS TABLE (
  overall_score numeric,
  category_scores jsonb,
  strengths jsonb,
  improvements jsonb
) AS $$
DECLARE
  user_assessment_id uuid;
  partner_assessment_id uuid;
BEGIN
  -- Get latest assessment IDs for both users
  SELECT id INTO user_assessment_id
  FROM assessment_history
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  SELECT id INTO partner_assessment_id
  FROM assessment_history
  WHERE user_id = p_partner_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Return if either assessment is missing
  IF user_assessment_id IS NULL OR partner_assessment_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate compatibility scores
  RETURN QUERY
  WITH user_scores AS (
    -- Get user's category scores
    SELECT 
      cs.category_id,
      uc.name AS category_name,
      cs.score
    FROM jsonb_to_recordset(
      (SELECT category_scores FROM assessment_history WHERE id = user_assessment_id)
    ) AS cs(category_id uuid, score numeric)
    JOIN unified_assessment_categories uc ON cs.category_id = uc.id
  ),
  partner_scores AS (
    -- Get partner's category scores
    SELECT 
      cs.category_id,
      uc.name AS category_name,
      cs.score
    FROM jsonb_to_recordset(
      (SELECT category_scores FROM assessment_history WHERE id = partner_assessment_id)
    ) AS cs(category_id uuid, score numeric)
    JOIN unified_assessment_categories uc ON cs.category_id = uc.id
  ),
  compatibility_scores AS (
    -- Calculate compatibility for each category
    SELECT 
      u.category_id,
      u.category_name,
      u.score AS user_score,
      p.score AS partner_score,
      (100 - ABS(u.score - p.score)) AS compatibility
    FROM user_scores u
    JOIN partner_scores p ON u.category_id = p.category_id
  ),
  category_results AS (
    -- Format category results
    SELECT 
      jsonb_build_object(
        'categories', jsonb_agg(
          jsonb_build_object(
            'category_id', category_id,
            'category_name', category_name,
            'score1', user_score,
            'score2', partner_score,
            'compatibility', compatibility
          )
        )
      ) AS category_scores,
      AVG(compatibility) AS overall_score
    FROM compatibility_scores
  ),
  strength_areas AS (
    -- Identify strength areas (highest compatibility)
    SELECT 
      jsonb_build_object(
        'areas', jsonb_agg(category_id)
      ) AS strengths
    FROM (
      SELECT category_id
      FROM compatibility_scores
      ORDER BY compatibility DESC
      LIMIT 3
    ) top_strengths
  ),
  improvement_areas AS (
    -- Identify improvement areas (lowest compatibility)
    SELECT 
      jsonb_build_object(
        'areas', jsonb_agg(category_id)
      ) AS improvements
    FROM (
      SELECT category_id
      FROM compatibility_scores
      ORDER BY compatibility ASC
      LIMIT 2
    ) bottom_strengths
  )
  SELECT 
    cr.overall_score,
    cr.category_scores,
    sa.strengths,
    ia.improvements
  FROM category_results cr
  CROSS JOIN strength_areas sa
  CROSS JOIN improvement_areas ia;
END;
$$ LANGUAGE plpgsql;

-- Function to generate development plan from assessment
CREATE OR REPLACE FUNCTION generate_development_plan(assessment_id uuid)
RETURNS jsonb AS $$
DECLARE
  assessment_data record;
  category_data jsonb;
  plan_data jsonb;
BEGIN
  -- Get assessment data
  SELECT * INTO assessment_data
  FROM assessment_history
  WHERE id = assessment_id;
  
  -- Return if no assessment found
  IF assessment_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get category details
  WITH categories AS (
    SELECT 
      c.id,
      c.name,
      c.description,
      cs.score
    FROM jsonb_to_recordset(assessment_data.category_scores) AS cs(category_id uuid, score numeric)
    JOIN unified_assessment_categories c ON cs.category_id = c.id
    ORDER BY cs.score ASC
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'name', name,
      'description', description,
      'score', score
    )
  ) INTO category_data
  FROM categories;
  
  -- Create plan structure
  plan_data := jsonb_build_object(
    'timestamp', now(),
    'assessment_id', assessment_id,
    'plan', jsonb_build_object(
      'overall_score', assessment_data.overall_score,
      'assessment_type', assessment_data.assessment_type,
      'categories', category_data,
      'focus_areas', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', name,
            'score', score
          )
        )
        FROM jsonb_to_recordset(category_data) AS x(name text, score numeric)
        ORDER BY score ASC
        LIMIT 2
      ),
      'content', '# 🎯 30-Day Action Plan\n\n' ||
                 '- [ ] Identify specific behaviors to improve in focus areas\n' ||
                 '- [ ] Set measurable goals for each area\n' ||
                 '- [ ] Track progress daily\n\n' ||
                 '# 💪 Building on Strengths\n\n' ||
                 'Leverage your highest-scoring traits to support growth in weaker areas.\n\n' ||
                 '# 📈 Progress Tracking\n\n' ||
                 'Week 1: Awareness\n' ||
                 'Week 2: Small changes\n' ||
                 'Week 3: Consistent practice\n' ||
                 'Week 4: Evaluation\n\n' ||
                 '# 🌟 Daily Habits\n\n' ||
                 '- [ ] Practice active listening\n' ||
                 '- [ ] Express appreciation daily\n' ||
                 '- [ ] Reflect on interactions\n' ||
                 '- [ ] Practice emotional regulation\n' ||
                 '- [ ] Communicate needs clearly'
    )
  );
  
  -- Return the plan data
  RETURN plan_data;
END;
$$ LANGUAGE plpgsql;

-- Function to generate goals from development plan
CREATE OR REPLACE FUNCTION generate_goals_from_plan(user_id uuid, plan_data jsonb)
RETURNS SETOF improvement_goals AS $$
DECLARE
  focus_area record;
  deadline timestamptz;
  goal_id uuid;
  task_text text;
BEGIN
  -- Set deadline to 30 days from now
  deadline := now() + interval '30 days';
  
  -- Extract focus areas from plan
  FOR focus_area IN 
    SELECT * FROM jsonb_to_recordset(plan_data->'plan'->'focus_areas') AS x(name text, score numeric)
  LOOP
    -- Create a goal for each focus area
    INSERT INTO improvement_goals (
      user_id,
      area,
      title,
      target_score,
      current_score,
      deadline,
      status
    ) VALUES (
      user_id,
      focus_area.name,
      'Improve ' || focus_area.name,
      focus_area.score + 20, -- Target 20% improvement
      focus_area.score,
      deadline,
      'in_progress'
    )
    RETURNING id INTO goal_id;
    
    -- Create tasks for the goal
    -- Extract tasks from plan content that match the focus area
    FOR task_text IN
      SELECT regexp_matches[1]
      FROM regexp_matches(
        plan_data->'plan'->>'content',
        '- \[[ x]\] (.*?)(\n|$)',
        'g'
      )
    LOOP
      -- Create a task for the goal
      INSERT INTO improvement_tasks (
        goal_id,
        title,
        completed,
        created_at
      ) VALUES (
        goal_id,
        task_text,
        false,
        now()
      );
    END LOOP;
    
    -- Return the created goal
    RETURN QUERY SELECT * FROM improvement_goals WHERE id = goal_id;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger function if it exists
DROP FUNCTION IF EXISTS create_development_plan_on_assessment() CASCADE;

-- Create trigger function
CREATE OR REPLACE FUNCTION create_development_plan_on_assessment()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate development plan
  INSERT INTO development_plans (
    assessment_id,
    plan_data
  ) VALUES (
    NEW.id,
    generate_development_plan(NEW.id)
  )
  ON CONFLICT (assessment_id) 
  DO UPDATE SET
    plan_data = generate_development_plan(NEW.id),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'create_development_plan_on_assessment_insert'
  ) THEN
    CREATE TRIGGER create_development_plan_on_assessment_insert
      AFTER INSERT ON assessment_history
      FOR EACH ROW
      EXECUTE FUNCTION create_development_plan_on_assessment();
  END IF;
END $$;

-- Add index on stripe_customer_id in profiles and subscriptions tables
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);