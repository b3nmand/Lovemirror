import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Heart, DollarSign, Users, Crown, Scale, Share2, Target, Download, UserPlus } from 'lucide-react';
import { ResponsiveRadar } from '@nivo/radar';
import { supabase } from '../lib/supabase';
import { CircularProgress } from '../components/CircularProgress';
import confetti from 'canvas-confetti';

interface CategoryScore {
  category_id: string;
  category_name: string;
  score: number;
  description: string;
  weight: number;
}

interface Assessment {
  id: string;
  overall_score: number;
  category_scores: CategoryScore[];
  created_at: string;
}

export function WifeMaterialResults() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Assessment not found');
        }
        throw error;
      }

      const { data: categories } = await supabase
        .from('unified_assessment_categories')
        .select('*')
        .eq('assessment_type', 'wife-material');

      if (!categories?.length) {
        throw new Error('Failed to load assessment categories');
      }

      const enrichedAssessment = {
        ...data,
        category_scores: data.category_scores.map((score: any) => {
          const category = categories?.find(c => c.id === score.category_id);
          return {
            ...score,
            category_name: category?.name || 'Unknown',
            description: category?.description || '',
            weight: category?.weight || 0
          };
        })
      };

      setAssessment(enrichedAssessment);

      // Trigger confetti for high scores
      if (enrichedAssessment.overall_score >= 90) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB6C1', '#FFC0CB', '#FFE4E1']
        });
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assessment results');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeLevel = (score: number) => {
    if (score >= 90) return { name: 'Rose Gold', emoji: '🌹', color: '#B76E79' };
    if (score >= 75) return { name: 'Silver', emoji: '💍', color: '#C0C0C0' };
    if (score >= 60) return { name: 'Pearl', emoji: '🌸', color: '#FFE4E1' };
    return { name: 'In Progress', emoji: '✨', color: '#D8BFD8' };
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Mental Maturity': return <Brain className="w-6 h-6" />;
      case 'Emotional Capacity': return <Heart className="w-6 h-6" />;
      case 'Physical Presence': return <Scale className="w-6 h-6" />;
      case 'Financial Wisdom': return <DollarSign className="w-6 h-6" />;
      case 'Cultural Adaptability': return <Crown className="w-6 h-6" />;
      default: return <Users className="w-6 h-6" />;
    }
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Wife Excellence', color: 'text-emerald-500' };
    if (score >= 60) return { label: 'Potential Queen', color: 'text-amber-500' };
    return { label: 'Under Construction', color: 'text-rose-500' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Assessment Not Found</h1>
        <p className="text-gray-600">The assessment you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }

  const badge = getBadgeLevel(assessment.overall_score);
  const radarData = assessment.category_scores.map(score => ({
    category: score.category_name,
    value: score.score
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wife Material Assessment</h1>
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Global Wife Rating: {assessment.overall_score.toFixed(1)}%
            </span>
          </div>
          <div className="mt-4">
            <span 
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: badge.color + '20', color: badge.color }}
            >
              {badge.emoji} {badge.name} {badge.emoji}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Category Scores */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trait Analysis</h2>
            {assessment.category_scores.map((score) => {
              const status = getScoreStatus(score.score);
              return (
                <div key={score.category_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(score.category_name)}
                      <span className="font-semibold text-gray-900">{score.category_name}</span>
                    </div>
                    <span className={`font-bold ${status.color}`}>
                      {score.score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        score.score >= 80 ? 'bg-emerald-500' :
                        score.score >= 60 ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {status.label}
                  </div>
                </div>
              );
            })}
            <div className="mt-8">
              <Ad slot="results" />
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trait Balance</h2>
            <div className="h-[400px]">
              <ResponsiveRadar
                data={radarData}
                keys={['value']}
                indexBy="category"
                maxValue={100}
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                curve="linearClosed"
                borderWidth={2}
                borderColor={{ theme: 'background' }}
                gridLabelOffset={36}
                enableDots={true}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                dotBorderColor={{ from: 'color' }}
                enableDotLabel={true}
                dotLabel="value"
                dotLabelYOffset={-12}
                colors={['#EC4899']}
                fillOpacity={0.25}
                blendMode="multiply"
                theme={{
                  textColor: '#374151',
                  fontSize: 11,
                  grid: {
                    line: {
                      stroke: '#E5E7EB'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => navigate('/goals')}
            className="flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            <Target className="w-5 h-5 mr-2" />
            Set Growth Goals
          </button>
          <button
            onClick={() => navigate('/assessors')}
            className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Get External Rating
          </button>
          <button
            onClick={() => {/* Implement download functionality */}}
            className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* AI Insights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Development Insights</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-600">Strengths</h3>
              <p className="text-gray-700">
                Your highest scores are in {assessment.category_scores
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 2)
                  .map(s => s.category_name)
                  .join(' and ')}, showcasing your natural grace and relationship readiness.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Growth Areas</h3>
              <p className="text-gray-700">
                Consider focusing on developing your {assessment.category_scores
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 1)
                  .map(s => s.category_name.toLowerCase())
                  .join(', ')} to enhance your overall relationship value.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-rose-600">Cultural Insight</h3>
              <p className="text-gray-700">
                Your profile shows a balanced understanding of modern relationship dynamics while
                maintaining respect for traditional values. This versatility will serve you well
                in building meaningful partnerships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}