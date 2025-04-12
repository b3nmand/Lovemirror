/*
  # Add Assessment Type Column to Questions Table

  1. Changes
    - Add assessment_type column to unified_assessment_questions table
    - Add check constraint to ensure valid values
    - Update existing questions with correct assessment types
*/

-- Add assessment_type column
ALTER TABLE unified_assessment_questions 
ADD COLUMN assessment_type text;

-- Add check constraint
ALTER TABLE unified_assessment_questions 
ADD CONSTRAINT unified_assessment_questions_type_check 
CHECK (assessment_type = ANY (ARRAY['high-value', 'bridal-price', 'wife-material']));

-- Update existing questions with their types
UPDATE unified_assessment_questions
SET assessment_type = unified_assessment_categories.assessment_type
FROM unified_assessment_categories
WHERE unified_assessment_questions.category_id = unified_assessment_categories.id;