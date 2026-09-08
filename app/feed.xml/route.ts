import { blogPosts } from '../blog/data';
import { symbols } from '../symbolism-guide/data';
import { getAllTarotCards } from '../tarot-meanings/data';
import { slugify } from '@/lib/utils';

export async function GET() {
  const siteUrl = 'https://www.oniromancy.com';
  const tarotCards = getAllTarotCards();
  
  const feedItems = [
    ...blogPosts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.date,
      category: 'Blog',
    })),
    ...symbols.map((symbol) => ({
      title: `${symbol.name} Dream Meaning`,
      description: symbol.meaning,
      url: `${siteUrl}/symbolism-guide/${slugify(symbol.name)}`,
      date: new Date().toISOString(),
      category: 'Dream Symbol',
    })),
    ...tarotCards.map((card) => ({
      title: `${card.name} Tarot Meaning`,
      description: card.description,
      url: `${siteUrl}/tarot-meanings/${card.slug}`,
      date: new Date().toISOString(),
      category: 'Tarot Card',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Oniromancy AI - Dream Interpretation &amp; Tarot</title>
    <link>${siteUrl}</link>
    <description>Unlock the secrets of your subconscious with AI-powered Dream Interpretation, free Tarot readings, and daily Horoscope.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItems
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.url}</link>
      <guid>${item.url}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <category>${item.category}</category>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
