import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context: APIContext) {
  const posts = await getCollection('post', (e) => e.data.locale === 'en' && !e.data.draft);
  const sorted = posts.sort(
    (a, b) => (b.data.publishDate?.getTime() ?? 0) - (a.data.publishDate?.getTime() ?? 0)
  );

  return rss({
    title: 'KONVOI GmbH — News',
    description: 'News and insights from KONVOI Security.',
    site: context.site ?? 'https://www.konvoi.eu',
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate ?? new Date(),
      description: post.data.excerpt ?? '',
      link: `/en/news/${post.data.canonicalKey}/`,
    })),
  });
}
