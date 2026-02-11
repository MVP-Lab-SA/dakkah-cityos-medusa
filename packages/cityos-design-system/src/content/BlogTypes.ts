import type { BaseComponentProps } from "../components/ComponentTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface ArticleCardProps extends BaseComponentProps {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: MediaField
  author?: { name: string; avatar?: string; bio?: string; socialLinks?: Record<string, string> }
  publishedAt: string
  category?: string
  categorySlug?: string
  tags?: string[]
  readingTime?: string
  variant?: "default" | "compact" | "featured" | "horizontal"
  locale?: string
}

export interface ArticleDetailProps extends BaseComponentProps {
  id: string
  title: string
  slug: string
  content: string
  featuredImage?: MediaField
  author?: { name: string; avatar?: string; bio?: string; socialLinks?: Record<string, string> }
  publishedAt: string
  updatedAt?: string
  category?: string
  tags?: string[]
  readingTime?: string
  relatedPosts?: ArticleCardProps[]
  locale?: string
}

export interface ArticleSidebarProps extends BaseComponentProps {
  categories?: { name: string; slug: string; count: number }[]
  popularPosts?: ArticleCardProps[]
  tags?: { name: string; count: number }[]
  showNewsletter?: boolean
  onCategorySelect?: (slug: string) => void
  onTagSelect?: (tag: string) => void
  locale?: string
}

export interface CategoryFilterProps extends BaseComponentProps {
  categories: { name: string; slug: string; count?: number }[]
  selectedCategory?: string
  onSelect: (slug: string | undefined) => void
  locale?: string
}

export interface AuthorCardProps extends BaseComponentProps {
  name: string
  avatar?: string
  bio?: string
  socialLinks?: Record<string, string>
  articleCount?: number
  variant?: "inline" | "full"
  locale?: string
}

export interface ArticleShareProps extends BaseComponentProps {
  url: string
  title: string
  description?: string
  locale?: string
}

export interface RelatedArticlesProps extends BaseComponentProps {
  articles: ArticleCardProps[]
  maxItems?: number
  locale?: string
}

export interface ArticleCommentsProps extends BaseComponentProps {
  articleId: string
  comments?: {
    id: string
    author: string
    avatar?: string
    content: string
    createdAt: string
    likes?: number
  }[]
  locale?: string
}
