import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, RefreshCw, Users, Brain, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';
import { DelusionalScoreCard } from '../components/DelusionalScoreCard';
import { InviteAssessor } from '../components/InviteAssessor';
import { ProgressChart } from '../components/ProgressChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Profile {
  gender: string;
  region: string;
  culturalContext: string;
}

interface Assessment {
  id: string;
  mode: string;
  overall_score: number;
  created_at: string;
}

interface CategoryScore {
  name: string;
  score: number;
  externalScore?: number;
  gapScore?: number;
  weight: number;
}

export function Results() {
  const navigate = useNavigate();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [progressData, setProgressData] = useState<{ date: string; score: number; }[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7' | '30' | '90'>('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get assessment ID from URL params
    const id = location.pathname.split('/').pop();
    setAssessmentId(id);

    fetchResults();
  }, [assessmentId]);

  const fetchProgressData = async (userId: string, assessmentType: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_progress', {
          p_user_id: userId,
          p_assessment_type: assessmentType,
          p_days: parseInt(selectedTimeframe)
        });

      if (error) throw error;

      setProgressData(data.map((item: any) => ({
        date: item.date,
        score: item.overall_score
      })));
    } catch (err) {
      console.error('Error fetching progress data:', err);
    }
  };

  const fetchResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      if (!assessmentId) {
        // If no assessment ID, fetch latest assessment
        const { data: latestAssessment, error: latestError } = await supabase
          .from('assessment_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (latestError) {
          console.error('Error fetching latest assessment:', latestError);
          navigate('/dashboard');
          return;
        }

        if (!latestAssessment) {
          navigate('/dashboard');
          return;
        }

        setAssessment(latestAssessment);
        setAssessmentId(latestAssessment.id);
      } else {
        // Fetch specific assessment
        const { data: specificAssessment, error: specificError } = await supabase
          .from('assessment_history')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (specificError) {
          console.error('Error fetching specific assessment:', specificError);
          navigate('/dashboard');
          return;
        }

        if (!specificAssessment) {
          navigate('/dashboard');
          return;
        }

        setAssessment(specificAssessment);
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('gender, region, cultural_context')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Determine assessment type based on profile
      let assessmentType = 'high-value';
      if (profileData.gender === 'female') {
        assessmentType = profileData.region === 'africa' && 
                        profileData.cultural_context === 'african'
          ? 'bridal-price'
          : 'wife-material';
      }

      // Fetch progress data
      await fetchProgressData(user.id, assessmentType);

      // Fetch all scores (self and external)
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      const [selfScores, externalScores] = await Promise.all([
        supabase
          .from('assessment_scores')
          .select('*')
          .eq('assessment_id', assessmentData.id)
          .eq('type_id', 'self'),
        supabase
          .from('assessment_scores')
          .select('*')
          .eq('assessment_id', assessmentData.id)
          .eq('type_id', 'delusional'),
      ]);

      if (selfScores.error) throw selfScores.error;
      if (externalScores.error) throw externalScores.error;

      // Calculate category scores
      const scores = categories.map(category => {
        const selfScore = selfScores.data.find(s => s.category_id === category.id)?.score || 0;
        const externalScore = externalScores.data.find(s => s.category_id === category.id);
        const color_code = category.weight >= 80 ? '#22C55E' : 
                          category.weight >= 60 ? '#EAB308' : '#EF4444';
        
        return {
          name: category.name,
          score: selfScore,
          externalScore: externalScore?.score || 0,
          gapScore: externalScore?.gap_score || 0,
          weight: category.weight,
          color_code: color_code,
        };
      });

      setCategoryScores(scores);
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentTitle = () => {
    if (!profile || !assessment) return '';

    if (profile.gender === 'male') {
      return 'High-Value Man Assessment';
    } else if (profile.gender === 'female') {
      if (profile.region === 'africa' && profile.culturalContext === 'african') {
        return 'Bridal Price Estimation';
      } else {
        return 'Wife Material Assessment';
      }
    }
    return 'Relationship Assessment';
  };

  const getValueCategory = (score: number) => {
    if (score >= 70) return 'High Value';
    if (score >= 50) return 'Moderate Value';
    return 'Needs Improvement';
  };

  const calculateBridalPrice = (score: number) => {
    // This is a placeholder calculation - adjust based on regional standards
    const basePrice = 10000; // Base price in USD
    const multiplier = score / 50; // Score affects price
    return basePrice * multiplier;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          <Card>
            <CardHeader className="text-center">
              <Award className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <CardTitle className="text-3xl">
                {getAssessmentTitle()}
              </CardTitle>
              <CardDescription>
                Your assessment results are ready
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-pink-500 mb-2">
                      {assessment?.overall_score.toFixed(1)}%
                    </div>
                    <div className="text-gray-600">
                      Category: {getValueCategory(assessment?.overall_score || 0)}
                    </div>
                    {profile?.gender === 'female' &&
                    profile?.region === 'africa' &&
                    profile?.culturalContext === 'african' && (
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle className="text-lg">Estimated Bridal Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-500">
                            ${calculateBridalPrice(assessment?.overall_score || 0).toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="10%"
                          outerRadius="80%"
                          data={categoryScores}
                          startAngle={180}
                          endAngle={0}
                        >
                          <PolarGrid />
                          <PolarAngleAxis type="number" domain={[0, 100]} />
                          <RadialBar
                            minAngle={15}
                            background
                            clockWise
                            dataKey="score"
                            fill={(props) => props.payload.color_code}
                          />
                          <Legend />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Chart Section */}
              <Card className="mt-12">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                      Progress Over Time
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <Select
                        value={selectedTimeframe}
                        onValueChange={(value) => setSelectedTimeframe(value as '7' | '30' | '90')}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Last 7 days</SelectItem>
                          <SelectItem value="30">Last 30 days</SelectItem>
                          <SelectItem value="90">Last 90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProgressChart data={progressData} />
                </CardContent>
              </Card>

              <Card className="mt-12">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-primary" />
                      Delusional Score Analysis
                    </CardTitle>
                    <Button
                      onClick={() => setShowInviteForm(true)}
                      variant="default"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Invite Assessor
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {showInviteForm && (
                    <div className="mb-8">
                      <InviteAssessor onInviteSent={() => setShowInviteForm(false)} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryScores.map(category => (
                      <DelusionalScoreCard
                        key={category.name}
                        categoryName={category.name}
                        selfScore={category.score}
                        externalScore={category.externalScore || 0}
                        gapScore={category.gapScore || 0}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => navigate('/assessment')}
                  variant="outline"
                  className="flex items-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Retake Assessment
                </Button>
                <Button
                  onClick={() => {/* Implement PDF download */}}
                  className="flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}