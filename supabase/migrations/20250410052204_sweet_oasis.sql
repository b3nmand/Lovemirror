/*
  # Update Assessment Rating Scales

  1. Changes
    - Update min_value and max_value for bridal-price and wife-material questions
    - Set scale to 1-5 instead of 1-10
*/

-- Update bridal price assessment questions
UPDATE unified_assessment_questions
SET min_value = 1,
    max_value = 5
WHERE assessment_type = 'bridal-price';

-- Update wife material assessment questions
UPDATE unified_assessment_questions
SET min_value = 1,
    max_value = 5
WHERE assessment_type = 'wife-material';