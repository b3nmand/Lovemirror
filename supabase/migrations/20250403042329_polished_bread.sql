/*
  # Add Cultural Context to Profiles

  1. Changes
    - Add cultural_context column to profiles table
    - Add check constraint to ensure valid values
    - Add default value of 'global'
    - Add helpful comment for documentation

  2. Security
    - No changes to RLS policies needed
*/

DO $$ BEGIN
  -- Add cultural_context column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'cultural_context'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN cultural_context text DEFAULT 'global' NOT NULL;

    -- Add check constraint to ensure valid values
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_cultural_context_check 
    CHECK (cultural_context IN ('global', 'african'));

    -- Add helpful comment
    COMMENT ON COLUMN profiles.cultural_context IS 'Stores the user''s cultural context preference (global or african)';
  END IF;
END $$;