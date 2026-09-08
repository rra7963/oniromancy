import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.oniromancy.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile/', '/orders/', '/history/', '/api/', '/auth/'],
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'Claude-Web'],
        allow: '/',
        disallow: ['/profile/', '/orders/', '/history/', '/api/', '/auth/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
