/*
  # Add INSERT Policy for Profiles Table

  1. Changes
    - Add INSERT policy to allow authenticated users to create their own profile
    - Policy ensures users can only create a profile with their own user ID

  2. Security
    - Maintains RLS protection while allowing profile creation
    - Users can only create profiles where id matches their auth.uid()
*/

-- Create INSERT policy for profiles table
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);