import React, { useState, useEffect } from 'react';
import { Users, Brain, AlertCircle } from 'lucide-react';
import { CircularProgress } from './CircularProgress';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AssessmentScoresProps {
  className?: string;
}

export function AssessmentScores({ className = '' }: AssessmentScoresProps) {
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [delusionalScore, setDelusionalScore] = useState<number | null>(null);
  const [completedAssessments, setCompletedAssessments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch completed assessments count
      const { data: assessments, error: assessmentsError } = await supabase
        .from('external_assessors')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (assessmentsError) throw assessmentsError;
      
      const completedCount = assessments?.length || 0;
      setCompletedAssessments(completedCount);

      if (completedCount > 0) {
        // Fetch latest assessment scores
        const { data: scores, error: scoresError } = await supabase
          .from('assessment_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (scoresError) throw scoresError;

        if (scores) {
          setCompatibilityScore(scores.compatibility_score);
          setDelusionalScore(scores.delusional_score);
        }
      }
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError('Failed to load scores');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return '#9CA3AF';
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#EAB308';
    return '#EF4444';
  };

  const handleRequestAssessment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('partner_links')
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Copy invite link to clipboard
      const inviteUrl = `${window.location.origin}/assessment/external/${data.partner_code}`;
      await navigator.clipboard.writeText(inviteUrl);

      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Error generating invite link:', err);
      setError('Failed to generate invite link');
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary" />
            Compatibility Score
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center">
          <CircularProgress
            value={compatibilityScore || 0}
            size={window.innerWidth < 640 ? 100 : 120}
            color={getScoreColor(compatibilityScore)}
            label="Compatibility"
          />
          
          <div className="mt-4 text-center">
            <div className="text-sm text-muted-foreground">
              {completedAssessments} Assessment{completedAssessments !== 1 ? 's' : ''} Completed
            </div>
            
            {completedAssessments === 0 && (
              <Button
                onClick={handleRequestAssessment}
                variant="link"
                className="mt-2"
                size="sm"
              >
                Request Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Brain className="w-5 h-5 mr-2 text-secondary" />
            Delusional Score
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center">
          <CircularProgress
            value={delusionalScore || 0}
            size={window.innerWidth < 640 ? 100 : 120}
            color={getScoreColor(delusionalScore)}
            label="Self-Awareness"
          />
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}