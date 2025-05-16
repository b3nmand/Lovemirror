import { supabase } from './supabase';
import { cachePlan } from './cache';
import { connectionManager } from './connectionManager';

/**
 * Generates an AI development plan for the given assessment
 * @param assessmentId - The ID of the assessment to generate a plan for
 * @returns A promise that resolves to the generated plan data
 */
export async function generateAIPlan(assessmentId: string): Promise<any> {
  try {
    console.log('Generating AI plan for assessment ID:', assessmentId);
    
    // Check if we're offline
    if (connectionManager.isOffline()) {
      throw new Error('You appear to be offline. Please check your internet connection and try again.');
    }
    
    // Check if we have the necessary environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing');
    }
    
    // Implement retry logic with exponential backoff
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempt ${retryCount + 1}/${maxRetries} to generate AI plan`);
        
        // First check if a plan already exists in the database
        const { data: existingPlan, error: existingPlanError } = await supabase
          .from('development_plans')
          .select('plan_data')
          .eq('assessment_id', assessmentId)
          .maybeSingle();
        
        if (!existingPlanError && existingPlan?.plan_data) {
          console.log('Found existing plan in database, returning it');
          const planData = typeof existingPlan.plan_data === 'string' 
            ? JSON.parse(existingPlan.plan_data) 
            : existingPlan.plan_data;
          
          // Cache the plan locally
          cachePlan(assessmentId, planData);
          
          return planData;
        }
        
        // Call the AI coach edge function
        const response = await fetch(`${supabaseUrl}/functions/v1/ai-coach`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'X-Client-Info': 'love-mirror-web',
          },
          body: JSON.stringify({ 
            assessment_id: assessmentId,
            action: 'generate_plan',
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          // Try to parse error response
          let errorMessage = `HTTP error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
          }
          
          // If we get a 500 error, try to use the fallback plan
          if (response.status === 500) {
            console.log('AI service error, checking for fallback plan...');
            
            // Check again for a plan that might have been created by the fallback trigger
            const { data: fallbackPlan, error: fallbackError } = await supabase
              .from('development_plans')
              .select('plan_data')
              .eq('assessment_id', assessmentId)
              .maybeSingle();
            
            if (!fallbackError && fallbackPlan?.plan_data) {
              console.log('Found fallback plan, returning it');
              const planData = typeof fallbackPlan.plan_data === 'string' 
                ? JSON.parse(fallbackPlan.plan_data) 
                : fallbackPlan.plan_data;
              
              // Cache the plan locally
              cachePlan(assessmentId, planData);
              
              return planData;
            }
          }
          
          throw new Error(errorMessage);
        }
        
        // Parse the response
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Invalid response from AI service');
        }
        
        if (data.error) {
          throw new Error(data.error || 'Failed to generate plan');
        }
        
        console.log('AI plan response received:', data);
        
        // Store the plan version/timestamp for tracking updates
        const planVersion = {
          timestamp: new Date().toISOString(),
          source: 'self_assessment',
          version: 1
        };
        
        // Add version info to the plan data
        if (typeof data === 'object' && data !== null) {
          data.version_info = planVersion;
        }
        
        // Cache the plan locally
        cachePlan(assessmentId, data);
        
        return data;
      } catch (err) {
        console.error(`Attempt ${retryCount + 1} failed:`, err);
        lastError = err instanceof Error ? err : new Error(String(err));
        
        // If this is not the last retry, wait before trying again
        if (retryCount < maxRetries - 1) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
        } else {
          // This was the last retry, try to get a fallback plan
          console.log('All retries failed, checking for fallback plan...');
          
          // Check one last time for a fallback plan
          const { data: fallbackPlan, error: fallbackError } = await supabase
            .from('development_plans')
            .select('plan_data')
            .eq('assessment_id', assessmentId)
            .maybeSingle();
          
          if (!fallbackError && fallbackPlan?.plan_data) {
            console.log('Found fallback plan after retries, returning it');
            const planData = typeof fallbackPlan.plan_data === 'string' 
              ? JSON.parse(fallbackPlan.plan_data) 
              : fallbackPlan.plan_data;
            
            // Cache the plan locally
            cachePlan(assessmentId, planData);
            
            return planData;
          }
          
          // If no fallback plan, throw the error
          throw lastError;
        }
      }
    }
    
    // This should never be reached due to the throw in the last iteration of the loop
    throw new Error('Failed to generate AI plan after multiple attempts');
  } catch (err) {
    console.error('Error generating AI plan:', err);
    throw err;
  }
}

/**
 * Updates the development plan after scores are calculated
 * @param userId - The ID of the user
 * @returns A promise that resolves with the updated plan
 */
export async function updatePlanAfterScores(userId: string): Promise<any> {
  try {
    console.log('Updating plan after scores for user:', userId);
    
    // Check if we're offline
    if (connectionManager.isOffline()) {
      throw new Error('You appear to be offline. Please check your internet connection and try again.');
    }
    
    // Get the latest assessment
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessment_history')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (assessmentError) throw assessmentError;
    if (!assessments || assessments.length === 0) return null;

    // Generate new plan
    return await generateAIPlan(assessments[0].id);
  } catch (err) {
    console.error('Error updating plan after scores:', err);
    throw err;
  }
}

/**
 * Generates goals from a development plan
 * @param userId - The ID of the user
 * @param planData - The development plan data
 * @returns A promise that resolves with the generated goals
 */
export async function generateGoalsFromPlan(userId: string, planData: any): Promise<any> {
  try {
    console.log('Generating goals from plan for user:', userId);
    
    // Check if we're offline
    if (connectionManager.isOffline()) {
      throw new Error('You appear to be offline. Please check your internet connection and try again.');
    }
    
    // Call the RPC function to generate goals
    const { data, error } = await supabase.rpc(
      'generate_goals_from_plan',
      { 
        p_user_id: userId,
        p_plan_data: planData
      }
    );
    
    if (error) throw error;
    
    console.log('Generated goals:', data);
    return data;
  } catch (err) {
    console.error('Error generating goals from plan:', err);
    throw err;
  }
}