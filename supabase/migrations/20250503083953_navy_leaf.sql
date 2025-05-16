/*
  # Add Recipient Email to Partner Invitations

  1. Changes
    - Add recipient_email column to partner_invitations table
    - Update RLS policies to use auth.uid() instead of uid()
    - Add function to find partner invitations by email

  2. Security
    - Maintain existing RLS policies
    - Fix function permissions
*/

-- Add recipient_email column to partner_invitations if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partner_invitations' 
    AND column_name = 'recipient_email'
  ) THEN
    ALTER TABLE partner_invitations ADD COLUMN recipient_email text;
  END IF;
END $$;

-- Recreate the "Users can manage their sent invitations" policy
DROP POLICY IF EXISTS "Users can manage their sent invitations" ON partner_invitations;
CREATE POLICY "Users can manage their sent invitations"
  ON partner_invitations
  FOR ALL
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Recreate the "Users can view invitations sent to them" policy  
DROP POLICY IF EXISTS "Users can view invitations sent to them" ON partner_invitations;
CREATE POLICY "Users can view invitations sent to them"
  ON partner_invitations
  FOR SELECT
  TO authenticated
  USING (invitation_code IN ( SELECT partner_invitations_1.invitation_code
     FROM partner_invitations partner_invitations_1
    WHERE (partner_invitations_1.recipient_id = auth.uid())));

-- Create a function to find partner invitations by email
CREATE OR REPLACE FUNCTION find_partner_invitations_by_email(email text)
RETURNS TABLE (
  id uuid,
  sender_id uuid,
  invitation_code uuid,
  assessment_type text,
  status text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.id, 
    pi.sender_id, 
    pi.invitation_code, 
    pi.assessment_type, 
    pi.status, 
    pi.created_at
  FROM partner_invitations pi
  WHERE pi.recipient_email = email
  AND pi.status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION find_partner_invitations_by_email TO authenticated;