ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tagline text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1;

CREATE POLICY "Authenticated can read avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Users manage own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated can read game files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id IN ('game-covers','game-installers'));