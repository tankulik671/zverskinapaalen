-- =========================================================
-- 1. ТАБЛИЦА ПРОФИЛЕЙ ПОЛЬЗОВАТЕЛЕЙ (users)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  email TEXT,
  photo TEXT DEFAULT '/images/avatarka01.jpg',
  about TEXT DEFAULT 'Расскажи о себе',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Политики для users
DROP POLICY IF EXISTS "Public users view" ON public.users;
CREATE POLICY "Public users view"
  ON public.users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =========================================================
-- 2. ТАБЛИЦА РЕЦЕНЗИЙ (reviews)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT,
  track_title TEXT,
  performer TEXT DEFAULT 'zverski napalen :3',
  cover TEXT,
  review_text TEXT,
  nomination TEXT,
  rhymes NUMERIC DEFAULT 5,
  structure NUMERIC DEFAULT 5,
  style NUMERIC DEFAULT 5,
  charisma NUMERIC DEFAULT 5,
  vibe NUMERIC DEFAULT 1,
  total_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Добавляем колонку nomination, если таблица reviews уже создана
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS nomination TEXT;

-- Связь внешнего ключа для join users (если таблица уже была создана без FK на public.users)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'reviews_user_id_fkey_users'
  ) THEN
    BEGIN
      ALTER TABLE public.reviews
      ADD CONSTRAINT reviews_user_id_fkey_users
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    EXCEPTION
      WHEN others THEN NULL;
    END;
  END IF;
END $$;

-- Включаем RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Политики для reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt()->>'email' = 'zverskinapalen@gmail.com')
  WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'email' = 'zverskinapalen@gmail.com');

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt()->>'email' = 'zverskinapalen@gmail.com');

-- =========================================================
-- 3. ХРАНИЛИЩЕ АВАТАРОВ (Storage: avatars bucket)
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Политики хранилища для avatars
DROP POLICY IF EXISTS "Public access to avatars" ON storage.objects;
CREATE POLICY "Public access to avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
CREATE POLICY "Authenticated users can update avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');
