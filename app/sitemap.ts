import { MetadataRoute } from 'next'
import { blogPosts } from './blog/data'
import { getAllSymbolSlugs } from './symbolism-guide/utils'
import { getAllTarotCards } from './tarot-meanings/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.oniromancy.com'

  // 1. Main Landing & Feature Pages (High Priority)
  // Updated: /horoscope and /tarot are now included as they have public landing pages.
  const mainRoutes = [
    { route: '', changeFrequency: 'daily', priority: 1.0 },
    { route: '/tarot', changeFrequency: 'weekly', priority: 0.95 },
    { route: '/horoscope', changeFrequency: 'daily', priority: 0.95 },
    { route: '/tarot-meanings', changeFrequency: 'weekly', priority: 0.9 },
    { route: '/symbolism-guide', changeFrequency: 'weekly', priority: 0.9 },
    { route: '/blog', changeFrequency: 'weekly', priority: 0.9 },
  ] as const

  // 2. Informational & Business Pages (Medium Priority)
  const infoRoutes = [
    { route: '/pricing', changeFrequency: 'monthly', priority: 0.7 },
    { route: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { route: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { route: '/partners', changeFrequency: 'monthly', priority: 0.5 },
  ] as const

  // 3. Legal & Support Pages (Low Priority)
  const legalRoutes = [
    { route: '/faq', changeFrequency: 'monthly', priority: 0.4 },
    { route: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { route: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ] as const

  const staticMap = [...mainRoutes, ...infoRoutes, ...legalRoutes].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: item.priority,
  }))

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8, // Content is king
  }))

  const symbolRoutes = getAllSymbolSlugs().map((symbol) => ({
    url: `${baseUrl}/symbolism-guide/${symbol.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const tarotRoutes = getAllTarotCards().map((card) => ({
    url: `${baseUrl}/tarot-meanings/${card.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticMap, ...blogRoutes, ...symbolRoutes, ...tarotRoutes]
}
