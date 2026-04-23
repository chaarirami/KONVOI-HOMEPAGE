import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context: APIContext) {
  const posts = await getCollection('post', (e) => e.data.locale === 'de' && !e.data.draft);
  const sorted = posts.sort(
    (a, b) => (b.data.publishDate?.getTime() ?? 0) - (a.data.publishDate?.getTime() ?? 0)
  );

  return rss({
    title: 'KONVOI GmbH — Aktuelles',
    description: 'Neuigkeiten, Analysen und Einblicke von KONVOI Security.',
    site: context.site ?? 'https://www.konvoi.eu',
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate ?? new Date(),
      description: post.data.excerpt ?? '',
      link: `/aktuelles/${post.data.canonicalKey}/`,
    })),
  });
}
