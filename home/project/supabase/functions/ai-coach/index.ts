<<<<<<< HEAD
import { DeepSeek } from 'npm:deepseek-ai@0.9.0';
=======
import OpenAI from 'npm:openai@4.28.0';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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

<<<<<<< HEAD
    // Fetch assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_history')
      .select('*')
=======
    // Fetch assessment data with category names
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_history')
      .select(`
        *,
        category_scores,
        unified_assessment_categories!inner(
          name,
          description
        )
      `)
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      .eq('id', assessment_id)
      .single();

    if (assessmentError) throw assessmentError;

<<<<<<< HEAD
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
=======
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!,
    });

    // Prepare assessment data with category names
    const categoryScores = assessment.category_scores.map((score: any) => {
      const category = assessment.unified_assessment_categories.find(
        (c: any) => c.id === score.category_id
      );
      return {
        category: category.name,
        score: score.score,
        description: category.description
      };
    });

    // Sort categories by score to identify strengths and areas for improvement
    const sortedScores = [...categoryScores].sort((a, b) => b.score - a.score);
    const strengths = sortedScores.slice(0, 2);
    const improvements = sortedScores.slice(-2);

    // Create a focused, actionable prompt
    const prompt = `Create a clear, actionable development plan based on this assessment:

Overall Score: ${assessment.overall_score}%

Top Strengths:
${strengths.map(s => `- ${s.category} (${s.score}%)`).join('\n')}

Areas for Improvement:
${improvements.map(s => `- ${s.category} (${s.score}%)`).join('\n')}

Format the plan in markdown with these sections:

# 🎯 30-Day Action Plan

List 3-5 specific, measurable actions for each improvement area. Each action should:
- Be clearly defined
- Have a specific timeframe
- Include measurable outcomes
- Start with a checkbox for tracking

# 💪 Building on Strengths

For each strength:
- One paragraph explaining how to leverage it
- 2-3 specific ways to use it to support growth in weaker areas

# 📈 Progress Tracking

For each improvement area:
- Weekly milestones
- Success indicators
- Potential obstacles and solutions

# 🌟 Daily Habits

List 5 specific daily habits that will drive improvement, formatted as:
- [ ] Habit description (focus area)

Keep the language clear, direct, and actionable. Focus on practical steps rather than theory.`;

    // Get AI response with specific parameters for clarity
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a precise, practical relationship development coach. Focus on clear, actionable advice without fluff or theory. Use simple language and specific examples."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 1500,
      frequency_penalty: 0.5,
      presence_penalty: 0.3
    });

    const developmentPlan = {
      timestamp: new Date().toISOString(),
      assessment_id: assessment_id,
      plan: chatCompletion.choices[0].message.content || ''
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
<<<<<<< HEAD
    return new Response(
      JSON.stringify({ error: error.message }),
=======
    console.error('AI Coach Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate development plan'
      }),
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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