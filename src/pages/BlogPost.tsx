import { Link, useParams } from "react-router-dom";
import { ArrowRight, Share2, DoorOpen, Sprout, Flame, Heart, HeartHandshake, BookOpen, Rocket, Volume2, Dices, Coffee, LucideIcon } from "lucide-react";
import { blogPosts, getPostBySlug, categoryAccent } from "@/data/blogPosts";
import SiteHeader from "@/components/SiteHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import BlogComments from "@/components/BlogComments";

const postIcons: Record<string, LucideIcon> = {
  "pesach-freedom": DoorOpen,
  "bereshit-end": Sprout,
  "lag-baomer-rashbi": Flame,
  "akeda-tears": Heart,
  "when-life-hits-hard": HeartHandshake,
  "entrepreneurship-failure-part-1": Rocket,
  "bat-echolocation-decisions": Volume2,
  "playing-right-board-flipped": Dices,
  "experiential-values": Coffee,
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const PostIcon = (slug && postIcons[slug]) || BookOpen;
  const accent = categoryAccent[post.category];
  const accentColor = `hsl(${accent.hsl})`;
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0" dir="rtl">
      <div className="hidden md:block">
        <SiteHeader />
      </div>

      {/* Mobile-only header logo strip */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-center px-5 py-3">
          <Link to="/" className="text-foreground text-base font-semibold tracking-tight">
            חגית מועלם
          </Link>
        </div>
      </header>

      <div className="h-12 md:h-20" />

      {/* Hero cover image with floating utility bar */}
      <section className="relative w-full">
        <div className="relative h-[280px] md:h-[560px] overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background/40" />
        </div>

        <div className="absolute top-4 md:top-6 left-0 right-0 px-[30px] md:px-10 flex items-center justify-start gap-2 md:gap-3 z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md text-foreground text-xs md:text-sm font-light hover:bg-white transition-colors"
          >
            חזרה לבלוג
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md text-foreground text-xs md:text-sm font-light hover:bg-white transition-colors">
            <Share2 className="w-4 h-4" />
            שיתוף
          </button>
        </div>
      </section>

      {/* Floating article card */}
      <section className="relative w-full px-[30px] md:px-6 -mt-32 md:-mt-96 z-10">
        <article className="w-full md:w-[min(820px,92%)] mx-auto bg-card rounded-2xl md:rounded-[32px] shadow-[0_25px_70px_-20px_hsl(0_0%_0%_/_0.18)] px-6 md:px-16 py-9 md:py-16 text-right">
          <div className="flex items-center justify-center gap-2 text-foreground/60 text-xs md:text-sm font-light mb-5 md:mb-6">
            <span>{post.date}</span>
            <span>·</span>
            <span style={{ color: accentColor }}>{post.category}</span>
          </div>

          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div
              className="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, hsl(${accent.hsl}) 0%, hsl(${accent.hsl} / 0.7) 100%)` }}
            >
              <PostIcon className="w-6 h-6 md:w-9 md:h-9" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-foreground text-[1.75rem] md:text-5xl font-light leading-tight text-center mb-6 md:mb-8">
            {post.title}
          </h1>

          <div className="mb-8 md:mb-10 flex justify-center">
            <h2 className="text-foreground text-base md:text-2xl font-light leading-relaxed text-center max-w-2xl">
              {post.subtitle}
            </h2>
          </div>

          <div
            className="post-content text-foreground/85 text-sm md:text-lg font-light leading-loose space-y-5 md:space-y-6"
            style={{ ["--post-accent" as any]: accent.hsl }}
          >
            {post.content}
          </div>


          <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-border flex flex-wrap gap-2 md:gap-3 justify-end">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-light"
                style={{ backgroundColor: `hsl(${accent.hsl} / 0.15)`, color: accentColor }}
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </section>

      {/* Comments */}
      <section className="w-full pt-12 md:pt-20">
        <BlogComments postSlug={post.slug} />
      </section>

      {/* Newsletter CTA */}
      <section className="w-full pt-16 md:pt-24 pb-12 md:pb-16 px-[30px] md:px-6">
        <div className="w-full md:w-[min(900px,82%)] mx-auto">
          <div
            className="rounded-2xl md:rounded-[40px] px-7 md:px-20 py-10 md:py-16 text-right"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-full md:w-[min(620px,90%)] mr-0">
              <h2 className="text-white text-[1.5rem] md:text-4xl font-light leading-tight mb-3 md:mb-4">
                אהבת? יש עוד הרבה במרחב הפנימי
              </h2>
              <p className="text-white/95 text-sm md:text-lg font-light leading-relaxed mb-6 md:mb-8">
                הצטרפי למרחב שקט של נשימה וציפורים שנאספות בקפידה אל תיבת המייל שלך.
              </p>
              <Link
                to="/"
                className="inline-block px-8 md:px-10 py-3 rounded-lg bg-white text-foreground text-sm md:text-base font-light shadow-md hover:bg-primary hover:text-primary-foreground transition-all"
              >
                להצטרפות לתפוצה
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="w-full pb-16 md:pb-24 px-[30px] md:px-6">
          <div className="w-full md:w-[min(1100px,82%)] mx-auto">
            <div className="flex items-center gap-3 mb-7 md:mb-10 justify-end">
              <h2 className="text-foreground text-[1.75rem] md:text-4xl font-light">פוסטים נוספים</h2>
              <span className="block w-1 h-7 md:h-9 bg-primary rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              {relatedPosts.map((p) => (
                <Link
                  to={`/blog/${p.slug}`}
                  key={p.slug}
                  className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_hsl(0_0%_0%_/_0.1)] hover:shadow-[0_20px_45px_-15px_hsl(var(--primary)/0.22)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-40 md:h-44 bg-accent overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6 md:p-7 text-right flex flex-col flex-1">
                    <div className="flex items-center justify-end gap-3 mb-3">
                      <span className="text-foreground/50 text-xs font-light">{p.date}</span>
                      <span className="inline-block px-3 py-1 rounded-md bg-accent text-primary text-xs font-light">{p.category}</span>
                    </div>
                    <h3 className="text-foreground text-base md:text-xl font-light leading-tight mb-4 group-hover:text-primary transition-colors flex-1">
                      {p.title}
                    </h3>
                    <span className="self-end text-primary text-sm font-medium group-hover:text-[hsl(var(--primary-glow))] transition-colors">
                      להמשיך לקרוא ←
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 md:mt-12 flex justify-center">
              <Link to="/blog" className="px-8 md:px-10 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-colors">
                לכל הפוסטים
              </Link>
            </div>
          </div>
        </section>
      )}

      <MobileBottomNav />
    </div>
  );
};

export default BlogPost;
