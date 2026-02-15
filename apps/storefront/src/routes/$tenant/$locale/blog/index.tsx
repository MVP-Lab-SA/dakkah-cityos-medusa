// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

const hardcodedPosts = [
  {
    id: "blog-1",
    title: "The Future of E-Commerce: Trends to Watch in 2026",
    excerpt: "From AI-powered personalization to sustainable packaging, discover the key trends shaping the future of online retail and how businesses can stay ahead.",
    category: "tech",
    author: "Sarah Chen",
    date: "2026-02-10",
    read_time: "8 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  },
  {
    id: "blog-2",
    title: "How to Build a Loyal Customer Base From Scratch",
    excerpt: "Learn proven strategies for customer retention including loyalty programs, personalized communication, and community building that drive repeat purchases.",
    category: "business",
    author: "James Wilson",
    date: "2026-02-08",
    read_time: "6 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    id: "blog-3",
    title: "Sustainable Shopping: A Complete Guide for Conscious Consumers",
    excerpt: "Navigate the world of eco-friendly products with our comprehensive guide to sustainable shopping practices and how to make greener choices every day.",
    category: "lifestyle",
    author: "Emma Rodriguez",
    date: "2026-02-05",
    read_time: "10 min read",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
  },
  {
    id: "blog-4",
    title: "Breaking: New Platform Features Launching This Month",
    excerpt: "We are excited to announce several major platform updates including enhanced vendor analytics, improved search, and a brand new mobile experience.",
    category: "news",
    author: "Michael Park",
    date: "2026-02-03",
    read_time: "4 min read",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80",
  },
  {
    id: "blog-5",
    title: "The Ultimate Guide to Product Photography on a Budget",
    excerpt: "Professional-looking product photos do not require an expensive studio. Learn how to take stunning product images with just your smartphone and natural light.",
    category: "guides",
    author: "Lisa Tran",
    date: "2026-01-28",
    read_time: "12 min read",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  },
  {
    id: "blog-6",
    title: "5 Tech Tools Every Small Business Owner Needs",
    excerpt: "Streamline your operations with these essential technology tools for inventory management, customer relationships, analytics, and automated marketing.",
    category: "tech",
    author: "David Kim",
    date: "2026-01-25",
    read_time: "7 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: "blog-7",
    title: "How Local Businesses Are Thriving in the Digital Marketplace",
    excerpt: "Real stories from local vendors who successfully transitioned to online selling, doubling their revenue and reaching customers across the region.",
    category: "business",
    author: "Fatima Al-Rashid",
    date: "2026-01-20",
    read_time: "9 min read",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
  },
  {
    id: "blog-8",
    title: "Wellness at Work: Creating a Healthy Home Office Setup",
    excerpt: "Transform your workspace into a productivity paradise with ergonomic tips, mindfulness practices, and the best gear for a comfortable work-from-home experience.",
    category: "lifestyle",
    author: "Ryan Foster",
    date: "2026-01-15",
    read_time: "6 min read",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
  },
]

export const Route = createFileRoute("/$tenant/$locale/blog/")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog | Dakkah CityOS" },
      { name: "description", content: "Read the latest articles on Dakkah CityOS" },
    ],
  }),
  loader: async () => {
    try {
      return { items: hardcodedPosts, count: hardcodedPosts.length }
    } catch {
      return { items: [], count: 0 }
    }
  },
})

const categoryOptions = ["all", "news", "guides", "tech", "lifestyle", "business"] as const

const categoryColors: Record<string, string> = {
  news: "bg-ds-destructive",
  guides: "bg-ds-info",
  tech: "bg-ds-primary",
  lifestyle: "bg-ds-success",
  business: "bg-ds-warning",
}

function BlogPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const loaderData = Route.useLoaderData()
  const items = loaderData?.items || []

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = searchQuery
      ? (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-ds-primary to-ds-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Insights, guides, and stories from our community of vendors and experts.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>{items.length} articles</span>
            <span>|</span>
            <span>Expert insights</span>
            <span>|</span>
            <span>Updated weekly</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCategoryFilter(opt)}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${categoryFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No articles found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <a
                    key={item.id}
                    href={`${prefix}/blog/${item.id}`}
                    className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-border transition-all duration-200"
                  >
                    <div className="aspect-[16/10] bg-gradient-to-br from-ds-muted to-ds-muted/80 relative overflow-hidden">
                      {item.image ? (
                        <img loading="lazy" src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-ds-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                      )}
                      {item.category && (
                        <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white rounded-md capitalize ${categoryColors[item.category] || "bg-ds-muted-foreground"}`}>{item.category}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ds-foreground group-hover:text-ds-muted-foreground transition-colors line-clamp-2">{item.title}</h3>
                      {item.excerpt && (
                        <p className="text-sm text-ds-muted-foreground mt-2 line-clamp-2">{item.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3 text-xs text-ds-muted-foreground">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          {item.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-ds-border">
                        <span className="text-xs text-ds-muted-foreground">{item.read_time}</span>
                        <span className="px-3 py-1.5 text-xs font-semibold text-white bg-ds-foreground/90 rounded-lg group-hover:bg-ds-foreground transition-colors">Read More</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <section className="py-16 bg-ds-card border-t border-ds-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-ds-foreground mb-4">Stay Updated</h2>
          <p className="text-ds-muted-foreground mb-6">Subscribe to our newsletter for the latest articles, guides, and marketplace insights.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
            <button className="px-6 py-2.5 text-sm font-semibold text-white bg-ds-foreground/90 rounded-lg hover:bg-ds-foreground transition-colors">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}
