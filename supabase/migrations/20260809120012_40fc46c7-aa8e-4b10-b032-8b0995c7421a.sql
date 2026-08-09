UPDATE public.blog_posts
SET content_html = replace(content_html, '<blockquote>', '<blockquote class="my-10 px-8 py-8 rounded-2xl bg-accent/50 border-r-4 border-primary text-foreground text-xl md:text-2xl font-light leading-relaxed text-right">')
WHERE content_html LIKE '%<blockquote>%';