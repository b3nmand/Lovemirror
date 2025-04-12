import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Diamond, 
  Brain, 
  Heart, 
  Lock, 
  Unlock,
  Target,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  Share2,
  AlertCircle
} from 'lucide-react';
import { supabase, checkAuth } from '../lib/supabase';
import { CircularProgress } from '../components/CircularProgress';

interface Profile {
  name: string;
  gender: string;
  region: string;
  cultural_context: string;
}

interface AssessmentStatus {
  type: string;
  status: 'completed' | 'in_progress' | 'locked' | 'not_started';
  score?: number;
  lastUpdated?: string;
}

interface ExternalAssessor {
  name: string;
  relationship: string;
  status: 'completed' | 'pending';
}

export function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assessments, setAssessments] = useState<AssessmentStatus[]>([]);
  const [externalAssessors, setExternalAssessors] = useState<ExternalAssessor[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // First check if we have a valid session
      const session = await checkAuth();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch assessment history
      const { data: assessmentHistory, error: assessmentError } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (assessmentError) throw assessmentError;
      if (assessmentHistory) {
        const formattedAssessments = assessmentHistory.map(assessment => ({
          type: assessment.assessment_type,
          status: 'completed' as const,
          score: assessment.overall_score,
          lastUpdated: assessment.created_at
        }));
        setAssessments(formattedAssessments);
      }

      // Fetch external assessors
      const { data: assessors, error: assessorsError } = await supabase
        .from('external_assessors')
        .select('*')
        .eq('user_id', user.id);

      if (assessorsError) throw assessorsError;
      if (assessors) {
        const formattedAssessors = assessors.map(assessor => ({
          name: assessor.assessor_email,
          relationship: assessor.relationship_type,
          status: assessor.status as 'completed' | 'pending'
        }));
        setExternalAssessors(formattedAssessors);
      }

      // TODO: Fetch subscription status
      setSubscribed(false);

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Only redirect to auth if it's an authentication error
      if (err instanceof Error && err.message.toLowerCase().includes('auth')) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case 'bridal-price':
        return <Crown className="w-6 h-6 text-pink-500" />;
      case 'wife-material':
        return <Diamond className="w-6 h-6 text-violet-500" />;
      case 'high-value':
        return <Crown className="w-6 h-6 text-blue-500" />;
      default:
        return <Heart className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.name || 'there'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your relationship journey snapshot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Status Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
              Assessment Status
            </h2>

            {assessments.length > 0 ? (
              assessments.map((assessment, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    {getAssessmentIcon(assessment.type)}
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      assessment.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {assessment.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {assessment.type === 'bridal-price' 
                      ? 'Bridal Price Score'
                      : assessment.type === 'wife-material'
                      ? 'Wife Material Score'
                      : 'High Value Score'}
                  </h3>
                  {assessment.score !== undefined ? (
                    <div className="mt-2 text-2xl font-bold text-primary-600">
                      {assessment.score.toFixed(1)}%
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center text-gray-500">
                      <Lock className="w-4 h-4 mr-1" />
                      Locked
                    </div>
                  )}
                  {!subscribed && (
                    <button 
                      onClick={() => {/* Handle subscription */}}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Unlock Full Results
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No assessments completed yet</p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  Take First Assessment
                </button>
              </div>
            )}
          </div>

          {/* Growth Plan Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-secondary-500" />
              Growth Plan
            </h2>

            {subscribed ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  AI-Generated Goals
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <p className="text-gray-900">Improve emotional communication</p>
                      <p className="text-sm text-gray-500">Due in 2 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <p className="text-gray-900">Build financial stability</p>
                      <p className="text-sm text-gray-500">Due in 1 month</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/goals')}
                  className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View All Goals
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Unlock AI Growth Plan
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Get personalized goals and tracking
                  </p>
                  <button
                    onClick={() => {/* Handle subscription */}}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            )}

            {/* Subscription Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                Subscription Status
              </h3>
              {subscribed ? (
                <>
                  <div className="text-sm text-gray-600">
                    <p>Plan: 3 Months Premium</p>
                    <p>Status: <span className="text-green-600">Active</span></p>
                    <p>Expires: July 5, 2025</p>
                  </div>
                  <button
                    onClick={() => {/* Handle renewal */}}
                    className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Manage Subscription
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">No active subscription</p>
                  <button
                    onClick={() => {/* Handle subscription */}}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90"
                  >
                    Choose a Plan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* External Feedback Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent-500" />
              External Feedback
            </h2>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delusional Score Feedback
              </h3>
              
              {externalAssessors.length > 0 ? (
                <div className="space-y-4">
                  {externalAssessors.map((assessor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 capitalize">{assessor.relationship}</p>
                        <p className="text-sm text-gray-500">{assessor.name}</p>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        assessor.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {assessor.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No feedback received yet</p>
              )}

              <button
                onClick={() => navigate('/assessors')}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Invite for Feedback
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/assessment')}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <TrendingUp className="w-6 h-6 text-primary-500 mb-2" />
                  <span className="text-sm text-gray-700">New Assessment</span>
                </button>
                <button
                  onClick={() => navigate('/goals')}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Target className="w-6 h-6 text-secondary-500 mb-2" />
                  <span className="text-sm text-gray-700">Set Goals</span>
                </button>
                <button
                  onClick={() => navigate('/education')}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Brain className="w-6 h-6 text-accent-500 mb-2" />
                  <span className="text-sm text-gray-700">Learn More</span>
                </button>
                <button
                  onClick={() => {/* Handle AI chat */}}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <MessageSquare className="w-6 h-6 text-violet-500 mb-2" />
                  <span className="text-sm text-gray-700">AI Coach</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}