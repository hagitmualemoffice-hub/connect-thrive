import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import { blogPosts, BLOG_CATEGORIES, categoryAccent, BlogCategory } from "@/data/blogPosts";

const filters: ("הכל" | BlogCategory)[] = ["הכל", ...BLOG_CATEGORIES];

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("הכל");

  const byCategory = useMemo(() => {
    const groups: Record<BlogCategory, typeof blogPosts> = {
      "יזמות": [],
      "פסיכולוגיה": [],
      "פרשה ופסיכולוגיה": [],
    };
    for (const p of blogPosts) groups[p.category].push(p);
    return groups;
  }, []);


  const visibleCategories: BlogCategory[] =
    activeFilter === "הכל" ? BLOG_CATEGORIES : [activeFilter as BlogCategory];

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

      {/* Hero / Page header */}
      <section className="w-full pt-6 pb-8 md:pt-20 md:pb-12 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto text-right">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <span className="block w-1 h-8 md:h-12 bg-primary rounded-full" />
            <h1 className="text-foreground text-[1.75rem] md:text-6xl font-light tracking-tight leading-tight">
              מרחב פנימי - הבלוג
            </h1>
          </div>
          <p className="text-foreground/70 text-sm md:text-xl font-light max-w-2xl pr-3 md:pr-5 leading-relaxed">
            על נפש, תנועה ומשמעות כפי שהן פוגשות חיים.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <section className="w-full pb-8 md:pb-10 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-start">
            {filters.map((cat) => {
              const isActive = activeFilter === cat;
              const accent = cat !== "הכל" ? categoryAccent[cat] : null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-light transition-all border ${
                    isActive
                      ? "text-white shadow-sm border-transparent"
                      : "bg-card text-foreground/70 hover:bg-accent hover:text-accent-foreground border-border"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: accent
                            ? `hsl(${accent.hsl})`
                            : "hsl(var(--primary))",
                        }
                      : undefined
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>



      {/* Category rows */}
      {visibleCategories.map((cat) => {
        const posts = byCategory[cat];
        if (posts.length === 0) return null;

        const accent = categoryAccent[cat];
        return (
          <section key={cat} className="w-full pb-12 md:pb-16 px-[30px] md:px-6">
            <div className="w-full md:w-[min(1100px,82%)] mx-auto">
              <div dir="rtl" className="flex items-center gap-3 mb-5 md:mb-7 justify-start">
                <span
                  className="block w-1 h-6 md:h-8 rounded-full"
                  style={{ backgroundColor: `hsl(${accent.hsl})` }}
                />
                <h2 className="text-foreground text-xl md:text-3xl font-light">{accent.label}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {posts.map((post) => (
                  <Link
                    to={`/blog/${post.slug}`}
                    key={post.slug}
                    className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_hsl(0_0%_0%_/_0.1)] hover:shadow-[0_20px_45px_-15px_hsl(var(--primary)/0.22)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    style={{ borderTop: `3px solid hsl(${accent.hsl})`, ["--card-accent" as any]: accent.hsl }}
                  >
                    <div className="relative h-44 md:h-52 overflow-hidden bg-accent">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 md:p-7 text-right flex flex-col flex-1">
                      <div className="flex items-center justify-start gap-3 mb-3">
                        <span
                          className="inline-block px-3 py-1 rounded-md text-xs font-light text-white"
                          style={{ backgroundColor: `hsl(${accent.hsl})` }}
                        >
                          {post.category}
                        </span>
                        <span className="text-foreground/50 text-xs font-light">{post.date}</span>
                      </div>
                      <h3 className="accent-hover text-foreground text-base md:text-xl font-light leading-tight mb-3 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-foreground/70 text-sm font-light leading-relaxed mb-5 md:mb-6 flex-1">
                        {post.excerpt}
                      </p>
                      <span
                        className="self-start text-sm font-medium transition-colors"
                        style={{ color: `hsl(${accent.hsl})` }}
                      >
                        להמשיך לקרוא ←
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Newsletter CTA */}
      <section className="w-full pb-16 md:pb-24 pt-4 md:pt-8 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div
            className="rounded-2xl md:rounded-[40px] px-7 md:px-20 py-10 md:py-20 text-right"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-full md:w-[min(680px,90%)] mr-0">
              <h2 className="text-white text-[1.5rem] md:text-4xl font-light leading-tight mb-4 md:mb-5">
                רוצה לקבל פוסטים חדשים ישר למייל?
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

      <MobileBottomNav />
    </div>
  );
};

export default Blog;
