-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- First registered user becomes admin
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN public.has_role(auth.uid(), 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in users can view profiles"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Games
CREATE TABLE public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  studio text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  price integer NOT NULL DEFAULT 0,
  discount integer NOT NULL DEFAULT 0,
  size_gb numeric NOT NULL DEFAULT 1,
  rating text NOT NULL DEFAULT 'Нет оценок',
  cover_url text NOT NULL,
  installer_url text,
  installer_name text,
  publisher_id uuid NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.games TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.games TO authenticated;
GRANT ALL ON public.games TO service_role;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published games"
ON public.games FOR SELECT TO anon, authenticated
USING (published = true);

CREATE POLICY "Admins can view all games"
ON public.games FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can add games"
ON public.games FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND publisher_id = auth.uid());

CREATE POLICY "Admins can update games"
ON public.games FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete games"
ON public.games FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_games_updated_at
BEFORE UPDATE ON public.games
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for covers and installers
CREATE POLICY "Anyone can read game files"
ON storage.objects FOR SELECT
USING (bucket_id IN ('game-covers', 'game-installers'));

CREATE POLICY "Admins can upload game files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('game-covers', 'game-installers') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update game files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('game-covers', 'game-installers') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete game files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('game-covers', 'game-installers') AND public.has_role(auth.uid(), 'admin'));