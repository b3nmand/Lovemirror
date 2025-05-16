import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Heart, DollarSign, Users, Crown, Scale, Share2, Target, Download, Calculator } from 'lucide-react';
import { ResponsiveRadar } from '@nivo/radar';
import { supabase } from '../lib/supabase';
import { CircularProgress } from '../components/CircularProgress';
import confetti from 'canvas-confetti';
<<<<<<< HEAD
=======
import { Card } from '@/components/ui/card';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface CategoryScore {
  category_id: string;
  category_name: string;
  score: number;
  description: string;
  weight: number;
  price_contribution: number;
}

interface Assessment {
  id: string;
  overall_score: number;
  category_scores: CategoryScore[];
  created_at: string;
}

export function BridalPriceResults() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [partnerSalary, setPartnerSalary] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const calculateBridalPrice = (score: number, salary: number) => {
    const BASE_PRICE = 3000;
    const salaryContribution = Math.min((salary / score), 5000);
    const scoreValue = BASE_PRICE * (score / 100);
    return {
      total: salaryContribution + scoreValue,
      scoreComponent: scoreValue,
      salaryComponent: salaryContribution
    };
  };

  const fetchAssessment = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      setError('');
=======
      
      // Initialize error state if it doesn't exist
      let errorMessage = '';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

      const { data, error } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
<<<<<<< HEAD
          throw new Error('Assessment not found');
=======
          errorMessage = 'Assessment not found';
          throw new Error(errorMessage);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        }
        throw error;
      }

      const { data: categories } = await supabase
        .from('unified_assessment_categories')
        .select('*')
        .eq('assessment_type', 'bridal-price');

      if (!categories?.length) {
<<<<<<< HEAD
        throw new Error('Failed to load assessment categories');
=======
        errorMessage = 'Failed to load assessment categories';
        throw new Error(errorMessage);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      }

      const enrichedAssessment = {
        ...data,
        category_scores: data.category_scores.map((score: any) => {
          const category = categories?.find(c => c.id === score.category_id);
          const BASE_PRICE = 3000;
          const priceContribution = (score.score / 100) * (BASE_PRICE / categories?.length || 6);
          
          return {
            ...score,
            category_name: category?.name || 'Unknown',
            description: category?.description || '',
            weight: category?.weight || 0,
            price_contribution: priceContribution
          };
        })
      };

      setAssessment(enrichedAssessment);

      // Trigger confetti for high scores
      if (enrichedAssessment.overall_score >= 85) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF8C00']
        });
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
<<<<<<< HEAD
      setError(err instanceof Error ? err.message : 'Failed to load assessment results');
=======
      // Define setError function if it doesn't exist
      const errorMsg = err instanceof Error ? err.message : 'Failed to load assessment results';
      console.error(errorMsg);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } finally {
      setLoading(false);
    }
  };

  const getBadgeLevel = (score: number) => {
    if (score >= 85) return { name: 'Wife Material 💎', color: '#FFD700' };
    if (score >= 70) return { name: 'Queen Potential 👑', color: '#C0C0C0' };
    if (score >= 60) return { name: 'Growing 🌱', color: '#CD7F32' };
    return { name: 'In Progress ⏳', color: '#B8860B' };
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Emotional Traits': return <Heart className="w-6 h-6" />;
      case 'Mental Traits': return <Brain className="w-6 h-6" />;
      case 'Physical Presentation': return <Scale className="w-6 h-6" />;
      case 'Financial Responsibility': return <DollarSign className="w-6 h-6" />;
      case 'Family/Cultural Compatibility': return <Crown className="w-6 h-6" />;
      default: return <Users className="w-6 h-6" />;
    }
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

  const bridalPrice = calculateBridalPrice(assessment.overall_score, partnerSalary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bridal Price Assessment</h1>
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Overall Score: {assessment.overall_score.toFixed(1)}%
            </span>
          </div>
          <div className="mt-4">
            <span 
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: badge.color + '20', color: badge.color }}
            >
              {badge.name}
            </span>
          </div>
        </div>

        {/* Bridal Price Calculator */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bridal Price Estimation</h2>
            <button
              onClick={() => setShowPriceCalculator(!showPriceCalculator)}
              className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {showPriceCalculator ? 'Hide Calculator' : 'Show Calculator'}
            </button>
          </div>

          {showPriceCalculator && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Partner's Annual Salary (USD)
              </label>
              <input
                type="number"
                value={partnerSalary}
                onChange={(e) => setPartnerSalary(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter partner's salary"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Final Bridal Price</h3>
              <div className="text-3xl font-bold text-amber-600">
                ${bridalPrice.total.toFixed(2)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Score Value</h3>
              <div className="text-3xl font-bold text-amber-600">
                ${bridalPrice.scoreComponent.toFixed(2)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Partner Contribution</h3>
              <div className="text-3xl font-bold text-amber-600">
                ${bridalPrice.salaryComponent.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Category Scores */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
            <div className="space-y-6">
              {assessment.category_scores.map((score) => (
                <div key={score.category_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(score.category_name)}
                      <span className="font-semibold text-gray-900">{score.category_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-600">
                        {score.score.toFixed(1)}%
                      </span>
                      <div className="text-sm text-gray-500">
                        +${score.price_contribution.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
<<<<<<< HEAD
              <Ad slot="results" />
=======
              <Card className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-6">
                <div className="text-xs text-gray-500 mb-2 opacity-75">Advertisement</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Relationship Coaching</h4>
                <p className="text-sm text-gray-600 mb-4">Get personalized advice from expert coaches</p>
                <a
                  href="#"
                  className="inline-block w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center bg-white text-gray-700 hover:bg-gray-50"
                >
                  Learn More
                </a>
              </Card>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
                colors={['#F59E0B']}
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
            className="flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Target className="w-5 h-5 mr-2" />
            Set Growth Goals
          </button>
          <button
            onClick={() => {/* Implement share functionality */}}
            className="flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Certificate
          </button>
          <button
            onClick={() => {/* Implement download functionality */}}
            className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* Growth Suggestions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Growth Insights</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-amber-600">Strengths</h3>
              <p className="text-gray-700">
                Your highest scores are in {assessment.category_scores
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 2)
                  .map(s => s.category_name)
                  .join(' and ')}, contributing significantly to your bridal value.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-600">Areas for Growth</h3>
              {assessment.category_scores
                .sort((a, b) => a.score - b.score)
                .slice(0, 2)
                .map((category, index) => (
                  <p key={index} className="text-gray-700 mb-2">
                    Improving your {category.category_name.toLowerCase()} could increase your bridal value by up to $
                    {(300 * (1 - category.score / 100)).toFixed(2)}+
                  </p>
                ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-amber-600">Cultural Context</h3>
              <p className="text-gray-700">
                Your assessment reflects a strong understanding of traditional values while maintaining
                modern sensibilities. This balance is highly valued in African cultural contexts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}