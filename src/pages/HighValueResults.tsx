import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Heart, DollarSign, Users, Crown, Scale, Share2, Target, Download } from 'lucide-react';
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

export function HighValueResults() {
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
        .eq('assessment_type', 'high-value');

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
          origin: { y: 0.6 }
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
    if (score >= 90) return { name: 'Platinum', color: '#E5E4E2' };
    if (score >= 75) return { name: 'Gold', color: '#FFD700' };
    if (score >= 60) return { name: 'Silver', color: '#C0C0C0' };
    return { name: 'Bronze', color: '#CD7F32' };
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Mental Traits': return <Brain className="w-6 h-6" />;
      case 'Emotional Traits': return <Heart className="w-6 h-6" />;
      case 'Financial Traits': return <DollarSign className="w-6 h-6" />;
      case 'Cultural Leadership': return <Crown className="w-6 h-6" />;
      case 'Physical Presence': return <Scale className="w-6 h-6" />;
      default: return <Users className="w-6 h-6" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getTierName = (score: number) => {
    if (score >= 80) return 'Alpha Tier';
    if (score >= 60) return 'Growth Tier';
    return 'Undeveloped Tier';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">High-Value Man Assessment</h1>
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              High-Value Quotient (HVQ): {assessment.overall_score.toFixed(1)}%
            </span>
          </div>
          <div className="mt-4">
            <span 
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: badge.color + '20', color: badge.color }}
            >
              {badge.name} Badge
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Category Scores */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Trait Analysis</h2>
            {assessment.category_scores.map((score) => (
              <div key={score.category_id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(score.category_name)}
                    <span className="font-semibold">{score.category_name}</span>
                  </div>
                  <span className={`font-bold ${getScoreColor(score.score)}`}>
                    {score.score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      score.score >= 80 ? 'bg-emerald-500' :
                      score.score >= 60 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${score.score}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  {getTierName(score.score)}
                </div>
              </div>
            ))}
            <div className="mt-8">
              <Ad slot="results" />
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Trait Balance</h2>
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
                colors={{ scheme: 'category10' }}
                fillOpacity={0.25}
                blendMode="multiply"
                theme={{
                  textColor: '#fff',
                  fontSize: 11,
                  grid: {
                    line: {
                      stroke: '#ffffff30'
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
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Target className="w-5 h-5 mr-2" />
            Set Growth Goals
          </button>
          <button
            onClick={() => {/* Implement share functionality */}}
            className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </button>
          <button
            onClick={() => {/* Implement download functionality */}}
            className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* AI Insights */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Personal Development Insights</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Strengths</h3>
              <p className="text-gray-300">
                Your highest scores are in {assessment.category_scores
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 2)
                  .map(s => s.category_name)
                  .join(' and ')}, showing natural leadership potential and strong personal foundation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-amber-400">Growth Areas</h3>
              <p className="text-gray-300">
                Focus on developing your {assessment.category_scores
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 1)
                  .map(s => s.category_name.toLowerCase())
                  .join(', ')} to achieve a more balanced high-value profile.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Next Steps</h3>
              <p className="text-gray-300">
                Consider setting specific goals in our Growth Lab and tracking your progress over time.
                Regular reassessment will help you monitor your development journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}