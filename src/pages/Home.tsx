import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Target, 
  BookOpen, 
  Settings as SettingsIcon,
  Users,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Profile {
  name: string;
  gender: string;
  region: string;
  cultural_context: string;
}

interface Progress {
  completedSteps: number;
  totalSteps: number;
}

export function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Progress>({ completedSteps: 0, totalSteps: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, gender, region, cultural_context')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user progress
      const { data: assessmentHistory, error: historyError } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('user_id', user.id);

      if (!historyError && assessmentHistory) {
        setProgress({
          completedSteps: assessmentHistory.length,
          totalSteps: 5
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentType = () => {
    if (!profile) return '';
    if (profile.gender === 'male') return 'high-value-man';
    return profile.region === 'africa' && profile.cultural_context === 'african' 
      ? 'bridal-price' 
      : 'wife-material';
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
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">
                  Welcome back, {profile?.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  Continue your journey to self-improvement
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="text-2xl font-bold text-primary">
                  Step {progress.completedSteps} of {progress.totalSteps}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Progress value={(progress.completedSteps / progress.totalSteps) * 100} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Award className="w-8 h-8 text-primary mb-3" />
              <CardTitle className="text-lg">Start Assessment</CardTitle>
              <CardDescription className="mb-4">Evaluate your progress</CardDescription>
              <Button 
                onClick={() => navigate(`/assessment?type=${getAssessmentType()}`)}
                className="w-full"
              >
                Begin
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Target className="w-8 h-8 text-secondary mb-3" />
              <CardTitle className="text-lg">Self-Improvement Lab</CardTitle>
              <CardDescription className="mb-4">Personalized growth plan</CardDescription>
              <Button 
                onClick={() => navigate('/self-improvement')}
                className="w-full"
                variant="secondary"
              >
                Explore
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-accent mb-3" />
              <CardTitle className="text-lg">Community</CardTitle>
              <CardDescription className="mb-4">Connect with others</CardDescription>
              <Button 
                onClick={() => navigate('/community')}
                className="w-full"
                variant="outline"
              >
                Join
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <SettingsIcon className="w-8 h-8 text-gray-500 mb-3" />
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription className="mb-4">Customize your experience</CardDescription>
              <Button 
                onClick={() => navigate('/settings')}
                className="w-full"
                variant="outline"
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-6 h-6 text-primary mr-2" />
                  Recent Assessments
                </CardTitle>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/assessment-history')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Assessment history list would go here */}
              <div className="text-center py-8 text-gray-500">
                <p>No recent assessments found</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/assessment')}
                >
                  Take your first assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="w-6 h-6 text-secondary mr-2" />
                  Learning Resources
                </CardTitle>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/education')}
                >
                  Browse All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Learning resources list would go here */}
              <div className="text-center py-8 text-gray-500">
                <p>Explore our educational content</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/education')}
                >
                  Start learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}