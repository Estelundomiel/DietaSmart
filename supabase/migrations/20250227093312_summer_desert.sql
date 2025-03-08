/*
  # Creazione tabella recipes

  1. Nuove Tabelle
    - `recipes`
      - `id` (uuid, primary key)
      - `title` (text, non null)
      - `description` (text)
      - `ingredients` (text array)
      - `instructions` (text array)
      - `calories` (integer)
      - `cooking_time` (text)
      - `image` (text)
      - `url` (text)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `recipes` table
    - Add policy for authenticated users to read all recipes
    - Add policy for authenticated users to insert their own recipes
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  ingredients text[] DEFAULT '{}',
  instructions text[] DEFAULT '{}',
  calories integer,
  cooking_time text,
  image text,
  url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recipes"
  ON recipes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);