import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CircularProgress } from '../components/CircularProgress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function DelusionalScore() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDelusionalScore() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Authentication required');
          return;
        }

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

  const getScoreCategory = (score: number | null) => {
    if (score === null) return { label: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    if (score >= 80) return { label: 'Highly Self-Aware', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { label: 'Moderately Self-Aware', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { label: 'Somewhat Delusional', color: 'text-amber-600', bgColor: 'bg-amber-100' };
    return { label: 'Highly Delusional', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const category = getScoreCategory(score);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
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
              <p className="text-muted-foreground">
                To calculate your delusional score, you need to have both self-assessment data and external assessment data from friends, family, or partners.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
              <CircularProgress 
                value={score || 0}
                size={200}
                strokeWidth={15}
                color={score !== null ? category.color : undefined}
              />
            </div>
            
            <div className={`${category.bgColor} ${category.color} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
              {category.label}
            </div>
            
            <div className="space-y-4 text-center max-w-md mx-auto">
              <h2 className="text-xl font-semibold">What This Means</h2>
              <p className="text-muted-foreground">
                Your delusional score indicates how well your self-assessment aligns with external feedback
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
                      "There's a noticeable gap between your self-perception and external feedback. Consider reflecting on how others perceive you."
                    ) : (
                      "There may be a significant gap between your self-perception and reality. Consider seeking external feedback and reflecting on your assessments."
                    )}
                  </p>
                </div>
              )}
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
        </Card>
      </div>
    </div>
  );
}