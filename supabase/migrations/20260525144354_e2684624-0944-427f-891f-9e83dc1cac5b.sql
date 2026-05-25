
-- Fix mutable search_path on helper function
ALTER FUNCTION public._is_allowed_comment_emoji(text) SET search_path = public;

-- Tighten the overly permissive INSERT policy on leads with email validation
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (
  length(trim(email)) > 0
  AND length(email) <= 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
