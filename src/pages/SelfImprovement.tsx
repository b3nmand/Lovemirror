import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Brain, Heart, DollarSign, Users, TrendingUp, Calendar, CheckCircle, Crown, Scale, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCachedPlan, cachePlan } from '../lib/cache';
import { calculateImplementationProgress } from '@/lib/planUtils';
import { TaskList } from '@/components/TaskList';
import { DevelopmentPlanRenderer } from '@/components/DevelopmentPlanRenderer';
import type { DevelopmentPlan } from '../types/assessment';

interface AssessmentResult {
  id: string;
  assessment_type: string;
  overall_score: number;
  category_scores: Array<{
    category_id: string;
    score: number;
  }>;
  created_at: string;
}

interface DevelopmentPlan {
  plan: string;
}

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
  const [activeTab, setActiveTab] = useState('plan');
  const [implementationProgress, setImplementationProgress] = useState(0);

  useEffect(() => {
    fetchAssessmentData();
  }, []);

  useEffect(() => {
    // Calculate implementation progress
    if (developmentPlan?.plan) {
      const progress = calculateImplementationProgress(developmentPlan.plan);
      setImplementationProgress(progress);
    }
  }, [developmentPlan]);

  const handlePlanUpdate = (updatedPlan: string) => {
    if (developmentPlan) {
      const newPlan = { ...developmentPlan, plan: updatedPlan };
      setDevelopmentPlan(newPlan);
      
      // Update cache
      if (assessmentResults.length > 0) {
        cachePlan(assessmentResults[0].id, newPlan);
      }
      
      // Calculate new progress
      const progress = calculateImplementationProgress(updatedPlan);
      setImplementationProgress(progress);
    }
  };

  const fetchDevelopmentPlan = async (assessmentId: string) => {
    setPlanLoading(true);
    try {
      // Check cache first
      const cachedPlan = getCachedPlan(assessmentId);
      if (cachedPlan) {
        setDevelopmentPlan(cachedPlan);
        return;
      }

      // Fetch from database if not in cache
      const { data: plan, error: planError } = await supabase
        .from('development_plans')
        .select('plan_data')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!planError && plan?.plan_data) {
        const planData = typeof plan.plan_data === 'string' ? 
          JSON.parse(plan.plan_data) : 
          plan.plan_data;
        
        setDevelopmentPlan(planData);
        cachePlan(assessmentId, planData);
      }
    } catch (err) {
      console.error('Error fetching development plan:', err);
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

      // Fetch existing development plan if it exists
      if (results?.length > 0) {
        await fetchDevelopmentPlan(results[0].id);
      }
    } catch (err) {
      console.error('Error fetching assessment data:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

        {assessmentResults.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-none mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                {activeTab === 'plan' && (
                  <>
                    <CardTitle className="text-2xl flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-primary" />
                      AI Development Plan
                    </CardTitle>
                    <Button
                      onClick={() => generateAIPlan(assessmentResults[0].id)}
                      disabled={generating}
                      variant={generating ? "secondary" : "default"}
                      className="bg-gradient-to-r from-primary-500 to-secondary-500"
                    >
                      <RefreshCw className={`w-5 h-5 mr-2 ${generating ? 'animate-spin' : ''}`} />
                      {generating ? 'Generating...' : 'Generate New Plan'}
                    </Button>
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                          </div>
                        ) : (
                          <DevelopmentPlanRenderer planData={developmentPlan.plan} />
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        {generating ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p>Generating your personalized development plan...</p>
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
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
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
                      <CardHeader>
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

                    <Card>
                      <CardHeader>
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

            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <Button
                  onClick={handleStartGoalTracker}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:opacity-90"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Goal Tracker
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
        )}
      </div>
    </div>
  );
}