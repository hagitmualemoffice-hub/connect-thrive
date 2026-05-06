CREATE OR REPLACE FUNCTION public.decrement_quick_reaction(_post_slug TEXT, _reaction TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF _reaction NOT IN ('אהבתי', 'דיבר אלי', 'רוצה לדייק', 'פחות') THEN
    RAISE EXCEPTION 'Invalid reaction';
  END IF;

  UPDATE public.quick_reaction_counts
  SET count = GREATEST(0, count - 1), updated_at = now()
  WHERE post_slug = _post_slug AND reaction = _reaction
  RETURNING count INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.decrement_quick_reaction(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.decrement_quick_reaction(TEXT, TEXT) TO anon, authenticated;