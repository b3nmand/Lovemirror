import OpenAI from 'npm:openai@4.28.0';
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
    console.log('Received request for assessment ID:', assessment_id);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch assessment data
    console.log('Fetching assessment data...');
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_history')
      .select('*')
      .eq('id', assessment_id)
      .single();

    if (assessmentError) {
      console.error('Error fetching assessment:', assessmentError);
      throw assessmentError;
    }
    
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    
    console.log('Assessment found:', assessment.id);
    
    // Fetch categories separately
    const categoryIds = assessment.category_scores.map((score: any) => score.category_id);
    console.log('Fetching categories for IDs:', categoryIds);
    
    const { data: categories, error: categoriesError } = await supabase
      .from('unified_assessment_categories')
      .select('id, name, description')
      .in('id', categoryIds);
      
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw categoriesError;
    }
    
    console.log('Categories found:', categories.length);

    // Initialize OpenAI client
    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!,
    });
    
    // Map categories to scores
    const categoryScores = assessment.category_scores.map((score: any) => {
      const category = categories.find((c: any) => c.id === score.category_id) || {
        name: 'Unknown Category',
        description: 'Category details not available'
      };
      
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
    
    console.log('Prepared assessment data with strengths and improvements');

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

    console.log('Sending request to OpenAI...');
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
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500,
      frequency_penalty: 0.5,
      presence_penalty: 0.3
    });
    
    console.log('Received response from OpenAI');

    const developmentPlan = {
      timestamp: new Date().toISOString(),
      assessment_id: assessment_id,
      plan: chatCompletion.choices[0].message.content || ''
    };
    
    console.log('Plan generated successfully, storing in database...');

    // Store the plan in Supabase
    const { error: storageError } = await supabase
      .from('development_plans')
      .upsert({
        assessment_id: assessment_id,
        plan_data: developmentPlan
      });

    if (storageError) {
      console.error('Error storing plan:', storageError);
      throw storageError;
    }
    
    console.log('Plan stored successfully');

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
    console.error('AI Coach Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate development plan'
      }),
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