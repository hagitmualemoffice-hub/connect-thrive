DROP POLICY IF EXISTS "Anyone can insert reaction counts" ON public.quick_reaction_counts;
DROP POLICY IF EXISTS "Anyone can update reaction counts" ON public.quick_reaction_counts;

REVOKE ALL ON FUNCTION public.increment_quick_reaction(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_quick_reaction(TEXT, TEXT) TO anon, authenticated;