/*
  # Fix Assessment Responses RLS Policy

  1. Changes
    - Drop existing RLS policies for assessment_responses
    - Create new policies that properly handle assessment ownership
    - Ensure users can only create/read responses for their own assessments

  2. Security
    - Maintain RLS protection
    - Link response permissions to assessment ownership
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can read own responses" ON assessment_responses;

-- Create new policies
CREATE POLICY "Users can create responses for own assessments"
  ON assessment_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessment_history
      WHERE assessment_history.id = assessment_responses.assessment_id
      AND assessment_history.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read responses for own assessments"
  ON assessment_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessment_history
      WHERE assessment_history.id = assessment_responses.assessment_id
      AND assessment_history.user_id = auth.uid()
    )
  );