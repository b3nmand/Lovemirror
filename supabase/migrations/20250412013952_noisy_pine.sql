/*
  # Update Assessment Rating Scales

  1. Changes
    - Update min_value and max_value for all assessment questions
    - Set consistent scale for each assessment type
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

-- Update high-value assessment questions
UPDATE unified_assessment_questions
SET min_value = 1,
    max_value = 5
WHERE assessment_type = 'high-value';