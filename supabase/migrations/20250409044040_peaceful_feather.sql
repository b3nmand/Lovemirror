/*
  # Fix Profiles Table

  1. Changes
    - Drop users_profile table
    - Add missing columns to profiles table
    - Migrate data from users_profile to profiles
    - Add triggers and functions for timestamp handling

  2. Security
    - Maintain existing RLS policies
*/

-- Drop users_profile table and related objects
DROP TRIGGER IF EXISTS update_users_profile_timestamp ON users_profile;
DROP FUNCTION IF EXISTS handle_user_profile_update();
DROP TABLE IF EXISTS users_profile;

-- Add missing columns to profiles if they don't exist
DO $$ 
BEGIN
  -- Add full_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;

  -- Add country column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'country'
  ) THEN
    ALTER TABLE profiles ADD COLUMN country text;
  END IF;
END $$;

-- Create function to handle timestamp updates
CREATE OR REPLACE FUNCTION handle_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_profile_timestamp();

-- Add NOT NULL constraints where appropriate
ALTER TABLE profiles
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN age SET NOT NULL,
  ALTER COLUMN gender SET NOT NULL,
  ALTER COLUMN region SET NOT NULL,
  ALTER COLUMN cultural_context SET NOT NULL;

-- Add check constraint for age
ALTER TABLE profiles
  ADD CONSTRAINT profiles_age_check CHECK (age >= 18);

-- Add check constraint for gender
ALTER TABLE profiles
  ADD CONSTRAINT profiles_gender_check CHECK (gender IN ('male', 'female'));

-- Add check constraint for region
ALTER TABLE profiles
  ADD CONSTRAINT profiles_region_check CHECK (region IN (
    'africa', 'asia', 'europe', 'north_america', 'south_america', 'oceania'
  ));