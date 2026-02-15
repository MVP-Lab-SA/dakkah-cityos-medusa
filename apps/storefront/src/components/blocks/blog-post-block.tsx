import React from 'react'
import { sanitizeHtml } from '@/lib/utils/sanitize-html'

interface BlogPostBlockProps {
  heading?: string
  content?: string
  author?: {
    name: string
    avatar?: string
    bio?: string
  }
  publishedAt?: string
  category?: string
  tags?: string[]
  featuredImage?: string
  readingTime?: number
}

const defaultContent = `
<p>In today's rapidly evolving digital landscape, businesses are increasingly turning to integrated commerce platforms that can handle everything from procurement to fulfillment. The shift toward unified systems represents a fundamental change in how organizations approach their supply chain.</p>

<h3>The Rise of B2B Digital Commerce</h3>

<p>Traditional B2B purchasing processes often involve manual steps—phone calls, emails, faxes, and paper-based purchase orders. These methods are not only time-consuming but also prone to errors. Modern B2B platforms streamline these workflows by providing self-service portals, automated approval chains, and real-time inventory visibility.</p>

<p>Key benefits include:</p>

<ul>
  <li>Reduced order processing time by up to 65%</li>
  <li>Improved accuracy through automated data entry</li>
  <li>Better visibility into spending patterns and budget utilization</li>
  <li>Enhanced supplier relationships through transparent communication</li>
</ul>

<h3>Implementing a Successful Strategy</h3>

<p>The most successful implementations start with a clear understanding of existing workflows and pain points. Organizations should map their current processes before selecting technology solutions, ensuring that the platform chosen aligns with their specific needs.</p>

<blockquote>The future of B2B commerce isn't just about digitizing existing processes—it's about reimagining how businesses interact with their entire supply chain ecosystem.</blockquote>

<p>By taking a phased approach to implementation, companies can minimize disruption while maximizing the return on their technology investment.</p>
`

const relatedPosts = [
  { title: '5 Ways to Optimize Your Procurement Workflow', category: 'Operations', date: 'Feb 5, 2026' },
  { title: 'Understanding Volume Pricing Strategies', category: 'Pricing', date: 'Jan 28, 2026' },
  { title: 'Building Stronger Supplier Relationships', category: 'Strategy', date: 'Jan 20, 2026' },
]

export const BlogPostBlock: React.FC<BlogPostBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading = 'The Future of B2B Commerce: Trends and Insights for 2026',
  content = defaultContent,
  author = { name: 'Sarah Chen', bio: 'Head of Commerce Strategy with 10+ years in B2B digital transformation.' },
  publishedAt = 'February 10, 2026',
  category = 'Industry Insights',
  tags = ['B2B', 'Commerce', 'Digital Transformation', 'Procurement', 'Supply Chain'],
  featuredImage,
  readingTime = 6,
}) => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {featuredImage && (
          <div className="w-full max-w-4xl mx-auto mb-8 rounded-lg overflow-hidden">
            <img
              src={featuredImage}
              alt={heading}
              className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {category && (
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-ds-primary/10 text-ds-primary mb-4">
              {category}
            </span>
          )}

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-6 leading-tight">
            {heading}
          </h1>

          <div className="flex items-center gap-4 pb-6 mb-8 border-b border-ds-border">
            <div className="w-10 h-10 rounded-full bg-ds-primary/10 flex items-center justify-center shrink-0">
              {author?.avatar ? (
                <img loading="lazy" src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-ds-primary">
                  {author?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ds-foreground">{author?.name}</p>
              <div className="flex items-center gap-2 text-xs text-ds-muted-foreground">
                <span>{publishedAt}</span>
                <span>·</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>

          <div
            className="prose prose-sm md:prose-base max-w-none mb-8
              [&_p]:text-ds-foreground [&_p]:leading-relaxed [&_p]:mb-4
              [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-ds-foreground [&_h3]:mt-8 [&_h3]:mb-4
              [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:mb-4 [&_ul]:space-y-1
              [&_li]:text-ds-foreground [&_li]:text-sm [&_li]:md:text-base
              [&_blockquote]:border-l-4 [&_blockquote]:border-ds-primary [&_blockquote]:ps-4 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-ds-muted-foreground [&_blockquote]:bg-ds-muted/30 [&_blockquote]:rounded-r-md [&_blockquote]:pe-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content || '') }}
          />

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-ds-border">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground hover:bg-ds-muted/80 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-ds-border">
            <span className="text-sm font-medium text-ds-foreground">Share:</span>
            <button type="button" className="w-8 h-8 rounded-full bg-ds-muted flex items-center justify-center text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted/80 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </button>
            <button type="button" className="w-8 h-8 rounded-full bg-ds-muted flex items-center justify-center text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted/80 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
            <button type="button" className="w-8 h-8 rounded-full bg-ds-muted flex items-center justify-center text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted/80 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>

          {author?.bio && (
            <div className="flex items-start gap-4 p-5 bg-ds-muted/30 rounded-lg border border-ds-border mb-10">
              <div className="w-12 h-12 rounded-full bg-ds-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-ds-primary">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-ds-foreground mb-1">About {author.name}</p>
                <p className="text-sm text-ds-muted-foreground">{author.bio}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-ds-foreground mb-4">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <div
                  key={post.title}
                  className="border border-ds-border rounded-lg p-4 bg-ds-card hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ds-primary">
                    {post.category}
                  </span>
                  <p className="text-sm font-medium text-ds-foreground mt-1 mb-2 line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-xs text-ds-muted-foreground">{post.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
