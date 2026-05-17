
-- 1) Add parent_id for replies
ALTER TABLE public.blog_comments
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_slug ON public.blog_comments(post_slug);

-- 2) Comment emoji reactions counts
CREATE TABLE IF NOT EXISTS public.comment_reaction_counts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (comment_id, emoji)
);

ALTER TABLE public.comment_reaction_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comment reactions"
ON public.comment_reaction_counts
FOR SELECT
USING (true);

-- Allowed emojis
CREATE OR REPLACE FUNCTION public._is_allowed_comment_emoji(_e TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT _e IN ('❤️','😊','🤩','😢','🙏','👍','🌷','💪')
$$;

CREATE OR REPLACE FUNCTION public.increment_comment_reaction(_comment_id UUID, _emoji TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF NOT public._is_allowed_comment_emoji(_emoji) THEN
    RAISE EXCEPTION 'Invalid emoji';
  END IF;

  INSERT INTO public.comment_reaction_counts (comment_id, emoji, count)
  VALUES (_comment_id, _emoji, 1)
  ON CONFLICT (comment_id, emoji)
  DO UPDATE SET count = comment_reaction_counts.count + 1, updated_at = now()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_comment_reaction(_comment_id UUID, _emoji TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF NOT public._is_allowed_comment_emoji(_emoji) THEN
    RAISE EXCEPTION 'Invalid emoji';
  END IF;

  UPDATE public.comment_reaction_counts
  SET count = GREATEST(0, count - 1), updated_at = now()
  WHERE comment_id = _comment_id AND emoji = _emoji
  RETURNING count INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$$;

-- 3) Rename quick reaction "רוצה לדייק" -> "רוצה להוסיף"
UPDATE public.quick_reaction_counts
SET reaction = 'רוצה להוסיף'
WHERE reaction = 'רוצה לדייק';

CREATE OR REPLACE FUNCTION public.increment_quick_reaction(_post_slug text, _reaction text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_count INTEGER;
BEGIN
  IF _reaction NOT IN ('אהבתי', 'דיבר אלי', 'רוצה להוסיף', 'פחות') THEN
    RAISE EXCEPTION 'Invalid reaction';
  END IF;

  INSERT INTO public.quick_reaction_counts (post_slug, reaction, count)
  VALUES (_post_slug, _reaction, 1)
  ON CONFLICT (post_slug, reaction)
  DO UPDATE SET count = quick_reaction_counts.count + 1, updated_at = now()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_quick_reaction(_post_slug text, _reaction text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_count INTEGER;
BEGIN
  IF _reaction NOT IN ('אהבתי', 'דיבר אלי', 'רוצה להוסיף', 'פחות') THEN
    RAISE EXCEPTION 'Invalid reaction';
  END IF;

  UPDATE public.quick_reaction_counts
  SET count = GREATEST(0, count - 1), updated_at = now()
  WHERE post_slug = _post_slug AND reaction = _reaction
  RETURNING count INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$function$;
