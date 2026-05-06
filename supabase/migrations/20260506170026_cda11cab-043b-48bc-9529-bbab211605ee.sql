-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_comments_post_slug ON public.blog_comments(post_slug);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments (all comments are public for now)
CREATE POLICY "Anyone can view comments"
ON public.blog_comments
FOR SELECT
USING (true);

-- Anyone can submit a comment
CREATE POLICY "Anyone can insert comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (
  length(trim(name)) > 0
  AND length(name) <= 80
  AND length(trim(content)) > 0
  AND length(content) <= 2000
  AND length(trim(post_slug)) > 0
);