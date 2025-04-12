import { DeepSeek } from 'npm:deepseek-ai@0.9.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface AssessmentData {
  overall_score: number;
  category_scores: Array<{
    category_id: string;
    score: number;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessment_id } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_history')
      .select('*')
      .eq('id', assessment_id)
      .single();

    if (assessmentError) throw assessmentError;

    // Initialize DeepSeek
    const deepseek = new DeepSeek(Deno.env.get('DEEPSEEK_API_KEY')!);

    // Prepare the prompt
    const prompt = `As an AI coach, analyze this assessment data and create a personalized development plan:
    
    Overall Score: ${assessment.overall_score}
    Category Scores: ${JSON.stringify(assessment.category_scores, null, 2)}

    Create a comprehensive development plan with these sections:
    1. Self-Awareness Development
    2. Relationship Compatibility Enhancement
    3. Reality Alignment Strategies

    For each section include:
    - Current status analysis
    - Specific goals
    - Weekly action items
    - Progress metrics
    - Recommended resources
    - Implementation timeline`;

    // Get AI response
    const response = await deepseek.complete({
      prompt,
      max_tokens: 1000,
      temperature: 0.7
    });

    // Parse and structure the AI response
    const developmentPlan = {
      timestamp: new Date().toISOString(),
      assessment_id: assessment_id,
      plan: response.choices[0].text
    };

    // Store the plan in Supabase
    const { error: storageError } = await supabase
      .from('development_plans')
      .upsert({
        assessment_id: assessment_id,
        plan_data: developmentPlan
      });

    if (storageError) throw storageError;

    return new Response(
      JSON.stringify(developmentPlan),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});