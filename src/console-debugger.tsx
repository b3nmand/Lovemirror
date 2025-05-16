import React, { useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function ConsoleDebugger() {
  useEffect(() => {
    async function debugDatabaseQueries() {
      try {
        // Log environment variables (without showing full keys)
        console.log('Environment variables availability check:');
        console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Available' : 'Missing');
        console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Available' : 'Missing');
        
        console.log('---------- DEBUGGING DATABASE CONNECTIONS ----------');
        
        // Check unified_assessment_categories with better error handling
        try {
          const { data: categories, error: catError } = await supabase
            .from('unified_assessment_categories')
            .select('id, name, assessment_type')
            .limit(5);
          
          if (catError) {
            console.error('Error fetching categories:', catError);
          } else {
            console.log('Sample categories:', categories);
            console.log('Total categories found:', categories?.length || 0);
            
            // List all assessment types
            const types = [...new Set(categories?.map(c => c.assessment_type) || [])];
            console.log('Assessment types in database:', types);
          }
        } catch (err) {
          console.error('Failed to fetch categories:', err);
        }
        
        // Check unified_assessment_questions with better error handling
        try {
          const { data: questions, error: qError } = await supabase
            .from('unified_assessment_questions')
            .select('id, category_id, question_text, assessment_type')
            .limit(5);
          
          if (qError) {
            console.error('Error fetching questions:', qError);
          } else {
            console.log('Sample questions:', questions);
            console.log('Total questions found:', questions?.length || 0);
            
            // Count questions by assessment type
            const typeCounts: Record<string, number> = {};
            
            try {
              // Get all questions to count by type
              const { data: allQuestions, error: allQError } = await supabase
                .from('unified_assessment_questions')
                .select('assessment_type');
                
              if (!allQError && allQuestions) {
                allQuestions.forEach(q => {
                  const type = q.assessment_type;
                  typeCounts[type] = (typeCounts[type] || 0) + 1;
                });
                
                console.log('Questions by assessment type:', typeCounts);
              }
            } catch (err) {
              console.error('Failed to fetch all questions:', err);
            }
          }
        } catch (err) {
          console.error('Failed to fetch sample questions:', err);
        }
        
        // Check for category-question relationship issues with better error handling
        try {
          const { data: categoryIds } = await supabase
            .from('unified_assessment_categories')
            .select('id');
            
          const { data: questions } = await supabase
            .from('unified_assessment_questions')
            .select('id, category_id')
            .limit(5);
            
          if (categoryIds && questions) {
            const validCategoryIds = new Set(categoryIds.map(c => c.id));
            const invalidQuestions = questions.filter(q => !validCategoryIds.has(q.category_id));
            
            if (invalidQuestions.length > 0) {
              console.error('Found questions with invalid category IDs:', invalidQuestions);
            } else {
              console.log('All sample questions have valid category IDs');
            }
          }
        } catch (err) {
          console.error('Failed to check category-question relationships:', err);
        }
        
        console.log('---------- DATABASE DEBUG COMPLETE ----------');
      } catch (error) {
        console.error('Debug error:', error);
      }
    }
    
    debugDatabaseQueries();
  }, []);
  
  // This component doesn't render anything visible
  return null;
}