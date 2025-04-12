import { supabase } from './supabase';
import type { AssessmentScore, ScoreRange, SCORE_RANGES } from '../types/assessment';

export async function calculateSelfScore(assessmentId: string): Promise<AssessmentScore[]> {
  const { data: responses } = await supabase
    .from('assessment_responses')
    .select('*, questions!inner(*)')
    .eq('assessment_id', assessmentId);

  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  const { data: assessmentType } = await supabase
    .from('assessment_types')
    .select('*')
    .eq('name', 'self')
    .single();

  const scores = categories.map(category => {
    const categoryResponses = responses.filter(
      r => r.questions.category_id === category.id
    );
    
    const score = categoryResponses.length
      ? (categoryResponses.reduce((sum, r) => sum + r.response_value, 0) / 
         (categoryResponses.length * 10)) * 100
      : 0;

    return {
      assessment_id: assessmentId,
      type_id: assessmentType.id,
      category_id: category.id,
      score,
    };
  });

  const { data: savedScores, error } = await supabase
    .from('assessment_scores')
    .insert(scores)
    .select();

  if (error) throw error;
  return savedScores;
}

export async function calculateCompatibilityScore(
  userAssessmentId: string,
  partnerAssessmentId: string
): Promise<AssessmentScore[]> {
  // Fetch both assessments' responses
  const [userResponses, partnerResponses] = await Promise.all([
    supabase
      .from('assessment_responses')
      .select('*, questions!inner(*)')
      .eq('assessment_id', userAssessmentId),
    supabase
      .from('assessment_responses')
      .select('*, questions!inner(*)')
      .eq('assessment_id', partnerAssessmentId),
  
  ]);

  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  const { data: assessmentType } = await supabase
    .from('assessment_types')
    .select('*')
    .eq('name', 'compatibility')
    .single();

  const scores = categories.map(category => {
    const userCategoryResponses = userResponses.data.filter(
      r => r.questions.category_id === category.id
    );
    const partnerCategoryResponses = partnerResponses.data.filter(
      r => r.questions.category_id === category.id
    );

    const userAvg = userCategoryResponses.reduce((sum, r) => sum + r.response_value, 0) / 
                   userCategoryResponses.length;
    const partnerAvg = partnerCategoryResponses.reduce((sum, r) => sum + r.response_value, 0) / 
                      partnerCategoryResponses.length;

    const compatibilityScore = 100 - Math.abs(userAvg - partnerAvg) * 10;

    return {
      assessment_id: userAssessmentId,
      type_id: assessmentType.id,
      category_id: category.id,
      score: compatibilityScore,
    };
  });

  const { data: savedScores, error } = await supabase
    .from('assessment_scores')
    .insert(scores)
    .select();

  if (error) throw error;
  return savedScores;
}

export async function calculateDelusionalScore(
  assessmentId: string,
  externalAssessments: string[]
): Promise<AssessmentScore[]> {
  // Fetch self assessment and all external assessments
  const [selfResponses, ...externalResponses] = await Promise.all([
    supabase
      .from('assessment_responses')
      .select('*, questions!inner(*)')
      .eq('assessment_id', assessmentId),
    ...externalAssessments.map(id => 
      supabase
        .from('assessment_responses')
        .select('*, questions!inner(*)')
        .eq('assessment_id', id)
    ),
  ]);

  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  const { data: assessmentType } = await supabase
    .from('assessment_types')
    .select('*')
    .eq('name', 'delusional')
    .single();

  const scores = categories.map(category => {
    const selfCategoryResponses = selfResponses.data.filter(
      r => r.questions.category_id === category.id
    );
    
    const selfAvg = selfCategoryResponses.reduce((sum, r) => sum + r.response_value, 0) / 
                   selfCategoryResponses.length;

    const externalAvgs = externalResponses.map(responses => {
      const categoryResponses = responses.data.filter(
        r => r.questions.category_id === category.id
      );
      return categoryResponses.reduce((sum, r) => sum + r.response_value, 0) / 
             categoryResponses.length;
    });

    const externalAvg = externalAvgs.reduce((sum, avg) => sum + avg, 0) / externalAvgs.length;
    const gap = Math.abs(selfAvg - externalAvg) * 10;

    return {
      assessment_id: assessmentId,
      type_id: assessmentType.id,
      category_id: category.id,
      score: 100 - gap,
      gap_score: gap,
    };
  });

  const { data: savedScores, error } = await supabase
    .from('assessment_scores')
    .insert(scores)
    .select();

  if (error) throw error;
  return savedScores;
}

export function getScoreRange(score: number): ScoreRange {
  return SCORE_RANGES.find(range => score >= range.min && score <= range.max) || SCORE_RANGES[2];
}