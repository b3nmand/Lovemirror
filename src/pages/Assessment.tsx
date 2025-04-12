import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, DollarSign, Heart, Brain, Users, Crown, Scale } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAssessmentType } from '../lib/assessmentType';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubscriptionModal } from '../components/SubscriptionModal';
import type { Profile } from '../types/profile';

interface Category {
  id: string;
  name: string;
  weight: number;
  description: string;
}

interface Question {
  id: string;
  category_id: string;
  question_text: string;
  min_value: number;
  max_value: number;
}

interface Profile {
  gender: string;
  region: string;
  cultural_context: string;
}

export function Assessment() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [maxValue, setMaxValue] = useState(10);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [completedAssessmentId, setCompletedAssessmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchAssessmentData();
    }
  }, [profile]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('gender, region, cultural_context')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Set max value based on assessment type
      const assessmentType = getAssessmentType(profileData);
      setMaxValue(assessmentType === 'high-value' ? 5 : 10);

    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    }
  };

  const fetchAssessmentData = async () => {
    try {
      const assessmentType = getAssessmentType(profile);
      console.log('Loading questions for assessment type:', assessmentType);
      console.log('Fetching assessment data for type:', assessmentType);

      const [categoriesResponse, questionsResponse] = await Promise.all([
        supabase
          .from('unified_assessment_categories')
          .select('*')
          .eq('assessment_type', assessmentType)
          .order('weight', { ascending: false }),
        supabase
          .from('unified_assessment_questions')
          .select('*')
          .eq('assessment_type', assessmentType)
          .order('id', { ascending: true })
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (questionsResponse.error) throw questionsResponse.error;

      console.log('Categories:', categoriesResponse.data?.length);
      console.log('Questions:', questionsResponse.data?.length);

      if (!categoriesResponse.data?.length || !questionsResponse.data?.length) {
        setError('No assessment questions available');
        return;
      }

      // Log first few questions to verify correct loading
      console.log('Sample questions loaded:', questionsResponse.data.slice(0, 3).map(q => ({
        category: categoriesResponse.data.find(c => c.id === q.category_id)?.name,
        question: q.question_text
      })));

      setCategories(categoriesResponse.data);
      setQuestions(questionsResponse.data);
      
      // Initialize responses with default values
      const initialResponses: Record<string, number> = {};
      questionsResponse.data.forEach(q => {
        initialResponses[q.id] = q.min_value;
      });
      setResponses(initialResponses);
    } catch (err) {
      setError('Failed to load assessment data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQuestion = () => {
    if (!categories?.[currentCategoryIndex]) return null;
    const categoryQuestions = questions.filter(q => q.category_id === categories[currentCategoryIndex].id);
    if (categoryQuestions.length === 0) {
      console.log('No questions found for category:', categories[currentCategoryIndex].name);
      return null;
    }
    return categoryQuestions?.[currentQuestionIndex] || null;
  };

  const handleResponse = (value: number) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion && currentQuestion.id) {
      setResponses(prev => ({ ...prev, [currentQuestion.id]: value }));
    }
  };

  const calculateCategoryScore = (categoryId: string) => {
    const categoryQuestions = questions.filter(q => q.category_id === categoryId);
    const categoryResponses = categoryQuestions.map(q => responses[q.id] || 0);
    
    if (categoryQuestions.length === 0) return 0;
    
    // Get the max value from the first question (assuming all questions in a category have the same scale)
    const maxValue = categoryQuestions[0]?.max_value || 10;
    return categoryResponses.reduce((sum, val) => sum + val, 0) / (categoryQuestions.length * maxValue) * 100;
  };

  const handleNext = async () => {
    if (!categories?.length || !questions?.length) return;

    const categoryQuestions = questions.filter(q => q.category_id === categories[currentCategoryIndex].id);
    
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      // Move to next question within category
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Move to first question of next category
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Submit assessment when all questions are answered
      await submitAssessment();
    }
  };

  const handlePrevious = () => {
    if (!categories?.length || !questions?.length) return;

    if (currentQuestionIndex > 0) {
      // Move to previous question within category
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentCategoryIndex > 0) {
      // Move to last question of previous category
      setCurrentCategoryIndex(prev => prev - 1);
      const previousCategoryQuestions = questions.filter(
        q => q.category_id === categories[currentCategoryIndex - 1].id
      );
      setCurrentQuestionIndex(previousCategoryQuestions.length - 1);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    if (!categoryName) return null;
    
    switch (categoryName.toLowerCase()) {
      case 'financial traits':
      case 'financial stability':
        return <DollarSign className="w-8 h-8 text-emerald-500" />;
      case 'emotional traits':
        return <Heart className="w-8 h-8 text-pink-500" />;
      case 'mental traits':
      case 'mental strength':
        return <Brain className="w-8 h-8 text-purple-500" />;
      case 'family & cultural compatibility':
        return <Users className="w-8 h-8 text-blue-500" />;
      case 'behavioral traits':
        return <Crown className="w-8 h-8 text-amber-500" />;
      default:
        return <Scale className="w-8 h-8 text-gray-500" />;
    }
  };

  const submitAssessment = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .single();

      const hasActiveSubscription = subscription?.status === 'active' && 
        new Date(subscription.current_period_end) > new Date();


      const assessmentType = getAssessmentType(profile);
      
      // Validate all questions are answered
      const unansweredQuestions = questions.filter(q => responses[q.id] === undefined);
      if (unansweredQuestions.length > 0) {
        throw new Error('Please answer all questions before submitting');
      }

      const categoryScores = categories.map(category => ({
        category_id: category.id,
        score: calculateCategoryScore(category.id)
      }));

      const overallScore = categoryScores.reduce((sum, { score }) => sum + score, 0) / categories.length;

      // Save to assessment_history
      const { data: assessmentHistory, error: historyError } = await supabase
        .from('assessment_history')
        .insert({
          user_id: user.id,
          assessment_type: assessmentType,
          overall_score: overallScore,
          category_scores: categoryScores
        })
        .select()
        .single();
      
      if (historyError) throw historyError;
      if (!assessmentHistory) throw new Error('Failed to create assessment history');
      
      // Show subscription modal with completed assessment ID
      setCompletedAssessmentId(assessmentHistory.id);

      if (hasActiveSubscription) {
        const redirectPath = assessmentType === 'bridal-price' 
          ? `/assessment-results/${assessmentHistory.id}`
          : assessmentType === 'wife-material'
          ? `/wife-material-results/${assessmentHistory.id}`
          : `/high-value-results/${assessmentHistory.id}`;
        navigate(redirectPath);
      } else {
        setShowSubscriptionModal(true);
      }

    } catch (err) {
      console.error('Assessment submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const currentCategory = categories[currentCategoryIndex];
  const categoryQuestions = questions.filter(q => q.category_id === currentCategory?.id);
  const totalQuestions = categoryQuestions.length;
  const isLastQuestion = currentQuestionIndex === categoryQuestions.length - 1 && 
                        currentCategoryIndex === categories.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {currentCategory?.name && getCategoryIcon(currentCategory.name)}
                <div className="ml-4">
                  <CardTitle className="text-2xl">
                    {currentCategory?.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentCategory?.description}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Question</div>
                <div className="text-2xl font-bold text-primary">
                  {currentQuestionIndex + 1} of {totalQuestions}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>
                  {Math.round(((currentCategoryIndex * totalQuestions + currentQuestionIndex + 1) / 
                  (categories.length * totalQuestions)) * 100)}%
                </span>
              </div>
              <Progress 
                value={((currentCategoryIndex * totalQuestions + currentQuestionIndex + 1) / 
                (categories.length * totalQuestions)) * 100} 
              />
            </div>
          </CardHeader>

          <CardContent className="pt-4">
          {currentQuestion && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">
                  {currentQuestion.question_text}
                </h3>
                <input
                  type="range"
                  min={currentQuestion.min_value}
                  max={currentQuestion.max_value}
                  value={responses[currentQuestion.id] || currentQuestion.min_value}
                  onChange={(e) => handleResponse(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  {Array.from(
                    { length: currentQuestion.max_value - currentQuestion.min_value + 1 },
                    (_, i) => {
                      const value = i + currentQuestion.min_value;
                      return (
                      <button
                        key={value}
                        onClick={() => handleResponse(value)}
                        className={`w-10 h-10 rounded-full font-medium transition-colors ${
                          responses[currentQuestion.id] === value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10">
            <Button
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
              variant="outline"
              className="flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center"
            >
              {isLastQuestion ? (
                submitting ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  'Complete'
                )
              ) : (
                'Next'
              )}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
      
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        assessmentId={completedAssessmentId}
      />
    </div>
  );
}