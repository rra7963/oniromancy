import { WithContext, SoftwareApplication, Organization, WebSite } from 'schema-dts';

export const websiteJsonLd: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Oniromancy AI',
  url: 'https://www.oniromancy.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.oniromancy.com/symbolism-guide?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  } as any
};

export const softwareAppJsonLd: WithContext<SoftwareApplication> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Oniromancy AI',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  url: 'https://www.oniromancy.com',
  description: 'Free AI-powered Dream Interpretation, Tarot Reading, and Horoscope analysis based on Jungian psychology. Visualize your dreams and explore your subconscious.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    category: 'Freemium'
  },
  author: {
    '@type': 'Organization',
    name: 'Oniromancy AI',
    url: 'https://www.oniromancy.com'
  },
  featureList: [
    'AI Dream Analysis',
    'Tarot Card Visualization',
    'Daily Horoscope',
    'Jungian Psychology Interpretation',
    'Dream Journal'
  ],
  screenshot: 'https://www.oniromancy.com/icon.svg',
  softwareVersion: '1.0.0'
};

export const organizationJsonLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Oniromancy AI',
  url: 'https://www.oniromancy.com',
  logo: 'https://www.oniromancy.com/icon.svg',
  sameAs: [
    'https://twitter.com/oniromancy',
    'https://instagram.com/oniromancy'
  ]
};
