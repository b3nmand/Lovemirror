import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CircularProgress } from '../components/CircularProgress';
<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function DelusionalScore() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
=======
import { DelusionalScoreCard } from '../components/DelusionalScoreCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertCircle, CheckCircle, Info, RefreshCw, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { updatePlanAfterScores } from '@/lib/aiPlanGenerator';
import { InviteAssessor } from '../components/InviteAssessor';

interface CategoryScore {
  category_id: string;
  category_name: string;
  self_score: number;
  external_score: number;
  gap_score: number;
}

export function DelusionalScore() {
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExternalAssessments, setHasExternalAssessments] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  useEffect(() => {
    async function fetchDelusionalScore() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Authentication required');
          return;
        }
<<<<<<< HEAD

        // Fetch external assessment responses
        const { data: externalResponses, error: externalError } = await supabase
          .from('external_assessment_responses')
          .select(`
            *,
            assessor:external_assessors(
              relationship_type,
              user_id
            )
          `)
          .eq('assessor.user_id', user.id);

        if (externalError) throw externalError;

        // Fetch self assessment responses
        const { data: selfResponses, error: selfError } = await supabase
          .from('assessment_responses')
          .select(`
            *,
            assessment:assessments(user_id)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (selfError) throw selfError;

        if (selfResponses && externalResponses) {
          // Calculate average difference between self and external scores
          const differences = [];
          
          for (const selfResponse of selfResponses) {
            const matchingExternal = externalResponses.filter(
              er => er.question_id === selfResponse.question_id
            );
            
            if (matchingExternal.length > 0) {
              const externalAvg = matchingExternal.reduce(
                (sum, er) => sum + er.response_value, 
                0
              ) / matchingExternal.length;
              
              differences.push(Math.abs(selfResponse.response_value - externalAvg));
            }
          }
          
          if (differences.length > 0) {
            const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
            const delusionalScore = Math.max(0, 100 - (avgDifference * 10));
            setScore(delusionalScore);
          } else {
            setError('No matching assessment data found');
          }
        } else {
          setError('No assessment data available');
=======
        
        setUserId(user.id);

        // Check if user has any completed external assessments
        const { data: assessors, error: assessorsError } = await supabase
          .from('external_assessors')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('status', 'completed');

        if (assessorsError) throw assessorsError;
        
        if (!assessors || assessors.length === 0) {
          setHasExternalAssessments(false);
          setError('No external assessments found. Invite friends or family to assess you first.');
          return;
        }
        
        setHasExternalAssessments(true);

        // Calculate delusional score using the database function
        const { data: scores, error: scoresError } = await supabase
          .rpc('calculate_delusional_score', { user_id: user.id });

        if (scoresError) throw scoresError;

        if (scores && scores.length > 0) {
          // Get the overall score from the first row
          setOverallScore(scores[0].overall_delusional_score);
          
          // Format category scores
          const formattedScores = scores.map(score => ({
            category_id: score.category_id,
            category_name: score.category_name,
            self_score: score.self_score,
            external_score: score.external_score,
            gap_score: score.gap_score
          }));
          
          setCategoryScores(formattedScores);
          
          // Update the development plan after delusional score calculation
          await updatePlanAfterScores(user.id);
        } else {
          setError('Could not calculate delusional score. Please try again later.');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        }

      } catch (error) {
        console.error('Error fetching delusional score:', error);
        setError('Failed to load delusional score data');
      } finally {
        setLoading(false);
      }
    }

    fetchDelusionalScore();
  }, []);

<<<<<<< HEAD
=======
  const handleRefreshScore = async () => {
    setCalculating(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication required');
        return;
      }
      
      // Calculate delusional score using the database function
      const { data: scores, error: scoresError } = await supabase
        .rpc('calculate_delusional_score', { user_id: user.id });

      if (scoresError) throw scoresError;

      if (scores && scores.length > 0) {
        // Get the overall score from the first row
        setOverallScore(scores[0].overall_delusional_score);
        
        // Format category scores
        const formattedScores = scores.map(score => ({
          category_id: score.category_id,
          category_name: score.category_name,
          self_score: score.self_score,
          external_score: score.external_score,
          gap_score: score.gap_score
        }));
        
        setCategoryScores(formattedScores);
        
        // Update the development plan after refreshing delusional score
        await updatePlanAfterScores(user.id);
      } else {
        setError('Could not calculate delusional score. Please try again later.');
      }
    } catch (error) {
      console.error('Error refreshing delusional score:', error);
      setError('Failed to refresh delusional score');
    } finally {
      setCalculating(false);
    }
  };

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const getScoreCategory = (score: number | null) => {
    if (score === null) return { label: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    if (score >= 80) return { label: 'Highly Self-Aware', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { label: 'Moderately Self-Aware', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { label: 'Somewhat Delusional', color: 'text-amber-600', bgColor: 'bg-amber-100' };
    return { label: 'Highly Delusional', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

<<<<<<< HEAD
  const category = getScoreCategory(score);
=======
  const category = getScoreCategory(overallScore);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

<<<<<<< HEAD
  if (error) {
=======
  if (error && !hasExternalAssessments) {
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Delusional Score Analysis</CardTitle>
              <CardDescription>
                We couldn't calculate your delusional score at this time
              </CardDescription>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <p className="text-muted-foreground">
                To calculate your delusional score, you need to have both self-assessment data and external assessment data from friends, family, or partners.
              </p>
=======
              <p className="text-muted-foreground mb-4">
                To calculate your delusional score, you need to have both self-assessment data and external assessment data from friends, family, or partners.
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Invite an External Assessor</h3>
                <p className="text-muted-foreground mb-4">
                  Invite someone who knows you well to complete an external assessment for you. This will help generate your Delusional Score.
                </p>
                <InviteAssessor onInviteSent={() => {}} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && hasExternalAssessments) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Delusional Score Analysis</CardTitle>
              <CardDescription>
                We encountered an error calculating your delusional score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                There was a problem processing your assessment data. Please try refreshing your score.
              </p>
              <Button 
                onClick={handleRefreshScore}
                disabled={calculating}
                className="w-full"
              >
                {calculating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Score
                  </>
                )}
              </Button>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
=======
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        <Card className="mb-8">
          <CardHeader>
            <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl text-center">Delusional Score Analysis</CardTitle>
            <CardDescription className="text-center text-lg">
              How aligned is your self-perception with reality?
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            <div className="mb-8">
<<<<<<< HEAD
              <CircularProgress 
                value={score || 0}
                size={200}
                strokeWidth={15}
                color={score !== null ? category.color : undefined}
              />
=======
              {calculating ? (
                <div className="h-[200px] w-[200px] flex items-center justify-center">
                  <RefreshCw className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : (
                <CircularProgress 
                  value={overallScore || 0}
                  size={200}
                  strokeWidth={15}
                  color={overallScore !== null ? category.color : undefined}
                />
              )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </div>
            
            <div className={`${category.bgColor} ${category.color} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
              {category.label}
            </div>
            
            <div className="space-y-4 text-center max-w-md mx-auto">
              <h2 className="text-xl font-semibold">What This Means</h2>
              <p className="text-muted-foreground">
                Your delusional score indicates how well your self-assessment aligns with external feedback
<<<<<<< HEAD
                and objective metrics. A higher score suggests a more realistic self-perception, while a
                lower score might indicate areas where your self-assessment could benefit from adjustment.
              </p>
              
              {score !== null && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Your Score Interpretation</h3>
                  <p className="text-muted-foreground">
                    {score >= 80 ? (
                      "You have a very realistic self-perception. Your assessments align well with external feedback."
                    ) : score >= 60 ? (
                      "Your self-perception is moderately aligned with reality. There might be some areas where your assessment could be more accurate."
                    ) : score >= 40 ? (
=======
                from others. A higher score suggests a more realistic self-perception, while a
                lower score indicates a gap between how you see yourself and how others see you.
              </p>
              
              {overallScore !== null && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Your Score Interpretation</h3>
                  <p className="text-muted-foreground">
                    {overallScore >= 80 ? (
                      "You have a very realistic self-perception. Your assessments align well with external feedback."
                    ) : overallScore >= 60 ? (
                      "Your self-perception is moderately aligned with reality. There might be some areas where your assessment could be more accurate."
                    ) : overallScore >= 40 ? (
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                      "There's a noticeable gap between your self-perception and external feedback. Consider reflecting on how others perceive you."
                    ) : (
                      "There may be a significant gap between your self-perception and reality. Consider seeking external feedback and reflecting on your assessments."
                    )}
                  </p>
                </div>
              )}
<<<<<<< HEAD
=======
              
              <div className="mt-4">
                <Button 
                  onClick={handleRefreshScore}
                  disabled={calculating}
                  variant="outline"
                  className="w-full"
                >
                  {calculating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Score
                    </>
                  )}
                </Button>
              </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </div>
          </CardContent>
          
          <Separator className="my-4" />
          
          <CardFooter>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Regularly seek feedback from trusted friends and family</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Compare your self-assessment with objective metrics when available</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Keep track of your progress and adjust your goals based on realistic expectations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Consider external assessments to get a more balanced perspective</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </CardFooter>
<<<<<<< HEAD
=======
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Invite More External Assessors</CardTitle>
              <CardDescription>
                The more feedback you get, the more accurate your Delusional Score will be.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteAssessor onInviteSent={() => {}} />
            </CardContent>
          </Card>
          
          {/* Category Breakdown */}
          {categoryScores.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl">Category Breakdown</CardTitle>
                <CardDescription>
                  See how your self-perception compares to external feedback in each category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryScores.map((category) => (
                    <DelusionalScoreCard
                      key={category.category_id}
                      categoryName={category.category_name}
                      selfScore={category.self_score}
                      externalScore={category.external_score}
                      gapScore={category.gap_score}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        </Card>
      </div>
    </div>
  );
}