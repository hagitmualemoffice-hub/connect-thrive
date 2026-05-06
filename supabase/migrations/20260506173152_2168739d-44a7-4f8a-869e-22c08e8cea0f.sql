CREATE TABLE public.quick_reaction_counts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug TEXT NOT NULL,
  reaction TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (post_slug, reaction)
);

ALTER TABLE public.quick_reaction_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reaction counts"
ON public.quick_reaction_counts
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert reaction counts"
ON public.quick_reaction_counts
FOR INSERT
WITH CHECK (reaction IN ('אהבתי', 'דיבר אלי', 'רוצה לדייק', 'פחות'));

CREATE POLICY "Anyone can update reaction counts"
ON public.quick_reaction_counts
FOR UPDATE
USING (true);

CREATE OR REPLACE FUNCTION public.increment_quick_reaction(_post_slug TEXT, _reaction TEXT)
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

  INSERT INTO public.quick_reaction_counts (post_slug, reaction, count)
  VALUES (_post_slug, _reaction, 1)
  ON CONFLICT (post_slug, reaction)
  DO UPDATE SET count = quick_reaction_counts.count + 1, updated_at = now()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;