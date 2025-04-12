/*
  # User Profile Schema Setup

  1. New Tables
    - `users_profile`
      - Stores extended user profile information
      - Links to auth.users via foreign key
      - Includes: full name, age, country, created_at

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users_profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age >= 18),
  country text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to handle user profile updates
CREATE OR REPLACE FUNCTION handle_user_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
CREATE TRIGGER update_users_profile_timestamp
  BEFORE UPDATE ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_profile_update();