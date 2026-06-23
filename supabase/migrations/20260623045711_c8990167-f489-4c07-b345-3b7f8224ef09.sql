
CREATE POLICY "Public read content images" ON storage.objects
  FOR SELECT USING (bucket_id = 'content-images');
CREATE POLICY "Admin upload content images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'content-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin update content images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'content-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin delete content images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'content-images' AND public.has_role(auth.uid(),'admin'));
