import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, DollarSign, Heart, Brain, Users, Crown, Scale } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAssessmentType } from '../lib/assessmentType';
=======
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, DollarSign, Heart, Brain, Users, Crown, Scale, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAssessmentType } from '../lib/assessmentType'; 
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
<<<<<<< HEAD
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
=======
import { SubscriptionModal } from '@/components/SubscriptionModal';
import type { Profile } from '@/types/profile';
import { checkSubscriptionByCustomerId } from '@/lib/subscriptionUtils';
import { generateAIPlan } from '@/lib/aiPlanGenerator';
import type { Category, Question } from '@/types/assessment';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryScore {
  category_id: string;
  score: number;
}

interface AssessmentResponse {
  question_id: string;
  response_value: number;
  assessor_id?: string;
}

interface AssessmentState {
  categories: Category[];
  questions: Question[];
  currentCategoryIndex: number;
  currentQuestionIndex: number;
  responses: Record<string, number>;
  loading: boolean;
  error: string;
  profile: Profile | null;
  maxValue: number;
  showSubscriptionModal: boolean;
  completedAssessmentId: string | null;
  submitting: boolean;
  categoryColors: Record<string, string>;
  debugInfo: Record<string, any>;
  assessorId: string | null;
  targetUserId: string | null;
  isExternalAssessment: boolean;
  isSubmitting: boolean;
}

export function Assessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showSubscriptionModal } = useSubscription();
  const [state, setState] = useState<AssessmentState>({
    categories: [],
    questions: [],
    currentCategoryIndex: 0,
    currentQuestionIndex: 0,
    responses: {},
    loading: true,
    error: '',
    profile: null,
    maxValue: 10,
    showSubscriptionModal: false,
    completedAssessmentId: null,
    submitting: false,
    categoryColors: {},
    debugInfo: {},
    assessorId: null,
    targetUserId: null,
    isExternalAssessment: false,
    isSubmitting: false,
  });

  useEffect(() => {
    // Get assessorId and targetUserId from URL params if they exist
    const assessorIdParam = searchParams.get('assessorId');
    const targetUserIdParam = searchParams.get('targetUserId');
    
    if (assessorIdParam && targetUserIdParam) {
      setState(prev => ({ ...prev, assessorId: assessorIdParam, targetUserId: targetUserIdParam, isExternalAssessment: true }));
      fetchTargetUserProfile(targetUserIdParam);
    } else {
      fetchUserProfile();
    }
  }, [searchParams]);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (profile) {
      fetchAssessmentData();
    }
  }, [profile]);
=======
    if (state.profile) {
      if (state.isExternalAssessment && state.targetUserId) {
        // For external assessment, use the target user's profile
        fetchAssessmentData();
      } else {
        // For self-assessment, use the current user's profile
        fetchAssessmentData();
      }
      // Initialize category colors
      const assessmentType = getAssessmentType(state.profile);
      setState(prev => ({ ...prev, debugInfo: { ...prev.debugInfo, assessmentType } }));
    }
  }, [state.profile]);
  
  const fetchTargetUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, age, gender, region, cultural_context')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setState(prev => ({ ...prev, profile: profileData }));

      // Set max value based on assessment type
      const assessmentType = getAssessmentType(profileData);
      setState(prev => ({ ...prev, maxValue: assessmentType === 'high-value' ? 5 : 5 }));

    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load target user profile' }));
      console.error(err);
    }
  };
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
<<<<<<< HEAD
        .select('gender, region, cultural_context')
=======
        .select('id, name, age, gender, region, cultural_context')
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
<<<<<<< HEAD
      setProfile(profileData);

      // Set max value based on assessment type
      const assessmentType = getAssessmentType(profileData);
      setMaxValue(assessmentType === 'high-value' ? 5 : 10);

    } catch (err) {
      setError('Failed to load profile');
=======
      setState(prev => ({ ...prev, profile: profileData }));

      // Set max value based on assessment type
      const assessmentType = getAssessmentType(profileData);
      setState(prev => ({ ...prev, maxValue: assessmentType === 'high-value' ? 5 : 5 }));

    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load profile' }));
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      console.error(err);
    }
  };

  const fetchAssessmentData = async () => {
    try {
<<<<<<< HEAD
      const assessmentType = getAssessmentType(profile);
      console.log('Loading questions for assessment type:', assessmentType);
      console.log('Fetching assessment data for type:', assessmentType);

=======
      const assessmentType = getAssessmentType(state.profile);
      
      // First, validate the connection by checking if we can access the database
      const { error: connectionError } = await supabase
        .from('unified_assessment_categories')
        .select('count')
        .limit(1);
        
      if (connectionError) {
        console.error('Database connection error:', connectionError);
        throw new Error('Database connection failed. Please check your Supabase configuration.');
      }

      // Fetch assessment questions with specific filters
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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

<<<<<<< HEAD
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
=======
      if (categoriesResponse.error) {
        console.error('Categories fetch error:', categoriesResponse.error);
        throw categoriesResponse.error;
      }
      
      if (questionsResponse.error) {
        console.error('Questions fetch error:', questionsResponse.error);
        throw questionsResponse.error;
      }

      if (!categoriesResponse.data?.length || !questionsResponse.data?.length) {
        setState(prev => ({
          ...prev,
          debugInfo: {
            ...prev.debugInfo,
          assessmentType,
          categoriesCount: categoriesResponse.data?.length || 0,
          questionsCount: questionsResponse.data?.length || 0
          },
          error: `No assessment questions available for ${assessmentType}. Please try refreshing the page or contact support.`
        }));
        
        setState(prev => ({
          ...prev,
          debugInfo: {
            ...prev.debugInfo,
            assessmentType,
            categoriesCount: categoriesResponse.data?.length || 0,
            questionsCount: questionsResponse.data?.length || 0
          },
          error: `No assessment questions available for ${assessmentType}. Please try refreshing the page or contact support.`
        }));
        
        // Create a new migration to fix the database
        console.error('Missing assessment data. Please run the database migration to fix this issue.');
        
        return; 
      }

      // Log first few questions to verify correct loading
      if (questionsResponse.data.length > 0) {
        console.log('Sample questions loaded:', questionsResponse.data.slice(0, 3).map(q => ({
          id: q.id,
          category_id: q.category_id,
          category: categoriesResponse.data.find(c => c.id === q.category_id)?.name || 'Unknown',
          question: q.question_text,
          min: q.min_value,
          max: q.max_value
        })));
        
        // Generate category colors
        const colors: Record<string, string> = {};
        const colorClasses = [
          'from-purple-100 to-purple-200 text-purple-800',
          'from-pink-100 to-pink-200 text-pink-800',
          'from-blue-100 to-blue-200 text-blue-800',
          'from-emerald-100 to-emerald-200 text-emerald-800',
          'from-amber-100 to-amber-200 text-amber-800',
          'from-red-100 to-red-200 text-red-800',
        ];
        
        categoriesResponse.data.forEach((category, index) => {
          colors[category.id] = colorClasses[index % colorClasses.length];
        });
        
        setState(prev => ({ ...prev, categoryColors: colors }));
      }

      setState(prev => ({ ...prev, categories: categoriesResponse.data, questions: questionsResponse.data }));
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      
      // Initialize responses with default values
      const initialResponses: Record<string, number> = {};
      questionsResponse.data.forEach(q => {
        initialResponses[q.id] = q.min_value;
      });
<<<<<<< HEAD
      setResponses(initialResponses);
    } catch (err) {
      setError('Failed to load assessment data');
      console.error(err);
    } finally {
      setLoading(false);
=======
      setState(prev => ({ ...prev, responses: initialResponses }));
    } catch (err) {
      console.error('Error fetching assessment data:', err);
      setState(prev => ({ ...prev, error: err instanceof Error ? err.message : 'Failed to load assessment data' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    }
  };

  const getCurrentQuestion = () => {
<<<<<<< HEAD
    if (!categories?.[currentCategoryIndex]) return null;
    const categoryQuestions = questions.filter(q => q.category_id === categories[currentCategoryIndex].id);
    if (categoryQuestions.length === 0) {
      console.log('No questions found for category:', categories[currentCategoryIndex].name);
      return null;
    }
    return categoryQuestions?.[currentQuestionIndex] || null;
=======
    if (!state.categories?.[state.currentCategoryIndex]) return null;
    
    const currentCategory = state.categories[state.currentCategoryIndex];
    const categoryQuestions = state.questions.filter(q => q.category_id === currentCategory.id);
    
    if (categoryQuestions.length === 0) {
      console.log('No questions found for category:', currentCategory.name, 'ID:', currentCategory.id);
      console.log('Available category IDs in questions:', [...new Set(state.questions.map(q => q.category_id))]);
      return null;
    }
    
    if (state.currentQuestionIndex >= categoryQuestions.length) {
      console.log('Question index out of bounds:', state.currentQuestionIndex, 'Max:', categoryQuestions.length - 1);
      return null;
    }
    
    return categoryQuestions[state.currentQuestionIndex];
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  };

  const handleResponse = (value: number) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion && currentQuestion.id) {
<<<<<<< HEAD
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
=======
      setState(prev => ({ ...prev, responses: { ...prev.responses, [currentQuestion.id]: value } }));
    }
  };

  const calculateCategoryScore = (categoryId: string): number => {
    const categoryQuestions = state.questions.filter((q: Question) => q.category_id === categoryId);
    if (!categoryQuestions.length) return 0;
    
    const sum = categoryQuestions.reduce((acc: number, q: Question) => {
      const response = state.responses[q.id] || q.min_value || 1;
      return acc + response;
    }, 0);
    
    return sum / categoryQuestions.length;
  };

  const handleNext = async () => {
    if (!state.categories?.length || !state.questions?.length) return;

    const categoryQuestions = state.questions.filter(q => q.category_id === state.categories[state.currentCategoryIndex].id);
    
    if (state.currentQuestionIndex < categoryQuestions.length - 1) {
      // Move to next question within category
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else if (state.currentCategoryIndex < state.categories.length - 1) {
      // Move to first question of next category
      setState(prev => ({ ...prev, currentCategoryIndex: prev.currentCategoryIndex + 1, currentQuestionIndex: 0 }));
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } else {
      // Submit assessment when all questions are answered
      await submitAssessment();
    }
  };

  const handlePrevious = () => {
<<<<<<< HEAD
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
=======
    if (!state.categories?.length || !state.questions?.length) return;

    if (state.currentQuestionIndex > 0) {
      // Move to previous question within category
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    } else if (state.currentCategoryIndex > 0) {
      // Move to last question of previous category
      setState(prev => ({ ...prev, currentCategoryIndex: prev.currentCategoryIndex - 1, currentQuestionIndex: state.questions.filter(q => q.category_id === state.categories[state.currentCategoryIndex - 1].id).length - 1 }));
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    if (!categoryName) return null;
    
<<<<<<< HEAD
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
=======
    const name = categoryName.toLowerCase();
    if (name.includes('financial')) {
      return <DollarSign className="w-8 h-8 text-emerald-500" />;
    } else if (name.includes('emotional')) {
      return <Heart className="w-8 h-8 text-pink-500" />;
    } else if (name.includes('mental')) {
      return <Brain className="w-8 h-8 text-purple-500" />;
    } else if (name.includes('family') || name.includes('cultural')) {
      return <Users className="w-8 h-8 text-blue-500" />;
    } else if (name.includes('conflict')) {
      return <AlertTriangle className="w-8 h-8 text-red-500" />;
    } else if (name.includes('physical')) {
      return <Scale className="w-8 h-8 text-indigo-500" />;
    } else {
      return <Crown className="w-8 h-8 text-amber-500" />;
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    }
  };

  const submitAssessment = async () => {
<<<<<<< HEAD
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
=======
    if (state.submitting) return;
    setState(prev => ({ ...prev, submitting: true, error: '' }));
    
    try {
      // 1. First check if user is authenticated
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

<<<<<<< HEAD
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
=======
      // 2. Calculate scores and prepare data
      const assessmentType = getAssessmentType(state.profile);
      const categoryScores = state.categories.map(category => ({
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        category_id: category.id,
        score: calculateCategoryScore(category.id)
      }));

<<<<<<< HEAD
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
=======
      const overallScore = categoryScores.reduce((sum, { score }) => sum + score, 0) / state.categories.length;

      // 3. Save assessment data first, regardless of subscription status
      console.log('Saving assessment data...');
        const { data: assessmentHistory, error: historyError } = await supabase
          .from('assessment_history')
          .insert({
          user_id: user.id,
            assessment_type: assessmentType,
            overall_score: overallScore,
          category_scores: categoryScores,
          completed_at: new Date().toISOString()
          })
          .select()
          .single();
      
      if (historyError) {
        console.error('Error saving assessment:', historyError);
        throw new Error('Your results could not be saved. Please check your connection or try again.');
      }
      
      if (!assessmentHistory) {
        throw new Error('Failed to create assessment history');
      }
      
      // 4. Store the completed assessment ID
      setState(prev => ({ ...prev, completedAssessmentId: assessmentHistory.id }));
        localStorage.setItem('pendingAssessmentId', assessmentHistory.id);

      // 5. Start AI plan generation in the background
      try {
        console.log('Starting AI plan generation for assessment:', assessmentHistory.id);
        generateAIPlan(assessmentHistory.id).catch(error => {
          console.error('Background AI plan generation failed:', error);
          // Don't throw - this is a background task
        });
        } catch (planError) {
        console.error('Error initiating AI plan generation:', planError);
          // Continue with the flow even if plan generation fails
        }

      // 6. Only check subscription status after successful data save
      console.log('Checking subscription status...');
        let hasActiveSubscription = false;
        try {
          hasActiveSubscription = await checkSubscriptionByCustomerId(user.id);
        console.log('Subscription check result:', hasActiveSubscription);
        } catch (subError) {
          console.error('Error checking subscription:', subError);
        // If we can't check subscription status, assume user is not subscribed
          hasActiveSubscription = false;
        }
        
      // 7. Handle subscription-based flow
      if (hasActiveSubscription) {
        console.log('User has active subscription, redirecting to results');
        if (assessmentType === 'high-value') {
          navigate(`/high-value-results/${assessmentHistory.id}`);
        } else {
          // Handle other assessment types
          const redirectPath = assessmentType === 'bridal-price' 
            ? `/assessment-results/${assessmentHistory.id}`
            : `/wife-material-results/${assessmentHistory.id}`;
          navigate(redirectPath);
        }
      } else {
        // Double-check subscription status before showing modal
        const stillActive = await checkSubscriptionByCustomerId(user.id);
        if (!stillActive) {
          // If no active subscription, show subscription modal
          console.log('No active subscription, showing subscription modal');
          showSubscriptionModal();
        } else {
          // If subscription is active, redirect to results
          if (assessmentType === 'high-value') {
            navigate(`/high-value-results/${assessmentHistory.id}`);
          } else {
            const redirectPath = assessmentType === 'bridal-price' 
              ? `/assessment-results/${assessmentHistory.id}`
              : `/wife-material-results/${assessmentHistory.id}`;
            navigate(redirectPath);
          }
        }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      }

    } catch (err) {
      console.error('Assessment submission error:', err);
<<<<<<< HEAD
      setError(err instanceof Error ? err.message : 'Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
=======
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Your results could not be saved. Please check your connection or try again.'
      }));
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  if (state.loading) {
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
<<<<<<< HEAD
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
=======
  const currentCategory = state.categories[state.currentCategoryIndex];
  const categoryQuestions = currentCategory ? 
    state.questions.filter(q => q.category_id === currentCategory.id) : 
    [];
  const currentCategoryColor = currentCategory ? state.categoryColors[currentCategory.id] || 'from-gray-100 to-gray-200 text-gray-800' : '';
  const totalQuestions = categoryQuestions.length;
  const isLastQuestion = state.currentQuestionIndex === categoryQuestions.length - 1 && 
                        state.currentCategoryIndex === state.categories.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-2 sm:px-4">
      <div className="max-w-3xl mx-auto w-full">
        {state.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        
        {/* Debug information when there are issues */}
        {state.questions.length === 0 && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle>Troubleshooting Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <p>Assessment Type: {state.debugInfo.assessmentType || 'Unknown'}</p>
                <p>Categories Count: {state.debugInfo.categoriesCount || 0}</p>
                <p>Questions Count: {state.debugInfo.questionsCount || 0}</p>
                <p>Profile: {JSON.stringify(state.profile || {})}</p>
                <p>Categories: {state.categories.length}</p>
                <p>Questions: {state.questions.length}</p>
                <p>Is External: {state.isExternalAssessment ? 'Yes' : 'No'}</p>
                <p>Target User ID: {state.targetUserId || 'None'}</p>
                <p>Assessor ID: {state.assessorId || 'None'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="w-full bg-white/80 backdrop-blur-sm border-none">
          <CardHeader className={`pb-4 bg-gradient-to-r ${currentCategoryColor} transition-colors duration-500`}>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {currentCategory?.name && getCategoryIcon(currentCategory.name)}
                <div className="ml-4">
                  <CardTitle className="text-2xl">
<<<<<<< HEAD
                    {currentCategory?.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentCategory?.description}
=======
                    {currentCategory?.name || 'Loading...'}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentCategory?.description || 'Please wait while we load your assessment.'}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Question</div>
                <div className="text-2xl font-bold text-primary">
<<<<<<< HEAD
                  {currentQuestionIndex + 1} of {totalQuestions}
=======
                  {state.currentQuestionIndex + 1} of {totalQuestions || '?'}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>
<<<<<<< HEAD
                  {Math.round(((currentCategoryIndex * totalQuestions + currentQuestionIndex + 1) / 
                  (categories.length * totalQuestions)) * 100)}%
                </span>
              </div>
              <Progress 
                value={((currentCategoryIndex * totalQuestions + currentQuestionIndex + 1) / 
                (categories.length * totalQuestions)) * 100} 
=======
                  {totalQuestions ? 
                    Math.round(((state.currentCategoryIndex * totalQuestions + state.currentQuestionIndex + 1) / 
                    (state.categories.length * totalQuestions)) * 100) :
                    0}%
                </span>
              </div>
              <Progress 
                value={totalQuestions ? 
                  ((state.currentCategoryIndex * totalQuestions + state.currentQuestionIndex + 1) / 
                  (state.categories.length * totalQuestions)) * 100 : 
                  0} 
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
              />
            </div>
          </CardHeader>

          <CardContent className="pt-4">
<<<<<<< HEAD
          {currentQuestion && (
=======
          {currentQuestion ? (
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">
                  {currentQuestion.question_text}
                </h3>
<<<<<<< HEAD
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
=======
                <div className="flex items-center gap-4">
                  <Input
                  type="range"
                  min={currentQuestion.min_value}
                  max={currentQuestion.max_value}
                    value={state.responses[currentQuestion.id] || currentQuestion.min_value}
                  onChange={(e) => handleResponse(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">
                    {state.responses[currentQuestion.id] || currentQuestion.min_value}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              {state.questions.length === 0 ? (
                <p className="text-red-500">No questions found for this assessment type. Please try a different assessment or contact support.</p>
              ) : (
                <p className="text-gray-500">Error loading question. Please try again or contact support.</p>
              )}
            </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          )}

          <div className="flex justify-between mt-10">
            <Button
              onClick={handlePrevious}
<<<<<<< HEAD
              disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
              variant="outline"
              className="flex items-center"
=======
              disabled={state.currentCategoryIndex === 0 && state.currentQuestionIndex === 0}
              variant="outline"
              className="w-full flex items-center"
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
<<<<<<< HEAD
              disabled={submitting}
              className="flex items-center"
            >
              {isLastQuestion ? (
                submitting ? (
=======
              disabled={state.submitting || !currentQuestion}
              className="w-full flex items-center"
            >
              {isLastQuestion ? (
                state.submitting ? (
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
      
<<<<<<< HEAD
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        assessmentId={completedAssessmentId}
      />
=======
      {/* The subscription modal - make sure it's visible when showSubscriptionModal is true */}
      {state.showSubscriptionModal && state.completedAssessmentId && (
        <SubscriptionModal
          isOpen={state.showSubscriptionModal}
          onClose={() => {
            console.log('Closing subscription modal');
            setState(prev => ({ ...prev, showSubscriptionModal: false }));
            
            // Redirect to appropriate results page if modal is closed
            if (state.completedAssessmentId) {
              const assessmentType = getAssessmentType(state.profile);
              const redirectPath = assessmentType === 'bridal-price' 
                ? `/assessment-results/${state.completedAssessmentId}`
                : assessmentType === 'wife-material'
                ? `/wife-material-results/${state.completedAssessmentId}`
                : `/high-value-results/${state.completedAssessmentId}`;
              navigate(redirectPath);
            }
          }}
          assessmentId={state.completedAssessmentId}
        />
      )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    </div>
  );
}