REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon;

DROP POLICY IF EXISTS "Anyone can read game files" ON storage.objects;
CREATE POLICY "Admins can read game files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id IN ('game-covers', 'game-installers') AND public.has_role(auth.uid(), 'admin'));