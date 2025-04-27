import rss from '@astrojs/rss';
import Posts from '../Posts.js'

export async function GET(context) {
  const posts = await Posts.all();
  return rss({
    title: 'Nathan on Software',
    description: 'Nathan\'s Blog',
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date,
      description: post.description,
      link: post.fullPath,
    })),
  });
}
