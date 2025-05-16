import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Target, Brain, Heart, DollarSign, Users, TrendingUp, Calendar, CheckCircle, Crown, Scale, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
=======
import { Target, Brain, Heart, DollarSign, Users, TrendingUp, Calendar, CheckCircle, Crown, Scale, RefreshCw, AlertCircle, Sparkles, Download } from 'lucide-react';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { supabase } from '../lib/supabase';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
<<<<<<< HEAD
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
=======
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { connectionManager } from '@/lib/connectionManager';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCachedPlan, cachePlan } from '../lib/cache';
import { calculateImplementationProgress } from '@/lib/planUtils';
import { TaskList } from '@/components/TaskList';
import { DevelopmentPlanRenderer } from '@/components/DevelopmentPlanRenderer';
<<<<<<< HEAD
import type { DevelopmentPlan } from '../types/assessment';

=======
import { generateAIPlan, updatePlanAfterScores } from '@/lib/aiPlanGenerator';
import { checkSubscriptionByCustomerId } from '@/lib/subscriptionUtils';
import type { DevelopmentPlan } from '../types/assessment';

interface CategoryScore {
  category_id: string;
  category_name: string;
  score: number;
}

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
interface AssessmentResult {
  id: string;
  assessment_type: string;
  overall_score: number;
<<<<<<< HEAD
  category_scores: Array<{
    category_id: string;
    score: number;
  }>;
  created_at: string;
}

interface DevelopmentPlan {
  plan: string;
}
=======
  category_scores: CategoryScore[];
  created_at: string;
}

type TabValue = 'plan' | 'progress' | 'insights';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

export function SelfImprovement() {
  const navigate = useNavigate();
  const [planLoading, setPlanLoading] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [developmentPlan, setDevelopmentPlan] = useState<DevelopmentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [retakeDate, setRetakeDate] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('plan');
  const [implementationProgress, setImplementationProgress] = useState(0);

  useEffect(() => {
=======
  const [activeTab, setActiveTab] = useState<TabValue>('plan');
  const [implementationProgress, setImplementationProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [generatingGoals, setGeneratingGoals] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    fetchAssessmentData();
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    // Calculate implementation progress
=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    if (developmentPlan?.plan) {
      const progress = calculateImplementationProgress(developmentPlan.plan);
      setImplementationProgress(progress);
    }
  }, [developmentPlan]);

<<<<<<< HEAD
=======
  const checkSubscriptionStatus = async () => {
    try {
      setCheckingSubscription(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      let subscriptionActive = false;
      try {
        subscriptionActive = await checkSubscriptionByCustomerId(user.id);
      } catch (error: unknown) {
        console.error('Error checking subscription:', error);
        subscriptionActive = true; // Default to true in case of errors
      }
      
      setHasSubscription(subscriptionActive);
    } catch (error: unknown) {
      console.error('Error checking subscription status:', error);
      setHasSubscription(true); // Default to true in case of errors
    } finally {
      setCheckingSubscription(false);
    }
  };

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const handlePlanUpdate = (updatedPlan: string) => {
    if (developmentPlan) {
      const newPlan = { ...developmentPlan, plan: updatedPlan };
      setDevelopmentPlan(newPlan);
      
<<<<<<< HEAD
      // Update cache
=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      if (assessmentResults.length > 0) {
        cachePlan(assessmentResults[0].id, newPlan);
      }
      
<<<<<<< HEAD
      // Calculate new progress
=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      const progress = calculateImplementationProgress(updatedPlan);
      setImplementationProgress(progress);
    }
  };

  const fetchDevelopmentPlan = async (assessmentId: string) => {
    setPlanLoading(true);
    try {
<<<<<<< HEAD
      // Check cache first
      const cachedPlan = getCachedPlan(assessmentId);
      if (cachedPlan) {
=======
      console.log('Fetching development plan for assessment ID:', assessmentId);
      const cachedPlan = getCachedPlan(assessmentId);
      if (cachedPlan) {
        console.log('Using cached plan');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        setDevelopmentPlan(cachedPlan);
        return;
      }

<<<<<<< HEAD
      // Fetch from database if not in cache
=======
      console.log('No cached plan found, checking database...');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      const { data: plan, error: planError } = await supabase
        .from('development_plans')
        .select('plan_data')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

<<<<<<< HEAD
      if (!planError && plan?.plan_data) {
=======
      if (planError) {
        console.error('Error fetching development plan:', planError);
        throw planError;
      }

      if (plan?.plan_data) {
        console.log('Found plan in database');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        const planData = typeof plan.plan_data === 'string' ? 
          JSON.parse(plan.plan_data) : 
          plan.plan_data;
        
        setDevelopmentPlan(planData);
        cachePlan(assessmentId, planData);
<<<<<<< HEAD
      }
    } catch (err) {
      console.error('Error fetching development plan:', err);
=======
      } else if (hasSubscription) {
        // If no plan found but user has subscription, generate one
        console.log("No plan found but user has subscription. Auto-generating plan...");
        await generatePlan(assessmentId);
      } else {
        console.log('No plan found and user has no subscription');
      }
    } catch (error: unknown) {
      console.error('Error fetching development plan:', error);
      setError('Failed to load development plan. Please try generating a new one.');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } finally {
      setPlanLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
<<<<<<< HEAD
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const generateAIPlan = useCallback(async (assessmentId: string) => {
    setGenerating(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessment_id: assessmentId })
      });

      if (!response.ok) throw new Error('Failed to generate AI plan');
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error || 'Failed to generate plan');
      }
      
      // Ensure we have a string for the plan
      const planContent = typeof data.plan === 'string' ? data.plan : JSON.stringify(data.plan);
      cachePlan(assessmentId, { plan: planContent });
      setDevelopmentPlan({ plan: planContent });

    } catch (err) {
      console.error('Error generating AI plan:', err.message);
      setError('Failed to generate AI development plan');
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleStartGoalTracker = () => {
=======
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
    }
  };

  // Function to generate AI plan
  const generatePlan = useCallback(async (assessmentId: string) => {
    if (!hasSubscription) {
      setError("You need a subscription to generate AI development plans.");
      return;
    }

    setGenerating(true);
    setError('');
    console.log('Generating AI plan for assessment ID:', assessmentId, 'retry count:', retryCount);
    
    try {
      // Check connection first
      const isConnected = await connectionManager.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection error. Please check your internet connection and try again.');
      }
      
      // Get assessment data first
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (assessmentError || !assessment) {
        throw new Error('Failed to fetch assessment data');
      }

      // Check if assessment is complete
      if (!assessment.completed_at) {
        throw new Error('Assessment must be completed before generating a plan');
      }
      
      // Check if a plan already exists in the database
      const { data: existingPlan } = await supabase
        .from('development_plans')
        .select('plan_data')
        .eq('assessment_id', assessmentId)
        .maybeSingle();
      
      // If a plan exists but is empty or invalid, delete it to force regeneration
      if (existingPlan?.plan_data) {
        const planContent = typeof existingPlan.plan_data === 'string' 
          ? existingPlan.plan_data 
          : existingPlan.plan_data.plan;
          
        if (!planContent || planContent === '') {
          console.log('Found empty plan, deleting it to force regeneration');
          await supabase
            .from('development_plans')
            .delete()
            .eq('assessment_id', assessmentId);
        } else {
          // Use existing plan
          const planData = typeof existingPlan.plan_data === 'string' 
            ? JSON.parse(existingPlan.plan_data) 
            : existingPlan.plan_data;
          setDevelopmentPlan(planData);
          cachePlan(assessmentId, planData);
          return;
        }
      }
      
      // Generate new plan
      const planData = await generateAIPlan(assessmentId);
      
      if (!planData || !planData.plan) {
        throw new Error('Failed to generate valid plan data');
      }
      
      // Store the plan in the database
      const { error: storeError } = await supabase
        .from('development_plans')
        .insert({
          assessment_id: assessmentId,
          plan_data: planData,
          created_at: new Date().toISOString()
        });
        
      if (storeError) {
        console.error('Error storing plan:', storeError);
        // Continue anyway since we have the plan in memory
      }
      
      setDevelopmentPlan(planData);
      cachePlan(assessmentId, planData);
      setRetryCount(0);
      
    } catch (error: unknown) {
      console.error('Error generating AI plan:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to generate development plan. Please try again.');
      }
      
      // Retry with exponential backoff
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => generatePlan(assessmentId), delay);
      }
    } finally {
      setGenerating(false);
    }
  }, [hasSubscription, retryCount]);

  const handleGenerateGoals = async () => {
    if (!assessmentResults.length || !developmentPlan) return;
    
    setGeneratingGoals(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      // Call the RPC function to generate goals
      const { data, error } = await supabase.rpc(
        'generate_goals_from_plan',
        { 
          p_user_id: user.id,
          p_plan_data: developmentPlan
        }
      );
      
      if (error) throw error;
      
      console.log('Generated goals:', data);
      
      // Navigate to goals page
      return data;
    } catch (error: unknown) {
      console.error('Error generating goals:', error);
      setError('Failed to generate goals. Please try again.');
    } finally {
      setGeneratingGoals(false);
    }
  };
  
  const handleGoToGoals = async () => {
    await handleGenerateGoals();
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    navigate('/goals');
  };

  useEffect(() => {
    if (assessmentResults.length > 0) {
      const lastAssessmentDate = new Date(assessmentResults[0].created_at);
      const retakeDate = new Date(lastAssessmentDate);
      retakeDate.setDate(retakeDate.getDate() + 90);
      setRetakeDate(retakeDate.toLocaleDateString());
    }
  }, [assessmentResults]);

  const fetchAssessmentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      await fetchUserProfile();

      const { data: results, error: resultsError } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (resultsError) throw resultsError;
      setAssessmentResults(results || []);

<<<<<<< HEAD
      // Fetch existing development plan if it exists
      if (results?.length > 0) {
        await fetchDevelopmentPlan(results[0].id);
      }
    } catch (err) {
      console.error('Error fetching assessment data:', err);
=======
      if (results?.length > 0) {
        console.log('Found assessment results, fetching development plan...');
        // Fetch existing development plan
        await fetchDevelopmentPlan(results[0].id);
      }
    } catch (error: unknown) {
      console.error('Error fetching assessment data:', error);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  if (loading) {
=======
  const getPlanContent = () => {
    if (!developmentPlan?.plan) return '';
    const content = typeof developmentPlan.plan === 'string' ?
      developmentPlan.plan :
      JSON.stringify(developmentPlan.plan, null, 2);
    
    return content;
  };

  const downloadResults = async () => {
    if (!assessmentResults.length || !developmentPlan) return;

    try {
      // Create the content for the file
      const content = `Assessment Results
==================
Date: ${new Date(assessmentResults[0].created_at).toLocaleDateString()}
Overall Score: ${assessmentResults[0].overall_score.toFixed(1)}%

Category Scores:
${assessmentResults[0].category_scores.map(cs => 
  `- ${cs.category_name}: ${cs.score.toFixed(1)}%`
).join('\n')}

Development Plan
===============
${developmentPlan.plan}

Generated on: ${new Date().toLocaleString()}
`;

      // Create a blob with the content
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `assessment-results-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error downloading results:', error.message);
      } else {
        console.error('Error downloading results:', error);
      }
      setError('Failed to download results. Please try again.');
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'plan' || value === 'progress' || value === 'insights') {
      setActiveTab(value as TabValue);
    }
  };

  if (loading || checkingSubscription) {
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

<<<<<<< HEAD
  // Ensure plan is always a string before passing to marked
  const getPlanContent = () => {
    if (!developmentPlan?.plan) return '';
    return typeof developmentPlan.plan === 'string' ? 
      developmentPlan.plan : 
      JSON.stringify(developmentPlan.plan, null, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
=======
  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
            <CardHeader>
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl">Premium Feature</CardTitle>
              <CardDescription className="text-lg">
                AI Development Plans are available exclusively to premium members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Subscribe to unlock AI-powered development plans that provide personalized guidance 
                based on your assessment results and help you improve your relationship value.
              </p>
              <Button
                onClick={() => navigate('/dashboard?showSubscription=true')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                size="lg"
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <div className="relative">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              {implementationProgress > 0 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24">
                  <Progress value={implementationProgress} className="h-1" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">Self-Improvement Lab</CardTitle>
            <CardDescription className="text-lg">
              Your personalized development journey based on assessment insights
            </CardDescription>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

<<<<<<< HEAD
        {assessmentResults.length > 0 && (
=======
        {assessmentResults.length > 0 ? (
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          <Card className="bg-white/80 backdrop-blur-sm border-none mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                {activeTab === 'plan' && (
                  <>
                    <CardTitle className="text-2xl flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-primary" />
                      AI Development Plan
                    </CardTitle>
<<<<<<< HEAD
                    <Button
                      onClick={() => generateAIPlan(assessmentResults[0].id)}
                      disabled={generating}
                      variant={generating ? "secondary" : "default"}
                      className="bg-gradient-to-r from-primary-500 to-secondary-500"
                    >
                      <RefreshCw className={`w-5 h-5 mr-2 ${generating ? 'animate-spin' : ''}`} />
                      {generating ? 'Generating...' : 'Generate New Plan'}
                    </Button>
=======
                    <div className="flex gap-2">
                      <Button
                        onClick={downloadResults}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Results
                      </Button>
                      <Button
                        onClick={() => generatePlan(assessmentResults[0].id)}
                        disabled={generating}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                      >
                        <RefreshCw className={`w-5 h-5 mr-2 ${generating ? 'animate-spin' : ''}`} />
                        {generating ? 'Generating...' : 'Generate New Plan'}
                      </Button>
                    </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                  </>
                )}
                {activeTab === 'progress' && (
                  <CardTitle className="text-2xl flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                    Implementation Progress
                  </CardTitle>
                )}
                {activeTab === 'insights' && (
                  <CardTitle className="text-2xl flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-primary" />
                    AI Insights
                  </CardTitle>
                )}
              </div>
              <CardDescription>
                Based on your {profile?.gender === 'male' ? 'High-Value Man' : 
                  (profile?.region === 'africa' && profile?.cultural_context === 'african' ? 
                    'Bridal Price' : 'Wife Material')} assessment score: {assessmentResults[0].overall_score.toFixed(1)}%
              </CardDescription>
            </CardHeader>

            <CardContent>
<<<<<<< HEAD
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
=======
              <Tabs 
                defaultValue="plan" 
                className="w-full" 
                onValueChange={handleTabChange}
              >
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                  <TabsTrigger value="plan">Development Plan</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="plan" className="mt-4">
                  <ScrollArea className="h-[500px] w-full pr-4">
                    {developmentPlan ? (
                      <>
                        {planLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
<<<<<<< HEAD
                          </div>
                        ) : (
                          <DevelopmentPlanRenderer planData={developmentPlan.plan} />
=======
                            <span className="ml-3">Loading plan...</span>
                          </div>
                        ) : (
                          <DevelopmentPlanRenderer planData={developmentPlan} />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        {generating ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p>Generating your personalized development plan...</p>
<<<<<<< HEAD
=======
                            <p className="text-xs text-muted-foreground">This may take a moment...</p>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                          </div>
                        ) : (
                          <>
                            <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Click the button above to generate your personalized development plan</p>
                          </>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="progress" className="mt-4">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg p-6">
<<<<<<< HEAD
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
=======
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                        <Target className="w-5 h-5 mr-2 text-primary" />
                        Implementation Progress
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{Math.round(implementationProgress)}%</span>
                        </div>
                        <Progress value={implementationProgress} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Tasks Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">
                            {getPlanContent().match(/- \[x\]/g)?.length || 0}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Tasks Remaining</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-secondary">
                            {getPlanContent().match(/- \[ \]/g)?.length || 0}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Days Active</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-accent">
                            {Math.ceil((Date.now() - new Date(assessmentResults[0].created_at).getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {developmentPlan && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                          Task Tracking
                        </h3>
                        <TaskList 
                          planData={developmentPlan.plan} 
                          onTaskUpdate={handlePlanUpdate}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="mt-4">
                  <div className="space-y-6">
                    <Card>
<<<<<<< HEAD
                      <CardHeader>
=======
                      <CardHeader className="pb-3">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                        <CardTitle>Growth Trajectory</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Based on your implementation progress and assessment scores, 
                          you're on track to achieve significant improvements in your 
                          relationship value metrics.
                        </p>
                      </CardContent>
                    </Card>

<<<<<<< HEAD
                    <Card>
                      <CardHeader>
=======
                    <Card className="mt-4">
                      <CardHeader className="pb-3">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                        <CardTitle>Key Focus Areas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {assessmentResults[0].category_scores
                            .sort((a, b) => a.score - b.score)
                            .slice(0, 3)
                            .map((category, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                                {category.category_id}
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
<<<<<<< HEAD

            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <Button
                  onClick={handleStartGoalTracker}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:opacity-90"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Goal Tracker
=======
            
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <Button
                  onClick={handleGoToGoals}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                  disabled={generatingGoals}
                >
                  {generatingGoals ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Goals...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      Generate Goals
                    </>
                  )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                </Button>
                
                {retakeDate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Retake available: {retakeDate}</span>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
<<<<<<< HEAD
=======
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No Assessments Found</h3>
              <p className="text-muted-foreground mb-6">
                You need to complete an assessment before you can access your personalized development plan.
              </p>
              <Button 
                onClick={() => navigate('/assessment')}
                className="bg-gradient-to-r from-pink-500 to-purple-500"
              >
                Take Assessment
              </Button>
            </CardContent>
          </Card>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        )}
      </div>
    </div>
  );
}