/*
  # Auto-Generate Development Plan on Assessment Completion

  1. New Functions
    - `create_development_plan_on_assessment`
      - Automatically generates a development plan when a user completes an assessment
    - `generate_development_plan`
      - Creates a structured development plan based on assessment results

  2. Triggers
    - Add trigger to automatically create development plan on assessment completion
    - Ensure plans are created immediately after assessment submission
*/

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS create_development_plan_on_assessment() CASCADE;
DROP FUNCTION IF EXISTS generate_development_plan(uuid);

-- Function to generate a development plan from assessment results
CREATE OR REPLACE FUNCTION generate_development_plan(assessment_id uuid)
RETURNS jsonb AS $$
DECLARE
  assessment_data record;
  category_data jsonb;
  strengths jsonb;
  improvements jsonb;
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
  
  -- Get category details and sort by score
  WITH categories AS (
    SELECT 
      c.id,
      c.name,
      c.description,
      cs.score
    FROM jsonb_to_recordset(assessment_data.category_scores) AS cs(category_id uuid, score numeric)
    JOIN unified_assessment_categories c ON cs.category_id = c.id
    ORDER BY cs.score
  ),
  strength_categories AS (
    SELECT 
      id,
      name,
      description,
      score
    FROM categories
    ORDER BY score DESC
    LIMIT 2
  ),
  improvement_categories AS (
    SELECT 
      id,
      name,
      description,
      score
    FROM categories
    ORDER BY score ASC
    LIMIT 2
  )
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'name', name,
        'description', description,
        'score', score
      )
    ) INTO category_data
  FROM categories;
  
  -- Get strengths
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'name', name,
        'score', score
      )
    ) INTO strengths
  FROM strength_categories;
  
  -- Get areas for improvement
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'name', name,
        'score', score
      )
    ) INTO improvements
  FROM improvement_categories;
  
  -- Create plan structure with markdown content
  plan_data := jsonb_build_object(
    'timestamp', now(),
    'assessment_id', assessment_id,
    'plan', 
      '# 🎯 30-Day Action Plan\n\n' ||
      'Focus on these specific actions to improve your lowest-scoring areas:\n\n' ||
      
      -- Add actions for first improvement area
      '## ' || (improvements->0->>'name') || ' (' || (improvements->0->>'score')::numeric || '%)\n\n' ||
      '- [ ] Identify specific behaviors that need improvement in this area\n' ||
      '- [ ] Set a measurable goal to improve by 10% in 30 days\n' ||
      '- [ ] Practice daily awareness of your patterns in this area\n' ||
      '- [ ] Seek feedback from trusted friends on your progress\n' ||
      '- [ ] Journal about your improvements weekly\n\n' ||
      
      -- Add actions for second improvement area
      '## ' || (improvements->1->>'name') || ' (' || (improvements->1->>'score')::numeric || '%)\n\n' ||
      '- [ ] Research best practices for improving this trait\n' ||
      '- [ ] Identify situations that trigger challenges in this area\n' ||
      '- [ ] Create a specific plan to handle these situations differently\n' ||
      '- [ ] Practice new responses in low-pressure situations\n' ||
      '- [ ] Review and adjust your approach weekly\n\n' ||
      
      '# 💪 Building on Strengths\n\n' ||
      
      -- Add strengths section
      '## ' || (strengths->0->>'name') || ' (' || (strengths->0->>'score')::numeric || '%)\n\n' ||
      'Your strong ' || (strengths->0->>'name') || ' provides a foundation you can leverage. Use this strength to support growth in weaker areas by:\n\n' ||
      '- Applying the same discipline and focus to your improvement areas\n' ||
      '- Teaching others about effective ' || (strengths->0->>'name') || ' to reinforce your own skills\n' ||
      '- Using your confidence in this area to build confidence in others\n\n' ||
      
      '## ' || (strengths->1->>'name') || ' (' || (strengths->1->>'score')::numeric || '%)\n\n' ||
      'Your ' || (strengths->1->>'name') || ' skills can help you develop in other areas by:\n\n' ||
      '- Using these skills to create a supportive environment for growth\n' ||
      '- Applying the same principles that made you successful here to other areas\n' ||
      '- Recognizing how this strength can compensate while you develop other traits\n\n' ||
      
      '# 📈 Progress Tracking\n\n' ||
      
      '## Weekly Milestones\n\n' ||
      '- Week 1: Awareness - Notice patterns in your behavior\n' ||
      '- Week 2: Experimentation - Try new approaches\n' ||
      '- Week 3: Consistency - Establish regular practice\n' ||
      '- Week 4: Evaluation - Measure your progress\n\n' ||
      
      '## Success Indicators\n\n' ||
      '- You feel more confident in previously challenging situations\n' ||
      '- Others notice and comment on your improvement\n' ||
      '- You handle difficult scenarios with less stress\n' ||
      '- Your relationships show positive changes\n\n' ||
      
      '## Potential Obstacles\n\n' ||
      '- Old habits resurfacing under stress\n' ||
      '- Lack of consistent practice\n' ||
      '- Difficulty measuring subtle changes\n' ||
      '- External factors disrupting your routine\n\n' ||
      
      '# 🌟 Daily Habits\n\n' ||
      '- [ ] Practice mindful reflection for 5 minutes (Mental Traits)\n' ||
      '- [ ] Express appreciation to someone important to you (Emotional Traits)\n' ||
      '- [ ] Take one small action toward financial goals (Financial Traits)\n' ||
      '- [ ] Engage in active listening without interrupting (Communication)\n' ||
      '- [ ] Make one health-conscious choice (Physical Traits)\n',
    'version_info', jsonb_build_object(
      'timestamp', now(),
      'source', 'self_assessment',
      'version', 1
    ),
    'metadata', jsonb_build_object(
      'assessment_type', assessment_data.assessment_type,
      'overall_score', assessment_data.overall_score,
      'strengths', strengths,
      'improvements', improvements
    )
  );
  
  -- Return the plan data
  RETURN plan_data;
END;
$$ LANGUAGE plpgsql;

-- Function to create development plan when assessment is completed
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

-- Create trigger to automatically generate development plan on assessment completion
CREATE TRIGGER create_development_plan_on_assessment_insert
  AFTER INSERT ON assessment_history
  FOR EACH ROW
  EXECUTE FUNCTION create_development_plan_on_assessment();