import { supabase } from "@/integrations/supabase/client";

export type BlogPostRow = {
  id: string;
  slug: string;
  category: string;
  date_label: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  image_url: string | null;
  tags: string[];
  content_html: string;
  published: boolean;
  sort_order: number;
};

export type LectureRow = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  audience: string | null;
  badges: string[];
  sort_order: number;
  published: boolean;
};

export type PodcastRow = {
  id: string;
  num: string;
  title: string;
  description: string | null;
  duration: string | null;
  date_label: string | null;
  spotify_url: string | null;
  drive_url: string | null;
  sort_order: number;
  published: boolean;
};

export type ProjectRow = {
  id: string;
  title: string;
  paragraphs: string[];
  buttons: { label: string; href?: string; action?: "mailing" | "hosting" }[];
  sort_order: number;
  published: boolean;
};

export const fetchBlogPosts = async (includeUnpublished = false) => {
  let q = supabase.from("blog_posts").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as BlogPostRow[];
};

export const fetchBlogPost = async (slug: string) => {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as BlogPostRow | null;
};

export const fetchLectures = async (includeUnpublished = false) => {
  let q = supabase.from("lectures").select("*").order("sort_order", { ascending: true });
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as LectureRow[];
};

export const fetchPodcastEpisodes = async (includeUnpublished = false) => {
  let q = supabase.from("podcast_episodes").select("*").order("sort_order", { ascending: true });
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PodcastRow[];
};

export const fetchProjects = async (includeUnpublished = false) => {
  let q = supabase.from("projects").select("*").order("sort_order", { ascending: true });
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((p: any) => ({
    ...p,
    paragraphs: Array.isArray(p.paragraphs) ? p.paragraphs : [],
    buttons: Array.isArray(p.buttons) ? p.buttons : [],
  })) as ProjectRow[];
};

// Categories used in UI
export const BLOG_CATEGORIES = ["פסיכולוגיה", "יזמות", "פרשה ופסיכולוגיה"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export const categoryAccent: Record<string, { hsl: string; label: string }> = {
  "יזמות": { hsl: "172 30% 67%", label: "יזמות קשובה" },
  "פסיכולוגיה": { hsl: "326 45% 68%", label: "פסיכולוגיה" },
  "פרשה ופסיכולוגיה": { hsl: "270 55% 72%", label: "פרשה ופסיכולוגיה" },
};
