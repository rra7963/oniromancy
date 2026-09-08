import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Oniromancy AI',
    short_name: 'Oniromancy',
    description: 'Free Dream Interpretation, Tarot Reading & Horoscope. Unlock the secrets of your subconscious with AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050508',
    theme_color: '#050508',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
