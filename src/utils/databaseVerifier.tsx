import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DatabaseStats {
  highValueCategories: number;
  highValueQuestions: number;
  bridalPriceCategories: number;
  bridalPriceQuestions: number;
  wifeMaterialCategories: number;
  wifeMaterialQuestions: number;
  connectionStatus: 'connected' | 'error' | 'loading';
  error?: string;
}

export function DatabaseVerifier() {
  // Keep the function but remove the UI elements
  const [, setStats] = useState<DatabaseStats>({
    highValueCategories: 0,
    highValueQuestions: 0,
    bridalPriceCategories: 0,
    bridalPriceQuestions: 0,
    wifeMaterialCategories: 0,
    wifeMaterialQuestions: 0,
    connectionStatus: 'loading',
  });
  const [loading, setLoading] = useState(false);

  const verifyDatabase = async () => {
    setLoading(true);
    try {
      // Verify connection
      const { error: connectionError } = await supabase
        .from('unified_assessment_categories')
        .select('count')
        .limit(1);
        
      if (connectionError) {
        setStats({
          ...stats,
          connectionStatus: 'error',
          error: connectionError.message
        });
        return;
      }
      
      // Count categories by assessment type
      const [highValueCats, bridalPriceCats, wifeMaterialCats] = await Promise.all([
        supabase
          .from('unified_assessment_categories')
          .select('count')
          .eq('assessment_type', 'high-value'),
          
        supabase
          .from('unified_assessment_categories')
          .select('count')
          .eq('assessment_type', 'bridal-price'),
          
        supabase
          .from('unified_assessment_categories')
          .select('count')
          .eq('assessment_type', 'wife-material')
      ]);
      
      // Count questions by assessment type
      const [highValueQs, bridalPriceQs, wifeMaterialQs] = await Promise.all([
        supabase
          .from('unified_assessment_questions')
          .select('count')
          .eq('assessment_type', 'high-value'),
          
        supabase
          .from('unified_assessment_questions')
          .select('count')
          .eq('assessment_type', 'bridal-price'),
          
        supabase
          .from('unified_assessment_questions')
          .select('count')
          .eq('assessment_type', 'wife-material')
      ]);
      
      // Get some sample questions and categories
      const { data: sampleQuestions } = await supabase
        .from('unified_assessment_questions')
        .select('id, category_id, question_text, assessment_type')
        .limit(3);
        
      console.log('Sample Questions:', sampleQuestions);
      
      // Update stats
      setStats({
        highValueCategories: highValueCats.count || 0,
        highValueQuestions: highValueQs.count || 0,
        bridalPriceCategories: bridalPriceCats.count || 0,
        bridalPriceQuestions: bridalPriceQs.count || 0,
        wifeMaterialCategories: wifeMaterialCats.count || 0,
        wifeMaterialQuestions: wifeMaterialQs.count || 0,
        connectionStatus: 'connected',
      });
    } catch (error: any) {
      setStats({
        ...stats,
        connectionStatus: 'error',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyDatabase();
  }, []);

  return (
    null // Return null to render nothing
  );
}